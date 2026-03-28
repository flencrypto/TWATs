'use client'

import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { AppShell } from '@/components/layout/AppShell'
import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { User, Building, Bell, Shield, Cloud, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [fullName, setFullName] = useState('John Davies')
  const [email, setEmail] = useState('john.davies@sparky.co.uk')
  const [trade, setTrade] = useState('electrical')
  const [jurisdiction, setJurisdiction] = useState('england')
  const [vatRegistered, setVatRegistered] = useState(false)
  const [companyName, setCompanyName] = useState('JD Electrical Services')
  const [notifications, setNotifications] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AppShell>
      <TopBar title="Settings" subtitle="Manage your account and preferences" />
      <div className="p-6 space-y-6 max-w-2xl">

        {/* Profile */}
        <Card className="border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4 text-primary" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trade</Label>
                <Select value={trade} onChange={e => setTrade(e.target.value)}>
                  <option value="electrical">Electrician</option>
                  <option value="plumbing">Plumber</option>
                  <option value="carpentry">Carpenter</option>
                  <option value="building">Builder</option>
                  <option value="gas">Gas Engineer</option>
                  <option value="other">Other</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Jurisdiction</Label>
                <Select value={jurisdiction} onChange={e => setJurisdiction(e.target.value)}>
                  <option value="england">England</option>
                  <option value="wales">Wales</option>
                  <option value="scotland">Scotland</option>
                  <option value="northern_ireland">Northern Ireland</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business */}
        <Card className="border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building className="w-4 h-4 text-primary" />
              Business Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Company / Trading Name</Label>
              <Input value={companyName} onChange={e => setCompanyName(e.target.value)} />
            </div>
            <div className="flex items-center justify-between p-3 bg-[#111111] rounded-lg border border-[#2a2a2a]">
              <div>
                <div className="text-sm text-[#f5f5f5]">VAT Registered</div>
                <div className="text-xs text-[#71717a]">Enable VAT on quotes and invoices</div>
              </div>
              <button
                onClick={() => setVatRegistered(!vatRegistered)}
                className={`w-12 h-6 rounded-full transition-colors ${vatRegistered ? 'bg-primary' : 'bg-[#2a2a2a]'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white mx-0.5 transition-transform ${vatRegistered ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            {vatRegistered && (
              <div className="space-y-2">
                <Label>VAT Number</Label>
                <Input placeholder="GB123456789" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="w-4 h-4 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Invoice reminders', desc: 'Overdue and upcoming invoice alerts' },
              { label: 'Certificate expiry', desc: 'Alerts when certs are due to expire' },
              { label: 'Quote follow-ups', desc: 'Remind you to chase open quotes' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#111111] rounded-lg border border-[#2a2a2a]">
                <div>
                  <div className="text-sm text-[#f5f5f5]">{item.label}</div>
                  <div className="text-xs text-[#71717a]">{item.desc}</div>
                </div>
                <div className={`w-12 h-6 rounded-full ${notifications ? 'bg-primary' : 'bg-[#2a2a2a]'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white mx-0.5 mt-0.5 transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Google Account */}
        <Card className="border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Cloud className="w-4 h-4 text-green-400" />
              Google Account &amp; Data Sync
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {session ? (
              <>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-400">
                  Connected as <span className="font-medium">{session.user?.email}</span>
                </div>
                <p className="text-xs text-[#71717a]">
                  Your data is synced to your Google Drive (TWATS Data folder). Gmail is available to send invoices and quotes.
                </p>
                <Button
                  variant="outline"
                  className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out of Google
                </Button>
              </>
            ) : (
              <>
                <p className="text-xs text-[#71717a]">
                  Sign in with Google to sync your data to Drive and send emails via Gmail.
                </p>
                <Button onClick={() => signIn('google', { callbackUrl: '/settings' })}>
                  Connect Google Account
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="w-4 h-4 text-[#0ea5e9]" />
              Privacy & Therapy Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 rounded-lg text-sm text-[#4a7fa5]">
              Your Mind Space (therapy) data is stored completely separately from your work data. It is never included in exports, reports, or any business records. You can delete your therapy history at any time.
            </div>
            <Button variant="outline" className="mt-4 text-red-400 border-red-500/30 hover:bg-red-500/10">
              Delete therapy history
            </Button>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full">
          {saved ? '✓ Saved!' : 'Save Changes'}
        </Button>
      </div>
    </AppShell>
  )
}
