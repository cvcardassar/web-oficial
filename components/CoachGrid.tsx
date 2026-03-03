"use client"

import { useState } from "react"
import { urlFor } from "@/lib/image"
import PersonModal from "@/components/PersonModal"

export default function CoachGrid({ coaches }: any) {
  const [selectedCoach, setSelectedCoach] = useState<any>(null)

  return (
    <>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {coaches.map((c: any, i: number) => (
          <div
            key={i}
            onClick={() => setSelectedCoach(c)}
            className="cursor-pointer bg-white p-4 rounded-xl shadow hover:shadow-lg hover:-translate-y-0.5 transition flex items-center gap-4"
          >
            {c.photo && (
              <img
                src={urlFor(c.photo).width(300).url()}
                className="h-16 w-16 rounded-full object-cover object-top"
              />
            )}

            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-neutral-500">{c.role}</p>
            </div>
          </div>
        ))}
      </div>

      <PersonModal
        person={selectedCoach}
        onClose={() => setSelectedCoach(null)}
      />
    </>
  )
}