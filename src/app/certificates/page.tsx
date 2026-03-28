'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Plus, Search, Award, Bot, Calendar, ChevronRight } from 'lucide-react'
import { useAppData } from '@/lib/data-context'
import { formatDate, getStatusColor } from '@/lib/utils'

const CERT_LABELS: Record<string, string> = {
  EIC: 'Electrical Installation Certificate',
  MEIWC: 'Minor Electrical Installation Works Certificate',
  EICR: 'Electrical Installation Condition Report',
  risk_assessment: 'Risk Assessment',
  method_statement: 'Method Statement',
  job_completion: 'Job Completion Certificate',
}

export default function CertificatesPage() {
  const { certificates } = useAppData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = certificates.filter(c => {
    const matchSearch =
      (c.cert_number || '').toLowerCase().includes(search.toLowerCase()) ||
      c.client_name.toLowerCase().includes(search.toLowerCase()) ||
      c.property_address.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <AppShell>
      <TopBar title="Certificates" subtitle={`${certificates.length} certificates`} />
      <div className="p-6 space-y-4">
        {/* AI note banner */}
        <div className="flex items-start gap-3 p-4 bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 rounded-xl">
          <Bot className="w-5 h-5 text-[#0ea5e9] shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-[#0ea5e9]">AI-Assisted Certificates</div>
            <div className="text-xs text-[#71717a] mt-1">
              AI can help draft certificate wording and observations. All AI-assisted certs are flagged and must be reviewed and signed by you before issue.
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
            <Input
              placeholder="Search certificates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full sm:w-44">
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="reviewed">Reviewed</option>
            <option value="issued">Issued</option>
          </Select>
          <Button className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            New Certificate
          </Button>
        </div>

        <div className="space-y-3">
          {filtered.map(cert => (
            <Card key={cert.id} className="border-[#2a2a2a] hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Award className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                      <span className="font-medium text-[#f5f5f5]">{cert.cert_type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(cert.status)}`}>
                        {cert.status}
                      </span>
                      {cert.ai_assisted && (
                        <span className="text-xs px-2 py-0.5 rounded-full border bg-[#0ea5e9]/20 text-[#0ea5e9] border-[#0ea5e9]/30 flex items-center gap-1">
                          <Bot className="w-2.5 h-2.5" />
                          AI assisted
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#71717a] pl-9 mb-0.5">
                      {CERT_LABELS[cert.cert_type] || cert.cert_type}
                    </div>
                    <div className="text-sm text-[#71717a] pl-9 mb-1">{cert.client_name}</div>
                    <div className="text-xs text-[#71717a] pl-9 mb-2">{cert.property_address}</div>
                    {cert.issued_date && (
                      <div className="flex items-center gap-1 text-xs text-[#71717a] pl-9">
                        <Calendar className="w-3 h-3" />
                        Issued: {formatDate(cert.issued_date)}
                        {cert.cert_number && ` · ${cert.cert_number}`}
                      </div>
                    )}
                    {cert.notes && (
                      <div className="mt-1.5 pl-9 text-xs text-yellow-400/80 bg-yellow-500/10 rounded px-2 py-1">
                        {cert.notes}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#71717a] shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
