'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Mail, Phone, MapPin, Briefcase } from 'lucide-react'
import { useAppData } from '@/lib/data-context'
import { formatCurrency } from '@/lib/utils'

export default function ClientsPage() {
  const { clients } = useAppData()
  const [search, setSearch] = useState('')

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppShell>
      <TopBar title="Clients" subtitle={`${clients.length} clients`} />
      <div className="p-6 space-y-4">
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
            <Input
              placeholder="Search clients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(client => (
            <Card key={client.id} className="border-[#2a2a2a] hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[#f5f5f5]">{client.name}</h3>
                    {client.notes && (
                      <p className="text-xs text-[#71717a] mt-0.5">{client.notes}</p>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-sm font-bold">
                      {client.name.charAt(0)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  {client.email && (
                    <div className="flex items-center gap-2 text-xs text-[#71717a]">
                      <Mail className="w-3 h-3" />
                      {client.email}
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-xs text-[#71717a]">
                      <Phone className="w-3 h-3" />
                      {client.phone}
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center gap-2 text-xs text-[#71717a]">
                      <MapPin className="w-3 h-3" />
                      {client.address}
                      {client.postcode && `, ${client.postcode}`}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-[#2a2a2a]">
                  <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
                    <Briefcase className="w-3 h-3" />
                    <span>{client.job_count || 0} jobs</span>
                  </div>
                  <div className="text-xs text-green-400 font-medium">
                    {formatCurrency(client.total_billed || 0)} billed
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
