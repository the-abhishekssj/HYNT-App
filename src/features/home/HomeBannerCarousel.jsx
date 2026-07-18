import { ArrowRight } from '@phosphor-icons/react'
import Button from '../../components/ui/Button'

const bannerSets = {
  homeowner: [
    {
      eyebrow: 'Private planning',
      title: 'Build a cleaner home brief',
      body: 'Capture approvals, payments, and saved ideas before your project gets noisy.',
    },
    {
      eyebrow: 'HYNT guides',
      title: 'Plan every room with fewer tabs',
      body: 'Use curated category paths for brands, automation, lighting, and materials.',
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
      <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-visible scroll-px-4 px-4">
        {banners.map((banner) => (
          <article
            key={banner.title}
            className="min-h-[132px] w-[calc(100vw-32px)] max-w-[358px] shrink-0 snap-start rounded-lg bg-[linear-gradient(135deg,#f5fff9_0%,#e7f8ef_58%,#d9f2e5_100%)] p-4"
          >
            <p className="typo-meta text-[#267449]">{banner.eyebrow}</p>
            <h2 className="typo-title-16-strong mt-1 text-black">{banner.title}</h2>
            <p className="typo-meta mt-2 max-w-[220px] text-[#607269]">{banner.body}</p>
            <Button
              type="button"
              size="small"
              variant="outline"
              trailingIcon={ArrowRight}
              className="mt-3 h-8 rounded-full border-[#b8ddc7] bg-white px-3 text-[#102418] hover:border-[#26c485] hover:bg-white"
            >
              Visit
            </Button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HomeBannerCarousel
