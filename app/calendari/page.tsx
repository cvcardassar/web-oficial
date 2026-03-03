import { client } from "@/lib/sanity"
import CalendarClient from "./CalendarClient"

const calendarQuery = `
  *[_type == "match"]{
    ...,
    teamRef->{
      title,
      slug,
      logo
    }
  } | order(date asc)
`

export default async function CalendarPage() {
  const matches = await client.fetch(calendarQuery)

  return (
    <main className="bg-neutral-100 min-h-screen pt-30 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        <h1 className="text-4xl font-bold mb-12">
          Calendari
        </h1>

        <CalendarClient matches={matches} />

      </div>
    </main>
  )
}