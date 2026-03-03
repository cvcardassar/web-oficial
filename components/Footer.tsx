import Link from "next/link"
import Image from "next/image"
import { Instagram } from "lucide-react"


export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-neutral-950 to-black text-white border-t border-[var(--cardassar-yellow)]">

      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

        {/* CLUB */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image src="/logo.png" alt="CV Cardassar" width={40} height={40} />
            <span className="font-semibold text-lg">CV Cardassar</span>
          </div>

          <p className="text-sm text-white/70 leading-relaxed">
            Club de voleibol de Sant Llorenç des Cardassar.
            Formació, competició i passió pel voleibol.
          </p>
        </div>

        {/* NAVEGACIÓ */}
        <div>
          <h3 className="font-semibold mb-4 text-white/90">Navegació</h3>

          <div className="flex flex-col gap-2 text-sm">
            <Link href="/" className="hover:text-[var(--cardassar-yellow)]">Inici</Link>
            <Link href="/noticies" className="hover:text-[var(--cardassar-yellow)]">Notícies</Link>
            <Link href="/calendari" className="hover:text-[var(--cardassar-yellow)]">Calendari</Link>
            <Link href="/equips" className="hover:text-[var(--cardassar-yellow)]">Equips</Link>
            <Link href="/club" className="hover:text-[var(--cardassar-yellow)]">El club</Link>
            <Link href="/contacte" className="hover:text-[var(--cardassar-yellow)]">Contacte</Link>
          </div>
        </div>

        {/* CONTACTE */}
        <div>
          <h3 className="font-semibold mb-4 text-white/90">Contacte</h3>

          <div className="text-sm text-white/70 space-y-2">
            <p>📍 Sant Llorenç des Cardassar</p>
            <p>📧 cvcardassar@gmail.com</p>
            <p>
  <a
    href="https://instagram.com/cvcardassar"
    target="_blank"
    className="inline-flex items-center gap-2 text-white/80 hover:text-[var(--cardassar-yellow)] transition"
    aria-label="Instagram"
  >
    <Instagram size={20} />
    @cvcardassar
  </a>
</p>
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10 text-center text-xs text-white/50 py-4">
        © {new Date().getFullYear()} CV Cardassar · Tots els drets reservats
      </div>

    </footer>
  )
}