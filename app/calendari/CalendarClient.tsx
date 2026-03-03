"use client"

import { useState, useMemo, useEffect } from "react"
import { urlFor } from "@/lib/image"

function formatMonth(date: Date) {
  return date.toLocaleDateString("ca-ES", {
    month: "long",
    year: "numeric",
  })
}

export default function CalendarClient({ matches }: any) {
  const [teamFilter, setTeamFilter] = useState("Tots")
const [view, setView] = useState<"all" | "future" | "results">("all")
const [locationFilter, setLocationFilter] = useState("all")

const [scrolled, setScrolled] = useState(false)

useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 120)
  window.addEventListener("scroll", onScroll)
  return () => window.removeEventListener("scroll", onScroll)
}, [])

  const todayString = new Date().toDateString()

  const hasResult = (m: any) =>
  m.setsTeam !== undefined && m.setsOpponent !== undefined

  const teams = useMemo<string[]>(() => {
  const names = (matches as any[])
    .map((m) => m.teamRef?.title ?? m.team)
    .filter((name): name is string => typeof name === "string")

  return ["Tots", ...Array.from(new Set(names))]
}, [matches])

  const filtered = useMemo(() => {
  let base =
    teamFilter === "Tots"
      ? matches
      : matches.filter(
  (m: any) =>
    (m.teamRef?.title || m.team) === teamFilter
)

  if (view === "future") {
    base = base.filter((m: any) => !hasResult(m))
  }

  if (view === "results") {
    base = base.filter((m: any) => hasResult(m))
  }

  if (locationFilter !== "all") {
  base = base.filter((m: any) => m.homeAway === locationFilter)
}

  return base
}, [matches, teamFilter, view, locationFilter])

