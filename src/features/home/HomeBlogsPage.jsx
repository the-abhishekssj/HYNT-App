import { CaretLeft } from '@phosphor-icons/react'
import { homeBlogArticles } from './HomeBlogsSection'

function HomeBlogsPage({ onBack }) {
  return (
    <section className="mx-auto w-full max-w-[390px] bg-white pb-24">
      <header className="sticky top-0 z-20 border-b border-[#e0e0e0] bg-white/95 px-4 py-3 backdrop-blur">
        <button type="button" onClick={onBack} className="flex items-center gap-3 text-left">
          <span className="grid size-8 place-items-center rounded-full border border-[#e0e0e0]">
            <CaretLeft size={20} />
          </span>
          <span>
            <span className="typo-section-title block text-black">Blogs & Articles</span>
            <span className="typo-meta block text-[#808080]">Ideas, planning guides, and product advice</span>
          </span>
        </button>
      </header>

      <div className="grid gap-4 px-4 py-5">
        {homeBlogArticles.concat(homeBlogArticles).map((article, index) => (
          <article key={`${article.title}-${index}`} className="overflow-hidden rounded-3xl border border-[#e0e0e0] bg-white">
            <img src={article.image} alt="" className="h-[190px] w-full object-cover" />
            <div className="p-4">
              <p className="typo-meta text-[#267449]">{article.meta}</p>
              <h2 className="typo-title-20 mt-1 text-black">{article.title}</h2>
              <p className="typo-body mt-2 text-[#6f6f6f]">By {article.author}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HomeBlogsPage
