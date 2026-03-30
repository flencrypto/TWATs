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
  loadError: string | null
  saveClients: (data: Client[]) => Promise<void>
  saveJobs: (data: Job[]) => Promise<void>
  saveQuotes: (data: Quote[]) => Promise<void>
  saveInvoices: (data: Invoice[]) => Promise<void>
  saveCertificates: (data: Certificate[]) => Promise<void>
}

const AppDataContext = createContext<AppData | null>(null)

async function fetchCollection<T>(collection: string): Promise<T[]> {
  const res = await fetch(`/api/drive/${collection}`)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching collection '${collection}'`)
  }
  return (await res.json()) as T[]
}

async function saveCollection<T>(collection: string, data: T[]): Promise<void> {
  const res = await fetch(`/api/drive/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} saving collection '${collection}'`)
  }
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const isAuthenticated = status === 'authenticated'

  const [clients, setClients] = useState<Client[]>(DEMO_CLIENTS)
  const [jobs, setJobs] = useState<Job[]>(DEMO_JOBS)
  const [quotes, setQuotes] = useState<Quote[]>(DEMO_QUOTES)
  const [invoices, setInvoices] = useState<Invoice[]>(DEMO_INVOICES)
  const [certificates, setCertificates] = useState<Certificate[]>(DEMO_CERTIFICATES)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!isAuthenticated) {
      setClients(DEMO_CLIENTS)
      setJobs(DEMO_JOBS)
      setQuotes(DEMO_QUOTES)
      setInvoices(DEMO_INVOICES)
      setCertificates(DEMO_CERTIFICATES)
      setIsLoading(false)
      setLoadError(null)
      return
    }

    setIsLoading(true)
    setLoadError(null)
    Promise.all([
      fetchCollection<Client>('clients'),
      fetchCollection<Job>('jobs'),
      fetchCollection<Quote>('quotes'),
      fetchCollection<Invoice>('invoices'),
      fetchCollection<Certificate>('certificates'),
    ])
      .then(([c, j, q, i, cert]) => {
        setClients(c)
        setJobs(j)
        setQuotes(q)
        setInvoices(i)
        setCertificates(cert)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err)
        console.error('Failed to load data from Drive:', msg)
        setLoadError('Failed to load data from Google Drive. Showing local data.')
        setIsLoading(false)
      })
  }, [isAuthenticated, status])

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
        loadError,
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
