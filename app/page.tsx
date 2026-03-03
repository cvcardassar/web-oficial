import { client } from '@/lib/sanity'
import { urlFor } from '@/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import HomeHero from "@/components/HomeHero"
import InstagramSection from "@/components/InstagramSection"

const heroQuery = `
*[_type=="clubMedia" && "homeHero" in usage]
| order(order asc){
  title,
  image
}
`
const newsQuery = `*[_type == "news"] | order(publishedAt desc)[0...3]`

const nextMatchQuery = `
  *[_type == "match" && date >= now()]
  | order(date asc)[0]
`

const lastSeniorResultQuery = `
  *[
    _type == "match" &&
    team match "Sènior*" &&
    defined(setsTeam)
  ]
  | order(date desc)[0]
`

const weekMatchesQuery = `
  *[_type == "match" && date >= now()]
  | order(date asc)
`

const sponsorsQuery = `
  *[_type == "sponsor"] | order(order asc)
`

const weekResultsQuery = `
  *[
    _type == "match" &&
    defined(setsTeam)
  ]
  | order(date desc)[0...5]
`

const agendaWeekQuery = `
  *[
    _type == "match" &&
    date >= now()
  ]
  | order(date asc)[0...5]
`

export default async function Home() {
  const heroes = await client.fetch(heroQuery)
  const posts = await client.fetch(newsQuery)
  const match = await client.fetch(nextMatchQuery)
  const lastSeniorResult = await client.fetch(lastSeniorResultQuery)

  const resultColor =
  lastSeniorResult?.setsTeam > lastSeniorResult?.setsOpponent
    ? "text-green-400"
    : lastSeniorResult?.setsTeam < lastSeniorResult?.setsOpponent
    ? "text-red-400"
    : "text-gray-400"

  const weekMatches = await client.fetch(weekMatchesQuery)

  const isHomeGame = match?.homeAway === 'home'

  const isMatchDay =
    match &&
    new Date(match.date).toDateString() === new Date().toDateString()

  const sponsors = await client.fetch(sponsorsQuery)

const goldSponsors = sponsors.filter((s: any) => s.tier === 'gold')
const silverSponsors = sponsors.filter((s: any) => s.tier === 'silver')
const bronzeSponsors = sponsors.filter((s: any) => s.tier === 'bronze')

const weekResults = await client.fetch(weekResultsQuery)

const agendaWeek = await client.fetch(agendaWeekQuery)

  function TeamBlock({ logo, name }: any) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 flex items-center justify-center mb-4">
          {logo && (
            <img
              src={urlFor(logo).width(200).url()}
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
        <p className="text-2xl font-bold text-center">{name}</p>
      </div>
    )
  }

  function VS() {
    return (
      <div className="flex justify-center text-6xl font-black text-[var(--cardassar-yellow)] border-x border-neutral-700 px-6">
        VS
      </div>
    )
  }

  return (
    <main>

      {/* MATCHDAY BANNER */}
      {isMatchDay && (
        <div className="bg-[var(--cardassar-yellow)] text-black text-center py-3 font-semibold">
          🏐 AVUI HI HA PARTIT!
        </div>
      )}

      {/* HERO */}
      <HomeHero heroes={heroes} />

      

      {/* NEXT MATCH SCOREBOARD */}
      {match && (
        <section className="bg-black text-white py-24">
          <div className="max-w-6xl mx-auto px-6">

            <p className="text-center text-sm text-gray-400 mb-8 tracking-widest">
              PRÒXIM PARTIT
            </p>

            <div className="bg-gradient-to-b from-neutral-900 to-black border border-neutral-800 rounded-3xl p-12 shadow-xl">

              <div className="grid grid-cols-3 items-center gap-6">
                {isHomeGame ? (
                  <>
                    <TeamBlock logo={match.teamLogo} name={match.team} />
                    <VS />
                    <TeamBlock logo={match.opponentLogo} name={match.opponent} />
                  </>
                ) : (
                  <>
                    <TeamBlock logo={match.opponentLogo} name={match.opponent} />
                    <VS />
                    <TeamBlock logo={match.teamLogo} name={match.team} />
                  </>
                )}
              </div>

              <div className="text-center mt-12 space-y-3">
                <p className="text-xl font-semibold">
                  {new Date(match.date).toLocaleDateString()}
                </p>
                <p className="text-3xl font-bold text-[var(--cardassar-yellow)]">
                  {new Date(match.date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="text-gray-400">
                  {match.competition} · {match.venue}
                </p>
              </div>

            </div>
          </div>
        </section>
      )}

      {agendaWeek.length > 0 && (
  <section className="bg-neutral-100 py-20 border-t">
    <div className="max-w-6xl mx-auto px-6">

      <h2 className="text-3xl font-bold mb-10 text-center">
        Agenda de la setmana
      </h2>

      <div className="space-y-4">

        {agendaWeek.map((m: any) => (
          <div
            key={m._id}
            className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm"
          >

            <div>
              <p className="font-semibold">
                {m.team} vs {m.opponent}
              </p>

              <p className="text-sm text-gray-500">
                {m.competition} · {m.venue}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                {new Date(m.date).toLocaleDateString()}
              </p>

              <p className="text-sm text-gray-500">
                {new Date(m.date).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

          </div>
        ))}

      </div>

    </div>
  </section>
)}

      {/* LAST RESULT */}
      {lastSeniorResult?.setsTeam !== undefined && (
  <section className="bg-neutral-950 text-white py-20">
    <div className="max-w-5xl mx-auto px-6">

      <p className="text-center text-sm text-gray-400 mb-8 tracking-widest">
        ÚLTIM RESULTAT
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-10 shadow-lg">

        <div className="grid grid-cols-3 items-center gap-6">

          {/* Equip */}
          <div className="flex flex-col items-center">
            {lastSeniorResult.teamLogo && (
              <img
                src={urlFor(lastSeniorResult.teamLogo).width(120).url()}
                className="mb-3"
              />
            )}
            <p className="font-semibold text-center">
              {lastSeniorResult.team}
            </p>
          </div>

          {/* Sets */}
          <div className="text-center">
            <p className={`text-6xl font-black ${resultColor}`}>
              {lastSeniorResult.setsTeam} — {lastSeniorResult.setsOpponent}
            </p>
            {lastSeniorResult.setsDetail?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mt-6">

                {lastSeniorResult.setsDetail.map((set: any, i: number) => (
                  <div
                    key={i}
                    className="bg-neutral-800 rounded-lg px-4 py-2 text-sm font-semibold"
                  >
                    {set.team} — {set.opponent}
                  </div>
                ))}

              </div>
            )}
            <p className="text-sm text-gray-400 mt-1">
              Sets
            </p>
          </div>

          {/* Rival */}
          <div className="flex flex-col items-center">
            {lastSeniorResult.opponentLogo && (
              <img
                src={urlFor(lastSeniorResult.opponentLogo).width(120).url()}
                className="mb-3"
              />
            )}
            <p className="font-semibold text-center">
              {lastSeniorResult.opponent}
            </p>
          </div>

        </div>

        <div className="text-center mt-6 text-gray-400 text-sm">
          {lastSeniorResult.competition} ·{" "}
          {new Date(lastSeniorResult.date).toLocaleDateString()}
        </div>

      </div>

    </div>
  </section>
)}




{weekResults.length > 0 && (
  <section className="bg-white py-20 border-t">
    <div className="max-w-6xl mx-auto px-6">

      <h2 className="text-3xl font-bold mb-10 text-center">
        Últims resultats
      </h2>

      <div className="space-y-4">

        {weekResults.map((m: any) => (
          <div
            key={m._id}
            className="flex justify-between items-center border rounded-lg p-4"
          >

            <div>
              <p className="font-semibold">
                {m.team} vs {m.opponent}
              </p>

              <p className="text-sm text-gray-500">
                {m.competition}
              </p>
            </div>

            <div className="text-right">
              {m.setsTeam !== undefined && (
                <p className="font-bold text-lg">
                  {m.setsTeam} — {m.setsOpponent}
                </p>
              )}

              <p className="text-sm text-gray-500">
                {new Date(m.date).toLocaleDateString()}
              </p>
            </div>

          </div>
        ))}

      </div>

    </div>
  </section>
)}

 <section className="bg-black text-white py-16 border-y border-[var(--cardassar-yellow)]">

  <div className="max-w-6xl mx-auto px-6 text-center">

    <h2 className="text-3xl font-bold mb-4">
      Segueix el club a Instagram
    </h2>

    <p className="text-white/70 mb-8">
      Resultats, partits, vida del club i molt més.
    </p>

    <a
      href="https://instagram.com/cvcardassar"
      target="_blank"
      className="inline-block bg-[var(--cardassar-yellow)] text-black font-semibold px-6 py-3 rounded-lg hover:scale-105 transition"
    >
      @cvcardassar
    </a>

  </div>

</section>     

      {/* NEWS */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold mb-10">
          Últimes notícies
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link key={post._id} href={`/noticies/${post.slug.current}`}>
              <div className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition">
                {post.mainImage && (
                  <img
                    src={urlFor(post.mainImage).width(600).url()}
                    className="h-48 w-full object-cover group-hover:scale-105 transition"
                  />
                )}
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : ''}
                  </p>
                  <h3 className="font-semibold text-lg group-hover:text-[var(--cardassar-yellow)] transition">
                    {post.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-neutral-100 py-24 border-t">
  <div className="max-w-6xl mx-auto px-6 space-y-16">

    <h2 className="text-3xl font-bold text-center">
      Patrocinadors
    </h2>

    {/* OR */}
    {goldSponsors.length > 0 && (
      <div>
        <h3 className="text-center font-semibold mb-8 text-yellow-600">
          Patrocinadors Or
        </h3>

        <div className="flex flex-wrap justify-center gap-10">
          {goldSponsors.map((s: any) => (
            <a
  key={s._id}
  href={s.url}
  target="_blank"
  className="
    flex items-center justify-center
    bg-white
    rounded-xl
    p-6
    w-[220px]
    h-[120px]
    border border-neutral-200
    shadow-sm
    hover:shadow-md
    transition
  "
>
  <img
    src={urlFor(s.logo)
      .width(700)
      .auto("format")
      .quality(100)
      .url()}
    alt={s.name}
    className="
      max-h-16
      max-w-full
      object-contain
      grayscale
      brightness-75
      opacity-70
      hover:grayscale-0
      hover:brightness-100
      hover:opacity-100
      transition-all duration-300
    "
  />
</a>
          ))}
        </div>
      </div>
    )}

    {/* PLATA */}
    {silverSponsors.length > 0 && (
      <div>
        <h3 className="text-center font-semibold mb-8 text-gray-500">
          Patrocinadors Plata
        </h3>

        <div className="flex flex-wrap justify-center gap-8">
          {silverSponsors.map((s: any) => (
            <a
  key={s._id}
  href={s.url}
  target="_blank"
  className="
    flex items-center justify-center
    bg-white
    rounded-xl
    p-6
    w-[220px]
    h-[120px]
    border border-neutral-200
    shadow-sm
    hover:shadow-md
    transition
  "
>
  <img
    src={urlFor(s.logo)
      .width(700)
      .auto("format")
      .quality(100)
      .url()}
    alt={s.name}
    className="
      max-h-16
      max-w-full
      object-contain
      grayscale
      brightness-75
      opacity-70
      hover:grayscale-0
      hover:brightness-100
      hover:opacity-100
      transition-all duration-300
    "
  />
</a>
          ))}
        </div>
      </div>
    )}

    {/* BRONZE */}
    {bronzeSponsors.length > 0 && (
      <div>
        <h3 className="text-center font-semibold mb-8 text-amber-700">
          Patrocinadors Bronze
        </h3>

        <div className="flex flex-wrap justify-center gap-6">
          {bronzeSponsors.map((s: any) => (
            <a
  key={s._id}
  href={s.url}
  target="_blank"
  className="
    flex items-center justify-center
    bg-white
    rounded-xl
    p-6
    w-[220px]
    h-[120px]
    border border-neutral-200
    shadow-sm
    hover:shadow-md
    transition
  "
>
  <img
    src={urlFor(s.logo)
      .width(700)
      .auto("format")
      .quality(100)
      .url()}
    alt={s.name}
    className="
      max-h-16
      max-w-full
      object-contain
      grayscale
      brightness-75
      opacity-70
      hover:grayscale-0
      hover:brightness-100
      hover:opacity-100
      transition-all duration-300
    "
  />
</a>
          ))}
        </div>
      </div>
    )}

  </div>
</section>

    </main>
  )
}