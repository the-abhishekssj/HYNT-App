import { useLayoutEffect, useRef } from 'react'
import { ArrowRight } from '@phosphor-icons/react'

export const homeBlogArticles = [
  {
    title: '10 Modern Living Room Ideas for Indian Homes',
    meta: '5 min read',
    author: 'HYNT Team',
    image: '/hynt-home/idea-1.png',
  },
  {
    title: 'Kitchen Planning Tips You Should Never Miss',
    meta: '6 min read',
    author: 'Ar. Neha Jain',
    image: '/hynt-home/product.png',
  },
  {
    title: 'Bedroom Trends for Modern Indian Homes',
    meta: '4 min read',
    author: 'HYNT Team',
    image: '/hynt-home/idea-2.png',
  },
]

function HomeBlogsSection({ onViewAll }) {
  const railRef = useRef(null)

  useLayoutEffect(() => {
    if (!railRef.current) return
    railRef.current.scrollLeft = 0
  }, [])

  return (
    <section className="px-4 py-5">
      <div className="flex items-center justify-between">
        <h2 className="typo-section-title">Blogs & Articles</h2>
        <button type="button" onClick={onViewAll} className="typo-utility flex items-center gap-1">
          View all <ArrowRight size={16} />
        </button>
      </div>
      <div ref={railRef} className="no-scrollbar mt-4 flex gap-3 overflow-x-auto overflow-y-visible pb-1">
        {homeBlogArticles.slice(0, 3).map((article) => (
          <article key={article.title} className="w-[184px] shrink-0 overflow-hidden rounded-2xl border border-[#e0e0e0] bg-white">
            <img src={article.image} alt="" className="h-[116px] w-full object-cover" />
            <div className="p-3">
              <h3 className="typo-body-strong line-clamp-2 text-black">{article.title}</h3>
              <p className="typo-meta mt-2 text-[#808080]">{article.meta} · {article.author}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HomeBlogsSection
