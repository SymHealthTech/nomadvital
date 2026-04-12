'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileStickyBar from './MobileStickyBar'
import InstallBanner from './InstallBanner'
import BackPressGuard from './BackPressGuard'

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const isAsk = pathname === '/ask'

  return (
    <>
      {!isAdmin && <Navbar />}
      {!isAdmin && <InstallBanner />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer mobileHidden={isAsk} />}
      {!isAdmin && <MobileStickyBar />}
      {!isAdmin && <BackPressGuard />}
    </>
  )
}
