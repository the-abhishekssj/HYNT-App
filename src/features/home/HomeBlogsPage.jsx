import ProjectWorkspaceHeader from '../shared/ProjectWorkspaceHeader'
import { homeBlogArticles } from './HomeBlogsSection'

function HomeBlogsPage({ onBack }) {
  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      <section className="mx-auto w-full max-w-[390px] pb-10 pt-16">
        <ProjectWorkspaceHeader
          title="Blogs & Articles"
          subtitle="Ideas, planning guides, and product advice"
          onBack={onBack}
        />
      <div className="grid grid-cols-2 gap-3 px-4 py-5">
        {homeBlogArticles.concat(homeBlogArticles).map((article, index) => (
          <article key={`${article.title}-${index}`} className="overflow-hidden rounded-lg border border-[#e0e0e0] bg-white">
            <img src={article.image} alt="" className="h-[118px] w-full object-cover" />
            <div className="p-3">
              <p className="typo-caption text-[#267449]">{article.meta}</p>
              <h2 className="typo-body-strong mt-1 line-clamp-3 text-black">{article.title}</h2>
              <p className="typo-caption mt-2 truncate text-[#6f6f6f]">{article.author}</p>
            </div>
          </article>
        ))}
      </div>
      </section>
    </main>
  )
}

export default HomeBlogsPage
