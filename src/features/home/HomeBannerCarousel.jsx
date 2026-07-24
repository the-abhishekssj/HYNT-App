import { ArrowRight } from '@phosphor-icons/react'
import Button from '../../components/ui/Button'

const bannerSets = {
  homeowner: [
    {
      eyebrow: 'Showcase your brand here',
      title: 'Expand your reach and grow your business',
      image: '/hynt-home/brand.png',
    },
    {
      eyebrow: 'Showcase your brand here',
      title: 'Reach homeowners planning right now',
      image: '/hynt-home/brand.png',
    },
  ],
  professional: [
    {
      eyebrow: 'Workspace tools',
      title: 'Keep every project module close',
      body: 'Jump from updates into SOW, BOQ, finance, tasks, and site diary without losing context.',
    },
    {
      eyebrow: 'Discovery',
      title: 'Tune your HYNT presence',
      body: 'Keep shortcuts, categories, articles, and events ready around your project workflow.',
    },
  ],
}

function HomeBannerCarousel({ audience = 'homeowner' }) {
  const banners = bannerSets[audience] || bannerSets.homeowner

  return (
    <section className="py-4">
      <div className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-visible scroll-px-3 px-3">
        {banners.map((banner) => (
          audience === 'homeowner' ? (
            <article
              key={banner.title}
              className="relative flex h-[172px] w-[338px] shrink-0 snap-start items-end justify-end overflow-hidden rounded-3xl border border-[#e0e0e0] bg-[#f4f7f5] p-3"
            >
              <img src={banner.image} alt="" className="absolute inset-0 size-full object-cover" />
              <span className="absolute inset-0 bg-gradient-to-r from-white/82 via-white/42 to-transparent" />
              <div className="absolute left-4 top-4 max-w-[252px] text-black">
                <p className="typo-meta uppercase">{banner.eyebrow}</p>
                <h2 className="typo-title-20 mt-2 line-clamp-2 opacity-0">{banner.title}</h2>
              </div>
              <Button type="button" size="small" variant="primary" className="relative z-[1]">
                Learn more
              </Button>
            </article>
          ) : (
            <article
              key={banner.title}
              className="min-h-[132px] w-[calc(100vw-32px)] max-w-[358px] shrink-0 snap-start rounded-lg bg-[linear-gradient(135deg,#f5fff9_0%,#e7f8ef_58%,#d9f2e5_100%)] p-4"
            >
              <p className="typo-meta text-[#267449]">{banner.eyebrow}</p>
              <h2 className="typo-title-16-strong mt-1 text-black">{banner.title}</h2>
              <p className="typo-meta mt-2 max-w-[220px] text-[#607269]">{banner.body}</p>
              <Button type="button" size="small" variant="outline" trailingIcon={ArrowRight} className="mt-3">
                Visit
              </Button>
            </article>
          )
        ))}
      </div>
    </section>
  )
}

export default HomeBannerCarousel
