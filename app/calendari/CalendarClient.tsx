"use client"

import { useState, useMemo, useEffect } from "react"
import { urlFor } from "@/lib/image"

type ViewType = "all" | "future" | "results"
type LocationType = "all" | "home" | "away"

function formatMonth(date: Date) {
  return date.toLocaleDateString("ca-ES", {
    month: "long",
    year: "numeric",
  })
}

export default function CalendarClient({ matches }: { matches: any[] }) {
  const [teamFilter, setTeamFilter] = useState<string>("Tots")
  const [view, setView] = useState<ViewType>("all")
  const [locationFilter, setLocationFilter] = useState<LocationType>("all")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const todayString = new Date().toDateString()

  const hasResult = (m: any) =>
    m.setsTeam !== undefined && m.setsOpponent !== undefined

  // TEAMS FILTER
  const teams = useMemo<string[]>(() => {
    const names = matches
      .map((m) => m.teamRef?.title ?? m.team)
      .filter((name): name is string => typeof name === "string")

    return ["Tots", ...Array.from(new Set(names))]
  }, [matches])

  // FILTERED MATCHES
  const filtered = useMemo(() => {
    let base =
      teamFilter === "Tots"
        ? matches
        : matches.filter(
            (m) => (m.teamRef?.title ?? m.team) === teamFilter
          )

    if (view === "future") {
      base = base.filter((m) => !hasResult(m))
    }

    if (view === "results") {
      base = base.filter((m) => hasResult(m))
    }

    if (locationFilter !== "all") {
      base = base.filter((m) => m.homeAway === locationFilter)
    }

    return base
  }, [matches, teamFilter, view, locationFilter])

  // NEXT HOME MATCH
  const nextMatch = useMemo(() => {
    return [...matches]
      .filter((m) => !hasResult(m) && m.homeAway === "home")
      .sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      )[0]
  }, [matches])

  const sortedMatches = useMemo(() => {
    return [...filtered].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }, [filtered])

  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {}

    sortedMatches.forEach((m) => {
      const d = new Date(m.date)
      const key = `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}`

      if (!groups[key]) groups[key] = []
      groups[key].push(m)
    })

    return groups
  }, [sortedMatches])

  const orderedMonths = Object.entries(grouped).sort(([a], [b]) =>
    a.localeCompare(b)
  )

  const viewButtons: { key: ViewType; label: string }[] = [
    { key: "all", label: "Tots" },
    { key: "future", label: "Futurs" },
    { key: "results", label: "Resultats" },
  ]

  const locationButtons: { key: LocationType; label: string }[] = [
    { key: "all", label: "Tots llocs" },
    { key: "home", label: "Casa" },
    { key: "away", label: "Fora" },
  ]

  return (
    <>
      {/* FILTERS */}
      <div className="mb-8">
        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          className="border rounded px-4 py-2"
        >
          {teams.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2 mt-4 mb-6">
          {viewButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setView(btn.key)}
              className={`px-3 py-1 rounded border text-sm ${
                view === btn.key
                  ? "bg-[var(--cardassar-yellow)] text-black border-transparent"
                  : "bg-white"
              }`}
            >
              {btn.label}
            </button>
          ))}

          <div className="w-px bg-neutral-300 mx-2" />

          {locationButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setLocationFilter(btn.key)}
              className={`px-3 py-1 rounded border text-sm ${
                locationFilter === btn.key
                  ? "bg-[var(--cardassar-yellow)] text-black border-transparent"
                  : "bg-white"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* NEXT HOME MATCH STICKY */}
      {nextMatch?.homeAway === "home" && (
        <div className="sticky top-20 z-30 mb-6">
          <div className="rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-800 shadow-lg text-white p-6">
            <p className="text-sm uppercase opacity-70 mb-2">
              Proper partit a casa
            </p>

            <div className="flex justify-between items-center">
              <div className="font-semibold">
                {nextMatch.team}{" "}
                <span className="text-[var(--cardassar-yellow)]">
                  vs
                </span>{" "}
                {nextMatch.opponent}
              </div>

              <div className="text-sm text-right">
                <div>
                  {new Date(nextMatch.date).toLocaleDateString()}
                </div>
                <div>
                  {new Date(nextMatch.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MATCHES BY MONTH */}
      <div className="space-y-10">
        {orderedMonths.map(([monthKey, items]) => {
          const monthLabel = formatMonth(new Date(items[0].date))

          return (
            <div key={monthKey}>
              <h2 className="text-xl font-bold uppercase tracking-wide text-neutral-600 border-b pb-2 mb-4">
                {monthLabel}
              </h2>

              <div className="space-y-4">
                {items.map((m: any) => {
                  const matchDate = new Date(m.date)
                  const isToday =
                    matchDate.toDateString() === todayString

                  return (
                    <div
                      key={m._id}
                      className="bg-white rounded-xl p-5 shadow flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">
                          {m.teamRef?.title ?? m.team}{" "}
                          <span className="text-[var(--cardassar-yellow)]">
                            vs
                          </span>{" "}
                          {m.opponent}
                        </p>

                        <p className="text-sm text-neutral-500">
                          {m.competition}
                          {m.roundLabel && <> · {m.roundLabel}</>}
                          {m.venue && <> · {m.venue}</>}
                        </p>
                        {isToday && (
                          <span className="text-xs bg-[var(--cardassar-yellow)] text-black px-2 py-0.5 rounded">
                            AVUI
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">
                          {matchDate.toLocaleDateString()}
                        </p>

                        <p className="text-sm text-neutral-500">
                          {matchDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                        {hasResult(m) && (
                          <p className="font-bold text-[var(--cardassar-yellow)]">
                            {m.setsTeam} — {m.setsOpponent}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}