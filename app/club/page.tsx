import { client } from "@/lib/sanity"
import { urlFor } from "@/lib/image"

const heroQuery = `
*[_type=="clubMedia" && "clubHero" in usage][0]{
  title,
  image
}
`

const galleryQuery = `
*[_type=="clubMedia" && "clubLife" in usage]
| order(order asc){
  title,
  image
}
`

export default async function ClubPage() {
    const hero = await client.fetch(heroQuery)
    const gallery = await client.fetch(galleryQuery)
  return (

    <>
      {/* HERO */}
      <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">

        {hero?.image && (
          <img
            src={urlFor(hero.image).width(2200).url()}
            className="absolute inset-0 w-full h-full object-cover"
            alt={hero.title}
          />
        )}
      </section>
    
    <main className="bg-neutral-100 min-h-screen pt-24 pb-32">

      <div className="max-w-6xl mx-auto px-6 space-y-20">

        {/* HERO */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Més que un club
          </h1>

          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            El CV Cardassar és un projecte esportiu i humà que uneix jugadores,
            famílies i poble al voltant del voleibol, els valors i la passió per competir.
          </p>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

  {[
    { label: "Equips federats", value: "4" },
    { label: "Equips no federats", value: "2" },
    { label: "Jugadors/es", value: "80+" },
    { label: "Temporada", value: "2025–26" },
  ].map((s) => (
    <div key={s.label}
      className="bg-white p-8 rounded-2xl shadow">
      <p className="text-4xl font-bold text-[var(--cardassar-yellow)]">
        {s.value}
      </p>
      <p className="text-neutral-500 mt-2">{s.label}</p>
    </div>
  ))}

</section>

        {/* QUI SOM */}
        <section className="bg-white p-10 rounded-3xl shadow space-y-4">
          <h2 className="text-3xl font-semibold">Qui som</h2>

          <p className="text-neutral-600 leading-relaxed">
            Som un club arrelat al territori que aposta per la formació integral de les
            jugadores, combinant exigència esportiva amb educació en valors.
            Creiem en el treball diari, el respecte i el sentiment d’equip com a base
            per créixer dins i fora de la pista.
          </p>
        </section>

        {/* VALORS */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-center">Els nostres valors</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">

            {[
              {
                title: "Compromís",
                desc: "Treballam amb constància i responsabilitat cada dia.",
              },
              {
                title: "Respecte",
                desc: "Cap a companyes, rivals, àrbitres i l’esport.",
              },
              {
                title: "Equip",
                desc: "Creixem juntes dins una cultura de suport mutu.",
              },
              {
                title: "Superació",
                desc: "Sempre cercam la millor versió de nosaltres mateixes.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-neutral-600">{v.desc}</p>
              </div>
            ))}

          </div>
        </section>

        <section className="space-y-10">

  <div className="text-center space-y-4">
    <h2 className="text-3xl font-semibold">
      Vida de club
    </h2>

    <p className="text-neutral-600 max-w-2xl mx-auto">
      El CV Cardassar es construeix dins i fora de la pista:
      afició, equips i experiències compartides que fan créixer
      el sentiment de club.
    </p>
  </div>

  <div className="grid md:grid-cols-3 gap-6 auto-rows-[260px]">

    {gallery.map((img: any, i: number) => (
      <div
        key={i}
        className="relative rounded-2xl overflow-hidden group"
      >

        <img
          src={urlFor(img.image).width(1200).url()}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          alt={img.title}
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80" />

        <p className="absolute bottom-4 left-4 text-white font-semibold">
          {img.title}
        </p>

      </div>
    ))}

  </div>

</section>

        {/* HISTÒRIA */}
        <section className="bg-white p-10 rounded-3xl shadow space-y-4">
  <h2 className="text-3xl font-semibold">
    Un projecte en construcció
  </h2>

  <p className="text-neutral-600 leading-relaxed">
    El CV Cardassar neix amb la voluntat de construir un model esportiu
    sòlid, organitzat i sostenible. Apostam per crear una estructura
    estable que permeti el creixement progressiu de jugadores,
    entrenadors i equips.
  </p>

  <p className="text-neutral-600 leading-relaxed">
    Aquest és el primer any d’un projecte que vol consolidar el
    voleibol al municipi i generar sentiment de pertinença
    dins i fora de la pista.
  </p>
</section>

        {/* CTA */}
        <section className="text-center space-y-4">
          <h2 className="text-3xl font-semibold">
            Vols formar part del club?
          </h2>

          <p className="text-neutral-600">
            Contacta amb nosaltres i vine a provar un entrenament.
          </p>

          <a
            href="/contacte"
            className="inline-block bg-[var(--cardassar-yellow)] text-black px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Contactar
          </a>
        </section>

              </div>
      </main>
    </>
  )
}