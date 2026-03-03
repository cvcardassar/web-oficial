export default function InstagramSection() {
  return (
    <section className="space-y-8">

      <div className="flex items-center justify-between">

        <h2 className="text-3xl font-semibold">
          El club a Instagram
        </h2>

        <a
          href="https://instagram.com/cvcardassar"
          target="_blank"
          className="
            text-sm font-semibold
            text-[var(--cardassar-yellow)]
            hover:underline
          "
        >
          @cvcardassar →
        </a>

      </div>

      {/* GRID VISUAL */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {[1,2,3,4,5,6].map((i) => (
          <a
            key={i}
            href="https://instagram.com/cvcardassar"
            target="_blank"
            className="
              aspect-square
              bg-neutral-200
              rounded-xl
              overflow-hidden
              group
              relative
            "
          >
            <div className="
              absolute inset-0
              bg-black/0
              group-hover:bg-black/40
              transition
              flex items-center justify-center
            ">
              <span className="
                opacity-0
                group-hover:opacity-100
                text-white font-semibold
              ">
                Veure post
              </span>
            </div>
          </a>
        ))}

      </div>

    </section>
  )
}