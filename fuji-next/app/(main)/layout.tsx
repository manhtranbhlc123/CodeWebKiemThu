'use client'
import type { ReactNode } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import { Provider } from "react-redux"
import store from "../store"

export default function MainLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
<div className="flex flex-col min-h-screen">
      <Header initialAuth={false} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

