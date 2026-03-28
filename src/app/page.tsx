'use client'

import { AppShell } from '@/components/layout/AppShell'
import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Briefcase,
  AlertCircle,
  FileText,
  Award,
  TrendingUp,
  Clock,
  Zap,
  CheckCircle,
  UserPlus,
} from 'lucide-react'
import { useAppData } from '@/lib/data-context'
import { DEMO_STATS, DEMO_ACTIVITIES } from '@/lib/demo-data'
import { formatCurrency, formatDateTime, getStatusColor } from '@/lib/utils'
import Link from 'next/link'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  CheckCircle,
  FileCheck: FileText,
  Award,
  UserPlus,
}

export default function DashboardPage() {
  const { jobs } = useAppData()
  const stats = DEMO_STATS
  const todayJobs = jobs.filter(j => j.status === 'in_progress' || j.status === 'scheduled').slice(0, 3)

  return (
    <AppShell>
      <TopBar title="Dashboard" subtitle="Monday, 15 July 2024" />
      <div className="p-6 space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-[#2a2a2a]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#71717a] font-medium">Today&apos;s Jobs</span>
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#f5f5f5]">{stats.todaysJobs}</div>
              <div className="text-xs text-[#71717a] mt-1">Active today</div>
            </CardContent>
          </Card>

          <Card className="border-[#2a2a2a]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#71717a] font-medium">Overdue</span>
                <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-red-400">{stats.overdueInvoices}</div>
              <div className="text-xs text-[#71717a] mt-1">Invoice overdue</div>
            </CardContent>
          </Card>

          <Card className="border-[#2a2a2a]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#71717a] font-medium">Pending Quotes</span>
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-orange-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#f5f5f5]">{stats.pendingQuotes}</div>
              <div className="text-xs text-[#71717a] mt-1">Awaiting response</div>
            </CardContent>
          </Card>

          <Card className="border-[#2a2a2a]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#71717a] font-medium">Expiring Certs</span>
                <div className="w-7 h-7 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5 text-yellow-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-yellow-400">{stats.expiringCerts}</div>
              <div className="text-xs text-[#71717a] mt-1">Next 30 days</div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-[#2a2a2a] bg-gradient-to-br from-[#1e1e1e] to-[#111111]">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs text-[#71717a]">Total Revenue (YTD)</span>
              </div>
              <div className="text-3xl font-bold text-[#f5f5f5]">{formatCurrency(stats.totalRevenue)}</div>
            </CardContent>
          </Card>
          <Card className="border-[#2a2a2a] bg-gradient-to-br from-[#1e1e1e] to-[#111111]">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-[#71717a]">Outstanding Amount</span>
              </div>
              <div className="text-3xl font-bold text-orange-400">{formatCurrency(stats.outstandingAmount)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's jobs */}
          <Card className="border-[#2a2a2a]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Active Jobs</CardTitle>
                <Link href="/jobs">
                  <Button variant="ghost" size="sm" className="text-xs text-[#71717a]">View all</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayJobs.map(job => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#f5f5f5] truncate">{job.title}</div>
                      <div className="text-xs text-[#71717a] truncate">{job.client_name}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(job.status)}`}>
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card className="border-[#2a2a2a]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {DEMO_ACTIVITIES.slice(0, 4).map(activity => {
                const Icon = iconMap[activity.icon] || Zap
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1e1e1e] flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#f5f5f5]">{activity.title}</div>
                      <div className="text-xs text-[#71717a] truncate">{activity.description}</div>
                      <div className="text-[11px] text-[#71717a] mt-0.5">{formatDateTime(activity.timestamp)}</div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-semibold text-[#71717a] mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { href: '/jobs', label: 'New Job', icon: Briefcase, color: 'text-blue-400' },
              { href: '/quotes', label: 'New Quote', icon: FileText, color: 'text-orange-400' },
              { href: '/invoices', label: 'New Invoice', icon: AlertCircle, color: 'text-green-400' },
              { href: '/certificates', label: 'New Cert', icon: Award, color: 'text-purple-400' },
            ].map(action => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <Card className="border-[#2a2a2a] hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${action.color}`} />
                      <span className="text-sm text-[#f5f5f5]">{action.label}</span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
