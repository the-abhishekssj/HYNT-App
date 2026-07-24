import { useLayoutEffect, useRef } from 'react'
import { ArrowRight, Clock } from '@phosphor-icons/react'
import { homeBlogArticles } from './homeBlogArticles'

function HomeBlogsSection({ onViewAll }) {
  const railRef = useRef(null)

  useLayoutEffect(() => {
    if (!railRef.current) return
    railRef.current.scrollLeft = 0
  }, [])

  return (
    <section className="px-3 py-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="typo-section-title">Blogs & Articles</h2>
        <button type="button" onClick={onViewAll} className="typo-utility flex items-center gap-1">
          View all <ArrowRight size={16} />
        </button>
      </div>
      <div ref={railRef} className="no-scrollbar mt-4 flex gap-3 overflow-x-auto overflow-y-visible pb-1">
        {homeBlogArticles.slice(0, 3).map((article, index) => (
          <article key={`${article.title}-${index}`} className="w-[175px] shrink-0 overflow-hidden rounded-3xl border border-[#e0e0e0] bg-[#fbfbfb] pb-4">
            <div className="h-36 overflow-hidden rounded-t-2xl border-b border-[#e0e0e0] bg-white">
              <img src={article.image} alt="" className="size-full object-cover" />
            </div>
            <div className="px-3 pt-3">
              <h3 className="typo-body-strong line-clamp-2 text-black">{article.title}</h3>
              <div className="mt-2 grid gap-1 text-[#808080]">
                <p className="typo-meta flex items-center gap-2">
                  <Clock size={16} />
                  {article.meta}
                </p>
                <p className="typo-meta flex items-center gap-2">
                  <img src="/hynt-home/homepagerev/hynt-icon.svg" alt="" className="h-[11px] w-[18px] shrink-0 object-contain" />
                  {article.author}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HomeBlogsSection
