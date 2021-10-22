import React, { FC, ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="App">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
