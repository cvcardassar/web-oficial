"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
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
    <section className="relative h-[72vh] md:h-[85vh] min-h-[500px] md:min-h-[650px] w-full overflow-hidden">

      {heroes.map((hero: any, i: number) => (
        <div
          key={i}
          className={`
            absolute inset-0 transition-opacity duration-1000
            ${i === index ? "opacity-100" : "opacity-0"}
          `}
        >
          <div className="w-full h-full md:scale-105 animate-heroZoom">
            <Image
              src={urlFor(hero.image)
                .width(1800)
                .height(1200)
                .fit("crop")
                .auto("format")
                .url()}
              alt="Hero image"
              fill
              priority={i === 0}
              className="object-cover object-[center_30%]"
            />
          </div>
        </div>
      ))}

      {/* Overlay més cinematogràfic */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />

      {/* Contingut */}
      <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4">

        <h1 className="
          font-black tracking-tight
          text-[clamp(1.8rem,7vw,3.8rem)]
          leading-tight
        ">
          CLUB VOLEIBOL
        </h1>

        <h2 className="
          font-black tracking-tight
          text-[clamp(2.4rem,10vw,5.5rem)]
          leading-none
          text-[var(--cardassar-yellow)]
        ">
          CARDASSAR
        </h2>

        <p className="mt-4 text-sm sm:text-base text-white/80 tracking-wide">
          Formació · Competició · Comunitat
        </p>

      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 w-5 h-9 border border-white rounded-full flex justify-center">
  <div className="w-1 h-2 bg-white rounded-full mt-2" />
</div>

    </section>
  )
}