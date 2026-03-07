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
  | order(date asc)[0]{
    ...,
    teamRef->{
      title,
      logo
    }
  }
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
  | order(date asc)[0...5]{
    ...,
    teamRef->{
      title,
      logo
    }
  }
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
      {isMatchDay && match && (
  <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--cardassar-yellow)] text-black shadow-lg">
    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-sm font-semibold">

      <span className="flex items-center gap-2">
        🏐
        AVUI {new Date(match.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} · {match.team} vs {match.opponent}
      </span>

      <a
        href="#proper-partit"
        className="bg-black text-white px-3 py-1 rounded text-xs font-bold"
      >
        VEURE
      </a>

    </div>
  </div>
)}

      {/* HERO */}
      <HomeHero heroes={heroes} />

      

      {/* NEXT MATCH */}
{match && (
  <section id="proper-partit" className="border-t">

  {/* HEADER */}
  <div className="bg-black text-white py-6 border-b-4 border-[var(--cardassar-yellow)]">
    <div className="max-w-6xl mx-auto px-6 text-center">
      <p className="text-xs tracking-widest text-white/60">
        PROPER ENFRONTAMENT
      </p>
      <h2 className="text-3xl md:text-4xl font-black tracking-wide">
        PRÒXIM PARTIT
      </h2>
    </div>
  </div>

  {/* CONTINGUT */}
  <div className="bg-neutral-100">

    <div className="max-w-6xl mx-auto px-6 py-12">

      <div className="grid lg:grid-cols-5 items-center gap-8 text-center">

        {/* DATA */}
        <div>
          <p className="text-sm text-gray-500">
            {new Date(match.date).toLocaleDateString()}
          </p>
          <p className="text-5xl font-black text-[var(--cardassar-yellow)] mt-2">
            {new Date(match.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* LOCAL */}
        <div className="flex flex-col items-center space-y-3">
          <div className="h-28 flex items-center justify-center">
            {match.teamRef?.logo && (
              <img
                src={urlFor(match.teamRef.logo).width(240).url()}
                className="max-h-full object-contain"
              />
            )}
          </div>
          <p className="font-semibold text-lg">
            {match.team}
          </p>
          {match.homeAway === "home" && (
            <span className="bg-red-600 text-white text-xs px-4 py-1 font-bold">
              CASA
            </span>
          )}
        </div>

        {/* VS */}
        <div className="text-6xl font-black text-[var(--cardassar-yellow)]">
          VS
        </div>

        {/* VISITANT */}
        <div className="flex flex-col items-center space-y-3">
          <div className="h-28 flex items-center justify-center">
            {match.opponentLogo && (
              <img
                src={urlFor(match.opponentLogo).width(240).url()}
                className="max-h-full object-contain"
              />
            )}
          </div>
          <p className="font-semibold text-lg">
            {match.opponent}
          </p>
          {match.homeAway === "away" && (
            <span className="bg-gray-700 text-white text-xs px-4 py-1 font-bold">
              FORA
            </span>
          )}
        </div>

        {/* INFO */}
        <div className="text-sm text-gray-600">
          {match.competition} <br />
          {match.venue}
        </div>

      </div>

    </div>

  </div>

</section>
)}

     <section className="bg-white py-16 md:py-24 border-t">
  <div className="max-w-5xl mx-auto px-4 md:px-6">

    <div className="bg-black text-white py-6 mb-12">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-2xl md:text-3xl font-black tracking-wide text-center">
      AGENDA DE LA SETMANA
    </h2>
  </div>
</div>

    <div className="space-y-4">

      {agendaWeek.map((m: any, index: number) => {

        const date = new Date(m.date)
        const day = date.toLocaleDateString('ca-ES', { day: '2-digit' })
        const month = date.toLocaleDateString('ca-ES', { month: 'short' })
        const time = date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })

        const isHome = m.homeAway === "home"

        return (
  <div
    key={m._id}
    className={`
      border-b border-neutral-200
      ${index % 2 === 0 ? "bg-white" : "bg-neutral-100"}
    `}
  >
    {/* ================= MOBILE ================= */}
    <div className="lg:hidden px-4 py-8">

      {/* DATA */}
      <div className="text-center mb-5">
        <p className="text-xs text-gray-400">
          {date.getFullYear()}
        </p>

        <p className="text-2xl font-bold tracking-wide">
          {month.toUpperCase()} {day}
          <span className="text-sm ml-2 text-[var(--cardassar-yellow)] font-semibold">
            {time}
          </span>
        </p>
      </div>

      {/* EQUIPS */}
      <div className="grid grid-cols-3 items-center text-center">

        {/* LOCAL */}
        <div className="flex flex-col items-center space-y-2">
          {m.teamRef?.logo && (
            <img
              src={urlFor(m.teamRef.logo).width(140).url()}
              className="w-24 h-24 object-contain"
            />
          )}
          <p className="text-sm font-semibold">
            {m.team}
          </p>
          {m.homeAway === "home" && (
            <span className="bg-red-600 text-white text-xs px-3 py-1">
              CASA
            </span>
          )}
        </div>

        <div className="text-2xl font-black">
          VS
        </div>

        {/* VISITANT */}
        <div className="flex flex-col items-center space-y-2">
          {m.opponentLogo && (
            <img
              src={urlFor(m.opponentLogo).width(140).url()}
              className="w-16 h-16 object-contain"
            />
          )}
          <p className="text-sm font-semibold">
            {m.opponent}
          </p>
          {m.homeAway === "away" && (
            <span className="bg-gray-600 text-white text-xs px-3 py-1">
              FORA
            </span>
          )}
        </div>

      </div>

      {/* INFO */}
      <div className="mt-6 text-center text-xs text-gray-500">
        {m.competition} · {m.venue} · {m.venue} 
      </div>

    </div>

    {/* ================= DESKTOP ================= */}
    <div className="hidden lg:grid grid-cols-5 items-center px-10 py-10">

      {/* DATA */}
      <div className="text-center">
        <p className="text-sm text-gray-400">
          {date.getFullYear()}
        </p>
        <p className="text-2xl font-black">
          {month.toUpperCase()} {day}
        </p>
        <p className="text-sm text-[var(--cardassar-yellow)] font-semibold">
          {time}
        </p>
      </div>

      {/* LOCAL */}
      <div className="flex flex-col items-center space-y-2">
        {m.teamRef?.logo && (
          <img
            src={urlFor(m.teamRef.logo).width(180).url()}
            className="w-20 h-20 object-contain"
          />
        )}
        <p className="font-semibold">
          {m.team}
        </p>
        {m.homeAway === "home" && (
          <span className="bg-red-600 text-white text-xs px-3 py-1">
            CASA
          </span>
        )}
      </div>

      {/* VS */}
      <div className="text-4xl font-black text-center">
        VS
      </div>

      {/* VISITANT */}
      <div className="flex flex-col items-center space-y-2">
        {m.opponentLogo && (
          <img
            src={urlFor(m.opponentLogo).width(180).url()}
            className="w-20 h-20 object-contain"
          />
        )}
        <p className="font-semibold">
          {m.opponent}
        </p>
        {m.homeAway === "away" && (
          <span className="bg-gray-600 text-white text-xs px-3 py-1">
            FORA
          </span>
        )}
      </div>

      {/* INFO */}
      <div className="text-center text-sm text-gray-500">
        {m.competition} <br />
        {m.venue}
      </div>

    </div>
  </div>
)
      })}

    </div>

  </div>
