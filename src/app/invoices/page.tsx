'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Plus, Search, Receipt, Calendar, AlertCircle, ChevronRight, Mail } from 'lucide-react'
import { useAppData } from '@/lib/data-context'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import type { Invoice } from '@/types'

export default function InvoicesPage() {
  const { invoices, isAuthenticated } = useAppData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sending, setSending] = useState<string | null>(null)
  const [sendResult, setSendResult] = useState<{ id: string; ok: boolean } | null>(null)

  const filtered = invoices.filter(inv => {
    const matchSearch =
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      inv.client_name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalOutstanding = invoices
    .filter(i => i.status !== 'paid' && i.status !== 'cancelled')
    .reduce((sum, i) => sum + (i.total - i.amount_paid), 0)

  async function handleSendInvoice(invoice: Invoice) {
    setSending(invoice.id)
    setSendResult(null)
    try {
      const html = `
        <h2>Invoice ${invoice.invoice_number}</h2>
        <p>Dear ${invoice.client_name},</p>
        <p>Please find your invoice details below:</p>
        <table border="1" cellpadding="6" style="border-collapse:collapse">
          <thead><tr><th>Description</th><th>Qty</th><th>Unit</th><th>Total</th></tr></thead>
          <tbody>
            ${invoice.items.map(i => `<tr><td>${i.description}</td><td>${i.quantity}</td><td>£${i.unit_price}</td><td>£${i.total}</td></tr>`).join('')}
          </tbody>
        </table>
        <p>Subtotal: £${invoice.subtotal} | VAT (${invoice.vat_rate}%): £${invoice.vat_amount} | <strong>Total: £${invoice.total}</strong></p>
        <p>Due date: ${formatDate(invoice.due_date)}</p>
      `
      const res = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: '', subject: `Invoice ${invoice.invoice_number}`, html }),
      })
      setSendResult({ id: invoice.id, ok: res.ok })
    } catch {
      setSendResult({ id: invoice.id, ok: false })
    } finally {
      setSending(null)
    }
  }

  return (
    <AppShell>
      <TopBar title="Invoices" subtitle={`${invoices.length} total invoices`} />
      <div className="p-6 space-y-4">
        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Outstanding', value: totalOutstanding, color: 'text-orange-400' },
            { label: 'Paid (this month)', value: 798, color: 'text-green-400' },
            { label: 'Overdue', value: 870, color: 'text-red-400' },
          ].map(item => (
            <Card key={item.label} className="border-[#2a2a2a]">
              <CardContent className="p-3 text-center">
                <div className={`text-base font-bold ${item.color}`}>{formatCurrency(item.value)}</div>
                <div className="text-[11px] text-[#71717a]">{item.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
            <Input
              placeholder="Search invoices..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full sm:w-44">
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          <Button className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>

        <div className="space-y-3">
          {filtered.map(invoice => (
            <Card key={invoice.id} className={`border-[#2a2a2a] hover:border-primary/30 transition-colors cursor-pointer ${invoice.status === 'overdue' ? 'border-red-500/30' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Receipt className="w-3.5 h-3.5 text-green-400" />
                      </div>
                      <span className="font-medium text-[#f5f5f5]">{invoice.invoice_number}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                      {invoice.status === 'overdue' && (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div className="text-sm text-[#71717a] mb-2 pl-9">{invoice.client_name}</div>
                    <div className="flex items-center gap-1 text-xs text-[#71717a] pl-9">
                      <Calendar className="w-3 h-3" />
                      Due: {formatDate(invoice.due_date)}
                    </div>
                    {invoice.amount_paid > 0 && invoice.amount_paid < invoice.total && (
                      <div className="mt-2 pl-9">
                        <div className="text-xs text-[#71717a]">
                          Paid: {formatCurrency(invoice.amount_paid)} of {formatCurrency(invoice.total)}
                        </div>
                        <div className="w-full bg-[#2a2a2a] rounded-full h-1.5 mt-1">
                          <div
                            className="bg-green-400 h-1.5 rounded-full"
                            style={{ width: `${(invoice.amount_paid / invoice.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-sm font-bold text-[#f5f5f5]">{formatCurrency(invoice.total)}</span>
                    <span className="text-xs text-[#71717a]">inc. VAT</span>
                    {isAuthenticated && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-2"
                        disabled={sending === invoice.id}
                        onClick={(e) => { e.stopPropagation(); handleSendInvoice(invoice) }}
                        aria-label={`Send invoice ${invoice.invoice_number} via Gmail`}
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        {sending === invoice.id ? 'Sending…' : sendResult?.id === invoice.id ? (sendResult.ok ? 'Sent ✓' : 'Failed') : 'Send'}
                      </Button>
                    )}
                    <ChevronRight className="w-4 h-4 text-[#71717a]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
