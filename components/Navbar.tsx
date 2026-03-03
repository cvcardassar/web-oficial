"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Instagram } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const linkClass = (path: string) =>
    `transition ${
      pathname === path
        ? "text-white underline underline-offset-4"
        : "text-white/80 hover:text-[var(--cardassar-yellow)]"
    }`

  return (
    <header
  className={`fixed top-0 w-full z-50 transition-all duration-300 ${
  isHome
    ? scrolled
      ? "bg-black/70 backdrop-blur shadow-lg border-b border-[var(--cardassar-yellow)]"
      : "bg-transparent"
    : scrolled
    ? "bg-black/80 backdrop-blur shadow-lg border-b border-[var(--cardassar-yellow)]"
    : "bg-black/80 backdrop-blur border-b border-[var(--cardassar-yellow)]"
}`}
>
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="CV Cardassar" width={40} height={40} />
          <span className="font-bold text-white tracking-wide">
            CV Cardassar
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-8 font-semibold">
          <Link href="/" className={linkClass("/")}>Inici</Link>
          <Link href="/noticies" className={linkClass("/noticies")}>Notícies</Link>
          <Link href="/calendari" className={linkClass("/calendari")}>Calendari</Link>
          <Link href="/equips" className={linkClass("/equips")}>Equips</Link>
          <Link href="/club" className={linkClass("/club")}>El club</Link>
          <Link href="/contacte" className={linkClass("/contacte")}>Contacte</Link>
          <a
  href="https://instagram.com/cvcardassar"
  target="_blank"
  className="text-white/80 hover:text-[var(--cardassar-yellow)] transition"
  aria-label="Instagram"
>
  <Instagram size={20} />
</a>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-black/95 backdrop-blur px-6 py-4 space-y-4">
          <Link href="/" className="block text-white">Inici</Link>
          <Link href="/noticies" className="block text-white">Notícies</Link>
          <Link href="/calendari" className="block text-white">Calendari</Link>
          <Link href="/equips" className="block text-white">Equips</Link>
          <Link href="/club" className="block text-white">El club</Link>
          <Link href="/contacte" className="block text-white">Contacte</Link>
        </div>
      )}
    </header>
  )
}