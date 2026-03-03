import { client } from "@/lib/sanity"
import Link from "next/link"
import { urlFor } from "@/lib/image"

const teamsQuery = `
  *[_type == "team"] | order(title asc){
    title,
    slug,
    logo,
    category
  }
`

export default async function TeamsPage() {
  const teams = await client.fetch(teamsQuery)

  return (
    <main className="bg-neutral-100 min-h-screen pt-18">

      {/* HERO */}
      <section className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Equips del club
          </h1>

          <p className="text-neutral-300 max-w-xl">
            Descobreix tots els equips del CV Cardassar, consulta el calendari,
            resultats i informació de cada categoria.
          </p>

        </div>
      </section>

      {/* GRID */}
      <section className="max-w-6xl mx-auto px-6 py-12">

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">

          {teams.map((team: any) => (
            <Link
              key={team.slug.current}
              href={`/equips/${team.slug.current}`}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center"
            >

              {/* Logo */}
              <div className="h-20 flex items-center justify-center mb-4">
                {team.logo && (
                  <img
                    src={urlFor(team.logo)
                      .width(1200)
                      .format("webp")
                      .quality(90)
                      .url()}
                    className="h-full object-contain group-hover:scale-105 transition"
                  />
                )}
              </div>

              {/* Nom */}
              <h2 className="font-semibold text-neutral-900 group-hover:text-[var(--cardassar-yellow)] transition">
                {team.title}
              </h2>

              {/* Categoria */}
              {team.category && (
                <p className="text-sm text-neutral-500 mt-1">
                  {team.category}
                </p>
              )}

            </Link>
          ))}

        </div>

      </section>

    </main>
  )
}