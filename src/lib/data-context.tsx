'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import {
  DEMO_CLIENTS,
  DEMO_JOBS,
  DEMO_QUOTES,
  DEMO_INVOICES,
  DEMO_CERTIFICATES,
} from '@/lib/demo-data'
import type { Client, Job, Quote, Invoice, Certificate } from '@/types'

interface AppData {
  clients: Client[]
  jobs: Job[]
  quotes: Quote[]
  invoices: Invoice[]
  certificates: Certificate[]
  isLoading: boolean
  isAuthenticated: boolean
  saveClients: (data: Client[]) => Promise<void>
  saveJobs: (data: Job[]) => Promise<void>
  saveQuotes: (data: Quote[]) => Promise<void>
  saveInvoices: (data: Invoice[]) => Promise<void>
  saveCertificates: (data: Certificate[]) => Promise<void>
}

const AppDataContext = createContext<AppData | null>(null)

async function fetchCollection<T>(collection: string, fallback: T[]): Promise<T[]> {
  try {
    const res = await fetch(`/api/drive/${collection}`)
    if (!res.ok) return fallback
    const data: T[] = await res.json() as T[]
    return data.length > 0 ? data : fallback
  } catch {
    return fallback
  }
}

async function saveCollection<T>(collection: string, data: T[]): Promise<void> {
  await fetch(`/api/drive/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  const [clients, setClients] = useState<Client[]>(DEMO_CLIENTS)
  const [jobs, setJobs] = useState<Job[]>(DEMO_JOBS)
  const [quotes, setQuotes] = useState<Quote[]>(DEMO_QUOTES)
  const [invoices, setInvoices] = useState<Invoice[]>(DEMO_INVOICES)
  const [certificates, setCertificates] = useState<Certificate[]>(DEMO_CERTIFICATES)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!isAuthenticated) {
      setClients(DEMO_CLIENTS)
      setJobs(DEMO_JOBS)
      setQuotes(DEMO_QUOTES)
      setInvoices(DEMO_INVOICES)
      setCertificates(DEMO_CERTIFICATES)
      return
    }

    setIsLoading(true)
    Promise.all([
      fetchCollection<Client>('clients', DEMO_CLIENTS),
      fetchCollection<Job>('jobs', DEMO_JOBS),
      fetchCollection<Quote>('quotes', DEMO_QUOTES),
      fetchCollection<Invoice>('invoices', DEMO_INVOICES),
      fetchCollection<Certificate>('certificates', DEMO_CERTIFICATES),
    ]).then(([c, j, q, i, cert]) => {
      setClients(c)
      setJobs(j)
      setQuotes(q)
      setInvoices(i)
      setCertificates(cert)
      setIsLoading(false)
    }).catch(() => setIsLoading(false))
  }, [isAuthenticated, status, session])

  const saveClients = useCallback(async (data: Client[]) => {
    setClients(data)
    if (isAuthenticated) await saveCollection('clients', data)
  }, [isAuthenticated])

  const saveJobs = useCallback(async (data: Job[]) => {
    setJobs(data)
    if (isAuthenticated) await saveCollection('jobs', data)
  }, [isAuthenticated])

  const saveQuotes = useCallback(async (data: Quote[]) => {
    setQuotes(data)
    if (isAuthenticated) await saveCollection('quotes', data)
  }, [isAuthenticated])

  const saveInvoices = useCallback(async (data: Invoice[]) => {
    setInvoices(data)
    if (isAuthenticated) await saveCollection('invoices', data)
  }, [isAuthenticated])

  const saveCertificates = useCallback(async (data: Certificate[]) => {
    setCertificates(data)
    if (isAuthenticated) await saveCollection('certificates', data)
  }, [isAuthenticated])

  return (
    <AppDataContext.Provider
      value={{
        clients,
        jobs,
        quotes,
        invoices,
        certificates,
        isLoading,
        isAuthenticated,
        saveClients,
        saveJobs,
        saveQuotes,
        saveInvoices,
        saveCertificates,
      }}
    >
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData(): AppData {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
