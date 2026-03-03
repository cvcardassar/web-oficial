import { client } from '@/lib/sanity'
import { urlFor } from '@/lib/image'
import Link from 'next/link'

export const dynamic = "force-dynamic"

const query = `*[_type == "news"] | order(publishedAt desc)`

export default async function Page() {
  const posts = await client.fetch(query)

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">

      <h1 className="text-4xl font-bold mb-12">
        Notícies
      </h1>

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

    </main>
  )
}