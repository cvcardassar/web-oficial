"use client"

import { useEffect, useState } from "react"
import { urlFor } from "@/lib/image"

export default function HomeHero({ heroes }: any) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % heroes.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [heroes.length])

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">

      {heroes.map((hero: any, i: number) => (
  <div
    key={i}
    className={`
      absolute inset-0
      transition-opacity duration-1000
      ${i === index ? "opacity-100" : "opacity-0"}
    `}
  >
    <div className="w-full h-full animate-heroZoom">

      <img
        src={urlFor(hero.image)
          .width(2400)
          .height(1400)
          .fit("crop")
          .auto("format")
          .url()}
        className="w-full h-full object-cover object-[center_30%]"
      />

    </div>
  </div>
))}

      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/35" />

      <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-6">

        <h1 className="text-5xl md:text-7xl font-black">
          CLUB VOLEIBOL
        </h1>

        <h2 className="text-6xl md:text-8xl font-black text-[var(--cardassar-yellow)]">
          CARDASSAR
        </h2>

        <p className="mt-6 text-lg text-white/80">
          Formació · Competició · Comunitat
        </p>

      </div>

    </section>
  )
}