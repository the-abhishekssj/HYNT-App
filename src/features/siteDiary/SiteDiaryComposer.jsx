import { CaretLeft, Camera, Check, WarningCircle, X } from '@phosphor-icons/react'
import { SITE_DIARY_BUCKETS } from './siteDiaryUtils'

const weatherOptions = ['Sunny', 'Cloudy', 'Indoor', 'Rainy']

function FieldLabel({ children }) {
  return <span className="type-label mb-2 block uppercase text-[#777]">{children}</span>
}

function SiteDiaryComposer({ draft, photoOptions, onChange, onClose, onSave }) {
  const togglePhoto = (photo) => {
    const selected = draft.photos.includes(photo)
    onChange({ photos: selected ? draft.photos.filter((item) => item !== photo) : [...draft.photos, photo] })
  }

  return (
    <aside className="fixed inset-y-0 right-0 z-[110] w-full max-w-[430px] overflow-y-auto border-l border-[#dedede] bg-white shadow-[-16px_0_40px_rgba(0,0,0,0.08)]">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e5e5e5] bg-white px-4 py-4">
        <button type="button" onClick={onClose} className="flex items-center gap-3 text-left">
          <CaretLeft size={22} />
          <span>
            <span className="type-section-title block text-black">New site log</span>
            <span className="type-caption block text-[#777]">Shared project record</span>
          </span>
        </button>
        <button type="button" onClick={onClose} className="grid size-9 place-items-center" aria-label="Close composer">
          <X size={18} />
        </button>
      </header>

      <div className="space-y-6 px-4 py-5">
        <section>
          <FieldLabel>Update type</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {SITE_DIARY_BUCKETS.map((bucket) => (
              <button
                key={bucket.id}
                type="button"
                onClick={() => onChange({ type: bucket.id })}
                className={`type-caption rounded-full px-3 py-2 ${draft.type === bucket.id ? 'bg-black text-white' : 'border border-[#d8e2db] text-[#4f4f4f]'}`}
              >
                {bucket.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4 border-t border-[#e5e5e5] pt-5">
          <label className="block">
            <FieldLabel>Title</FieldLabel>
            <input value={draft.title} onChange={(event) => onChange({ title: event.target.value })} placeholder="What was completed today?" className="type-body h-12 w-full rounded-xl border border-[#d7d7d7] px-3 outline-none focus:border-black" />
          </label>
          <label className="block">
            <FieldLabel>Work completed and observations</FieldLabel>
            <textarea value={draft.note} onChange={(event) => onChange({ note: event.target.value })} placeholder="Record progress, decisions, materials received, or blockers." className="type-body h-28 w-full resize-none rounded-xl border border-[#d7d7d7] px-3 py-3 outline-none focus:border-black" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label>
              <FieldLabel>Weather</FieldLabel>
              <select value={draft.weather} onChange={(event) => onChange({ weather: event.target.value })} className="type-body h-12 w-full rounded-xl border border-[#d7d7d7] px-3 outline-none">
                {weatherOptions.map((weather) => <option key={weather}>{weather}</option>)}
              </select>
            </label>
            <label>
              <FieldLabel>Workers</FieldLabel>
              <input value={draft.workerCount} onChange={(event) => onChange({ workerCount: event.target.value })} inputMode="numeric" placeholder="0" className="type-body h-12 w-full rounded-xl border border-[#d7d7d7] px-3 outline-none" />
            </label>
          </div>
          <label className="block">
            <FieldLabel>Areas and trades</FieldLabel>
            <input value={draft.tags} onChange={(event) => onChange({ tags: event.target.value })} placeholder="Master bedroom, False ceiling" className="type-body h-12 w-full rounded-xl border border-[#d7d7d7] px-3 outline-none" />
          </label>
        </section>

        <section className="border-t border-[#e5e5e5] pt-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <FieldLabel>Progress photos</FieldLabel>
              <p className="type-caption text-[#777]">Select one or more images for this log.</p>
            </div>
            <Camera size={20} className="text-[#777]" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {photoOptions.map((photo) => {
              const selected = draft.photos.includes(photo)
              return (
                <button key={photo} type="button" onClick={() => togglePhoto(photo)} className={`relative overflow-hidden rounded-xl border ${selected ? 'border-black' : 'border-[#dedede]'}`}>
                  <img src={photo} alt="Site update option" className="aspect-square w-full object-cover" />
                  {selected ? <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-black text-white"><Check size={12} weight="bold" /></span> : null}
                </button>
              )
            })}
          </div>
        </section>

        <section className="border-t border-[#e5e5e5] pt-5">
          <button type="button" onClick={() => onChange({ createIssue: !draft.createIssue })} className="flex w-full items-center justify-between py-1 text-left">
            <span className="flex items-center gap-3">
              <WarningCircle size={20} className="text-[#d46f1f]" />
              <span>
                <span className="type-body-strong block text-black">Flag an issue</span>
                <span className="type-caption block text-[#777]">Also creates a linked task for the site team.</span>
              </span>
            </span>
            <span className={`h-6 w-11 rounded-full p-1 transition-colors ${draft.createIssue ? 'bg-black' : 'bg-[#dedede]'}`}><span className={`block size-4 rounded-full bg-white transition-transform ${draft.createIssue ? 'translate-x-5' : ''}`} /></span>
          </button>
          {draft.createIssue ? (
            <div className="mt-4 space-y-3 border-l-2 border-[#e8a66f] pl-4">
              <input value={draft.issueTitle} onChange={(event) => onChange({ issueTitle: event.target.value })} placeholder="Issue title" className="type-body h-11 w-full rounded-xl border border-[#d7d7d7] px-3 outline-none" />
              <textarea value={draft.issueNote} onChange={(event) => onChange({ issueNote: event.target.value })} placeholder="What needs to be corrected?" className="type-body h-20 w-full resize-none rounded-xl border border-[#d7d7d7] px-3 py-3 outline-none" />
            </div>
          ) : null}
        </section>

        <div className="sticky bottom-0 grid grid-cols-[auto_1fr] gap-3 bg-white py-3">
          <button type="button" onClick={onClose} className="type-body-strong h-12 rounded-xl border border-[#d7d7d7] px-5">Cancel</button>
          <button type="button" onClick={onSave} disabled={!draft.title.trim() && !draft.note.trim() && draft.photos.length === 0} className="type-body-strong h-12 rounded-xl bg-black px-5 text-white disabled:bg-[#d7d7d7]">Save site log</button>
        </div>
      </div>
    </aside>
  )
}

export default SiteDiaryComposer
