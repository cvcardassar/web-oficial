"use client"

import { useState } from "react"
import { urlFor } from "@/lib/image"
import PersonModal from "@/components/PersonModal"

function positionLabel(pos?: string) {
  const map: Record<string, string> = {
    setter: "Col·locador/a",
    middle: "Central",
    opposite: "Oposat/da",
    outside: "Receptor/a",
    libero: "Libero",
  }
  return map[pos || ""] || pos
}

export default function TeamRoster({ players }: any) {
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)

  return (
    <>
      {/* GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {players.map((p: any, i: number) => (
          <div
            key={i}
            onClick={() => setSelectedPlayer(p)}
            className="cursor-pointer bg-white p-4 rounded-xl shadow hover:shadow-lg hover:-translate-y-0.5 transition flex items-center gap-4"
          >
            {p.photo && (
              <img
                src={urlFor(p.photo).width(300).url()}
                className="h-16 w-16 rounded-full object-cover object-top"
              />
            )}

            <div className="flex-1">
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-neutral-500">
                {positionLabel(p.position)}
              </p>
            </div>

            {p.number && (
              <span className="text-xl font-bold text-neutral-300">
                {p.number}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      <PersonModal
  person={selectedPlayer}
  onClose={() => setSelectedPlayer(null)}
/>
    </>
  )
}