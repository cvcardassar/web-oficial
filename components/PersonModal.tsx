"use client"

import { urlFor } from "@/lib/image"

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

export default function PersonModal({ person, onClose }: any) {
  if (!person) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-3xl w-full overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HERO */}
        <div className="relative bg-gradient-to-br from-[var(--cardassar-yellow)] via-yellow-500 to-neutral-900 px-8 pt-10 pb-6 text-center">

          {person.photo && (
            <img
              src={urlFor(person.photo).width(1400).url()}
              className="mx-auto w-full max-w-md h-[420px] md:h-[480px] object-cover object-top rounded-xl shadow-2xl"
            />
          )}

          {person.number && (
            <div className="pointer-events-none absolute top-0 right-0 pr-6 pt-4 overflow-hidden">
              <span className="text-[180px] md:text-[260px] font-black leading-none select-none text-white/10 tracking-tight">
                {person.number}
              </span>
            </div>
          )}

        </div>

        <div className="px-8 py-8 text-center">

          <h3 className="text-3xl font-semibold text-neutral-900">
            {person.name}
          </h3>

          <p className="text-neutral-500 mt-2">
            {person.position
              ? positionLabel(person.position)
              : person.role}
          </p>

        </div>

      </div>
    </div>
  )
}