// if you want to use react hooks and access browser feature so you make
// the component client side by adding 'use client' at the toip of the file
'use client'


import { SessionProvider } from "next-auth/react"

export default function App({
  children,
  
}: { children: React.ReactNode }) {
  return (
    <SessionProvider >
      {children}
    </SessionProvider>
  )
}