import { client } from "@/lib/sanity"
import CalendarClient from "@/app/calendari/CalendarClient"
import { urlFor } from "@/lib/image"
import TeamRoster from "@/components/TeamRoster"
import CoachGrid from "@/components/CoachGrid"

const matchesQuery = `
  *[_type == "match" && teamRef->slug.current == $slug]{
    ...,
    teamRef->{
      title,
      slug,
      logo
    }
  } | order(date asc)
`

const teamQuery = `
*[_type == "team" && slug.current == $slug][0]{
  title,
  logo,
  category,
  teamPhoto,
  standingUrl,
  coaches,
  players
}
`

export default async function TeamPage({ params }: any) {

  const { slug } = await params

  const team = await client.fetch(teamQuery, { slug })
  const matches = await client.fetch(matchesQuery, { slug })

  return (
  <main className="bg-neutral-100 min-h-screen pb-30">

    {/* TEAM HERO */}
{team.teamPhoto && (
  <section className="
  relative
  h-[80vh]
  min-h-[560px]
  w-full
  overflow-hidden
  mt-[-96px]
  pt-[96px]
">

    <img
      src={urlFor(team.teamPhoto)
        .width(2400)
        .height(1400)
        .fit("crop")
        .crop("focalpoint")
        .auto("format")
        .url()}
      className="absolute inset-0 w-full h-full object-cover object-[50%_10%]"
      alt={team.title}
    />

    {/* Gradient club */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-neutral-100" />

    <div className="relative h-full flex items-end">
      <div className="max-w-6xl mx-auto px-6 pb-10 pt-24 space-y-12 flex items-center gap-6 text-white">

        {team.logo && (
          <img
            src={urlFor(team.logo).width(300).url()}
            className="h-20 md:h-24 object-contain bg-white/80 p-2 rounded-xl"
          />
        )}

        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-black">
  {team.title}
</h1>

          <p className="text-black/80 text-lg">
            {team.category}
          </p>
        </div>

      </div>
    </div>

  </section>
)}

    <div className="max-w-6xl mx-auto px-6 space-y-12">

      {/* ENTRENADORS */}
      {team.coaches?.length > 0 && (
  <section>
    <h2 className="text-xl font-semibold mb-4">Cos tècnic</h2>
    <CoachGrid coaches={team.coaches} />
  </section>
)}

      {/* PLANTILLA */}
      <section>
      <h2 className="text-xl font-semibold mb-4">Plantilla</h2>
      <TeamRoster players={team.players} />
      </section>

      {/* CALENDARI */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Partits</h2>
        <CalendarClient matches={matches} />
      </section>

      {team.standingUrl && (
  <section className="bg-white rounded-2xl shadow p-6">

    <h2 className="text-xl font-semibold mb-4">
      Classificació
    </h2>

    <a
      href={team.standingUrl}
      target="_blank"
      className="
        flex items-center justify-between
        bg-neutral-900 text-white
        px-6 py-4 rounded-xl
        hover:bg-black transition
      "
    >
      <span>
        Veure classificació oficial
      </span>

      <span className="text-[var(--cardassar-yellow)] font-semibold">
        →
      </span>
    </a>

  </section>
)}

    </div>

  </main>
)
}