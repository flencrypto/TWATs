'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#f5f5f5]">TWATS</h1>
            <p className="text-sm text-[#71717a] mt-1">The Work and Therapy System</p>
          </div>
        </div>

        {/* Sign in card */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-6 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-base font-semibold text-[#f5f5f5]">Sign in to sync your data</h2>
            <p className="text-xs text-[#71717a]">
              Your data is stored securely in your own Google Drive
            </p>
          </div>

          <Button
            className="w-full flex items-center justify-center gap-3"
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            {/* Google icon */}
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a2a2a]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#1e1e1e] px-2 text-[#71717a]">or</span>
            </div>
          </div>

          <Link href="/">
            <Button variant="outline" className="w-full">
              Continue without signing in
            </Button>
          </Link>
        </div>

        <p className="text-center text-[11px] text-[#71717a]">
          Signing in grants TWATS access to your Google Drive (to store your data) and Gmail (to send invoices and quotes). No data is shared with third parties.
        </p>
      </div>
    </div>
  )
}