</section>

      {/* LAST RESULT */}
{lastSeniorResult?.setsTeam !== undefined && (
<section className="border-t">

  {/* HEADER */}
  <div className="bg-black text-white py-6 border-b-4 border-[var(--cardassar-yellow)]">
    <div className="max-w-6xl mx-auto px-6 text-center">
      <p className="text-xs tracking-widest text-white/60">
        DARRER PARTIT
      </p>
      <h2 className="text-3xl md:text-4xl font-black tracking-wide">
        ÚLTIM RESULTAT
      </h2>
    </div>
  </div>

  {/* CONTINGUT */}
  <div className="bg-neutral-100">
    <div className="max-w-6xl mx-auto">

      {/* ================= MOBILE ================= */}
      <div className="lg:hidden px-6 py-12 text-center space-y-8">

        {/* LOGO LOCAL */}
        <div className="flex flex-col items-center space-y-4">
          <div className="h-32 flex items-center justify-center">
            {lastSeniorResult.teamLogo && (
              <img
                src={urlFor(lastSeniorResult.teamLogo).width(240).url()}
                className="max-h-full object-contain"
              />
            )}
          </div>
          <p className="font-semibold text-lg">
            {lastSeniorResult.team}
          </p>
        </div>

        {/* RESULTAT */}
        <p
          className={`text-6xl font-black ${
            lastSeniorResult.setsTeam >
            lastSeniorResult.setsOpponent
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {lastSeniorResult.setsTeam}
          <span className="mx-4 text-black">—</span>
          {lastSeniorResult.setsOpponent}
        </p>

        {/* PARCIALS */}
        {lastSeniorResult.setsDetail?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {lastSeniorResult.setsDetail.map((set: any, i: number) => (
              <span
                key={i}
                className="bg-white border border-neutral-300 px-4 py-2 text-sm"
              >
                {set.team} — {set.opponent}
              </span>
            ))}
          </div>
        )}

        {/* LOGO VISITANT */}
        <div className="flex flex-col items-center space-y-4 pt-6">
          <div className="h-28 flex items-center justify-center">
            {lastSeniorResult.opponentLogo && (
              <img
                src={urlFor(lastSeniorResult.opponentLogo).width(240).url()}
                className="max-h-full object-contain"
              />
            )}
          </div>
          <p className="font-semibold text-lg">
            {lastSeniorResult.opponent}
          </p>
        </div>

        {/* INFO */}
        <div className="text-sm text-gray-600 pt-6">
          {lastSeniorResult.competition} ·{" "}
          {new Date(lastSeniorResult.date).toLocaleDateString()}
        </div>

      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden lg:grid grid-cols-5 items-center py-16 px-10 text-center">

        {/* LOCAL */}
        <div className="flex flex-col items-center space-y-4">
          <div className="h-32 flex items-center justify-center">
            {lastSeniorResult.teamLogo && (
              <img
                src={urlFor(lastSeniorResult.teamLogo).width(260).url()}
                className="max-h-full object-contain"
              />
            )}
          </div>
          <p className="font-semibold text-lg">
            {lastSeniorResult.team}
          </p>
        </div>

        {/* MARCADOR CENTRAL */}
        <div className="col-span-3 flex flex-col items-center">

          <p
            className={`text-8xl font-black ${
              lastSeniorResult.setsTeam >
              lastSeniorResult.setsOpponent
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {lastSeniorResult.setsTeam}
            <span className="mx-8 text-black">—</span>
            {lastSeniorResult.setsOpponent}
          </p>

          {/* PARCIALS */}
          {lastSeniorResult.setsDetail?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {lastSeniorResult.setsDetail.map((set: any, i: number) => (
                <span
                  key={i}
                  className="bg-white border border-neutral-300 px-4 py-2 text-sm"
                >
                  {set.team} — {set.opponent}
                </span>
              ))}
            </div>
          )}

          {/* INFO */}
          <div className="text-sm text-gray-600 mt-8">
            {lastSeniorResult.competition} ·{" "}
            {new Date(lastSeniorResult.date).toLocaleDateString()}
          </div>

        </div>

        {/* VISITANT */}
        <div className="flex flex-col items-center space-y-4">
          <div className="h-32 flex items-center justify-center">
            {lastSeniorResult.opponentLogo && (
              <img
                src={urlFor(lastSeniorResult.opponentLogo).width(260).url()}
                className="max-h-full object-contain"
              />
            )}
          </div>
          <p className="font-semibold text-lg">
            {lastSeniorResult.opponent}
          </p>
        </div>

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

      <div>

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