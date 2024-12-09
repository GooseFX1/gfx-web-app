import { PASSWORD_BETA_ACCESS } from '@/pages/FarmV4/constants'
import { PasswordProtectionPage } from '@/pages/FarmV4/PasswordProtection'
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { toast } from 'sonner'

type PasswordContextType = {
  isAuthenticated: boolean
}

type PasswordProviderProps = {
  children: ReactNode
}

const PW_KEY = 'gfx-beta-access'

const PasswordContext = createContext<PasswordContextType | undefined>(undefined)

export const PasswordProvider: React.FC<PasswordProviderProps> = ({ children }) => {
  const [hasAccess, setHasAccess] = useState<boolean>(isAuthenticated())

  const handlePasswordSubmit = (inputPassword: string) => {
    if (inputPassword === PASSWORD_BETA_ACCESS) {
      localStorage.setItem(PW_KEY, PASSWORD_BETA_ACCESS)
      setHasAccess(true)
    } else {
      toast.error('Incorrect Beta Code')
    }
  }

  if (!hasAccess) {
    return <PasswordProtectionPage onSubmit={handlePasswordSubmit} />
  }

  return <PasswordContext.Provider value={{ isAuthenticated: hasAccess }}>{children}</PasswordContext.Provider>
}

export const isAuthenticated = (): boolean => localStorage.getItem(PW_KEY) === PASSWORD_BETA_ACCESS

export const usePassword = (): PasswordContextType => {
  const context = useContext(PasswordContext)
  if (!context) {
    throw new Error('usePassword must be used within a PasswordProvider')
  }
  return context
}