const nextMatch = useMemo(() => {
  return [...matches]
    .filter(
      (m: any) =>
        !hasResult(m) && m.homeAway === "home"
    )
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

    sortedMatches.forEach((m: any) => {
      const d = new Date(m.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`

      if (!groups[key]) groups[key] = []
      groups[key].push(m)
    })

    return groups
  }, [sortedMatches])

  const orderedMonths = Object.entries(grouped).sort(([a], [b]) =>
    a.localeCompare(b)
  )

  return (
    <>
      {/* FILTRE */}
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

  {/* Estat */}
  {[
    { key: "all", label: "Tots" },
    { key: "future", label: "Futurs" },
    { key: "results", label: "Resultats" },
  ].map((btn) => (
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

  {/* Localització */}
  {[
    { key: "all", label: "Tots llocs" },
    { key: "home", label: "Casa" },
    { key: "away", label: "Fora" },
  ].map((btn) => (
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

{nextMatch?.homeAway === "home" && (
  <div className="sticky top-16 sm:top-20 z-30 mb-6">
    <div
      className={`rounded-2xl bg-gradient-to-r from-neutral-900/95 to-neutral-800/95 backdrop-blur shadow-lg text-white transition-all duration-300 ${
        scrolled ? "p-3 sm:p-4 scale-[0.98]" : "p-6"
      }`}
    >

    <p className="text-sm uppercase opacity-70 mb-2">
      Proper partit a casa
    </p>

    {scrolled ? (

  /* SCOREBOARD COMPACTE */
  <div className="flex items-center justify-between gap-4">

    <div className="flex items-center gap-2 font-semibold">

      <span>{nextMatch.team}</span>

      <span className="text-[var(--cardassar-yellow)]">vs</span>

      <span>{nextMatch.opponent}</span>

    </div>

    <div className="text-sm opacity-80 text-right leading-tight">

  <div>
    {new Date(nextMatch.date).toLocaleDateString("ca-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })}
  </div>

  <div>
    {new Date(nextMatch.date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </div>

</div>

  </div>

) : (

  /* HERO NORMAL */
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

    <div>
      <p className="text-xl font-semibold">
        {nextMatch.team} vs {nextMatch.opponent}
      </p>

      <p className="text-sm opacity-80">
        {nextMatch.competition} · {nextMatch.venue}
      </p>
    </div>

    <div className="text-left sm:text-right">
      <p className="font-semibold">
        {new Date(nextMatch.date).toLocaleDateString()}
      </p>

      <p className="text-sm opacity-80">
        {new Date(nextMatch.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>

  </div>

)}
  </div>
  </div>
)}

      {/* LLISTA PER MES */}
      <div className="space-y-10">

        {orderedMonths.map(([monthKey, items]) => {
          const monthLabel = formatMonth(new Date(items[0].date))

          return (
            <div key={monthKey}>

              <h2 className="sticky top-20 z-10 bg-neutral-100/90 backdrop-blur px-2 py-3 mb-4 text-xl font-bold uppercase tracking-wide text-neutral-600 border-b">
                {monthLabel}
              </h2>

              <div className="relative space-y-6">

                {/* Línia timeline */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-neutral-300" />

                {items.map((m: any) => {
                  const matchDate = new Date(m.date)
                  const isToday = matchDate.toDateString() === todayString

                  const hasResult =
                    m.setsTeam !== undefined && m.setsOpponent !== undefined

                  let resultClass = ""

                  if (hasResult) {
                    if (m.setsTeam > m.setsOpponent)
                      resultClass = "border-l-4 border-green-500"
                    else if (m.setsTeam < m.setsOpponent)
                      resultClass = "border-l-4 border-red-500"
                    else resultClass = "border-l-4 border-gray-400"
                  }

                  const dotClass = hasResult
                    ? m.setsTeam > m.setsOpponent
                      ? "bg-green-500"
                      : "bg-red-500"
                    : isToday
                    ? "bg-yellow-400"
                    : "bg-neutral-400"

                  return (
                    <div key={m._id} className="relative pl-10 sm:pl-12">

                      {/* Dot */}
                      <span
  className={`absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-white shadow ${dotClass}`}
/>

                      {/* Card */}
                      <div
                        className={`bg-white rounded-xl p-5 shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 ${resultClass}`}
                      >
                        <div className="flex items-center gap-4">

                          <div className="flex flex-col gap-1">

  {/* Línia principal */}
  <div className="flex items-center gap-2 flex-wrap">

    <span
      className={`text-[11px] px-2 py-0.5 rounded font-semibold tracking-wide font-semibold ${
        m.homeAway === "home"
          ? "bg-[var(--cardassar-yellow)] text-black"
          : "bg-neutral-200 text-neutral-700"
      }`}
    >
      {m.homeAway === "home" ? "CASA" : "FORA"}
    </span>

    <span className="text-neutral-400">—</span>

    <span className="flex items-baseline gap-1 tracking-tight">

  <span className="text-neutral-700 font-medium">
    {m.teamRef?.title || m.team}
  </span>

  <span className="text-[var(--cardassar-yellow)] font-semibold">
    vs
  </span>

  <span className="text-neutral-900 font-semibold">
    {m.opponent}
  </span>

</span>

    {isToday && (
      <span className="bg-[var(--cardassar-yellow)] text-black text-xs px-2 py-0.5 rounded">
        AVUI
      </span>
    )}

    {!isToday && hasResult && (
      <span className={`text-xs px-2 py-0.5 rounded ${
        m.setsTeam > m.setsOpponent
          ? "bg-green-100 text-green-700"
          : m.setsTeam < m.setsOpponent
          ? "bg-red-100 text-red-700"
          : "bg-gray-100 text-gray-700"
      }`}>
        {m.setsTeam > m.setsOpponent ? "VICTÒRIA" : "DERROTA"}
      </span>
    )}

  </div>

  {/* Competició */}
  <div className="text-[11px] uppercase tracking-wider text-neutral-400 flex items-center gap-2 flex-wrap">

  {m.roundLabel && (
    <span className="bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded">
      {m.roundLabel}
    </span>
  )}

  {m.phase && (
    <span className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
      {m.phase}
    </span>
  )}

  <span>{m.competition}</span>

</div>

  {/* Venue */}
  <div className="text-sm text-neutral-400">
    {m.venue}
  </div>

</div>

                          {m.opponentLogo && (
                            <img
                              src={urlFor(m.opponentLogo).width(80).url()}
                              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain"
                              alt={m.opponent}
                            />
                          )}
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="font-semibold">
                            {matchDate.toLocaleDateString()}
                          </p>

                          <p className="text-sm text-gray-500">
                            {matchDate.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>

                          {hasResult && (
                            <p className="mt-1 font-bold text-[var(--cardassar-yellow)]">
                              {m.setsTeam} — {m.setsOpponent}
                            </p>
                          )}
                        </div>
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