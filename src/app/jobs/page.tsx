'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Plus, Search, MapPin, Clock, ChevronRight } from 'lucide-react'
import { useAppData } from '@/lib/data-context'
import { getStatusColor, getPriorityColor } from '@/lib/utils'

export default function JobsPage() {
  const { jobs } = useAppData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.client_name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || j.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <AppShell>
      <TopBar title="Jobs" subtitle={`${jobs.length} total jobs`} />
      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
            <Input
              placeholder="Search jobs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full sm:w-44">
            <option value="all">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="invoiced">Invoiced</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          <Button className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            New Job
          </Button>
        </div>

        {/* Job cards */}
        <div className="space-y-3">
          {filtered.map(job => (
            <Card key={job.id} className="border-[#2a2a2a] hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-medium text-[#f5f5f5] truncate">{job.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(job.status)}`}>
                        {job.status.replace('_', ' ')}
                      </span>
                      <span className={`text-xs font-medium ${getPriorityColor(job.priority)}`}>
                        {job.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-[#71717a] mb-2">{job.client_name}</div>
                    <div className="flex flex-wrap gap-4 text-xs text-[#71717a]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.client_address}
                      </span>
                      {job.scheduled_date && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {job.scheduled_date} {job.start_time || ''}
                        </span>
                      )}
                    </div>
                    {job.tags && job.tags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {job.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 bg-[#1a1a1a] text-[#71717a] rounded-full border border-[#2a2a2a]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {job.total_cost && (
                      <span className="text-sm font-semibold text-[#f5f5f5]">
                        £{job.total_cost.toLocaleString('en-GB')}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-[#71717a]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#71717a]">
              No jobs found matching your search.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
