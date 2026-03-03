import { client } from '@/lib/sanity'
import { urlFor } from '@/lib/image'
import Link from 'next/link'

export const dynamic = "force-dynamic"

const query = `*[_type == "news" && slug.current == $slug][0]`

export default async function Page(props: any) {
  const params = await props.params
  const slug = params.slug

  const post = await client.fetch(query, { slug })

  if (!post) {
    return <div className="p-10">Notícia no trobada</div>
  }

  return (
    <article>

      {/* HERO */}
      {post.mainImage && (
        <div className="relative h-[60vh] w-full">
          <img
            src={urlFor(post.mainImage).width(2000).url()}
            className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
          />

          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 h-full flex items-end pb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {post.title}
            </h1>
          </div>
        </div>
      )}

      {/* CONTINGUT */}
      <div className="max-w-3xl mx-auto px-6 py-12">

        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-[var(--cardassar-yellow)] transition"
        >
          ← Tornar
        </Link>

        <p className="text-gray-400 mt-4 mb-10">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString()
            : ''}
        </p>

        <div className="text-lg leading-relaxed space-y-6">
  {post.body?.map((block: any) => {
    if (block._type === 'block') {
      return (
        <p key={block._key}>
          {block.children?.map((child: any) => child.text)}
        </p>
      )
    }

    if (block._type === 'image') {
      return (
        <figure key={block._key} className="my-10">
          <img
            src={urlFor(block).width(1200).url()}
            className="w-full rounded-lg"
          />
          {block.caption && (
            <figcaption className="text-sm text-gray-500 mt-2 italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    return null
  })}
</div>

{/* GALERIA AQUÍ */}
{post.gallery?.length > 0 && (
  <section className="max-w-5xl mx-auto px-6 py-16">
    <h2 className="text-2xl font-semibold mb-8">
      Galeria
    </h2>

    <div className="grid md:grid-cols-3 gap-6">
      {post.gallery.map((img: any) => (
        <figure key={img._key}>
          <img
            src={urlFor(img).width(800).url()}
            className="rounded-lg"
          />
          {img.caption && (
            <figcaption className="text-sm text-gray-500 mt-2">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  </section>
)}

      </div>

    </article>
  )
}