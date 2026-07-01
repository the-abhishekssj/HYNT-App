import { CaretRight, PencilSimpleLine } from '@phosphor-icons/react'
import { buildBoqRoomSummaries, formatRupees, getBoqItemAmount } from './boqUtils'

export function BoqRoomListSection({ title, rooms, items, onOpenRoom, onEditRoom, emptyLabel = 'No rooms added yet.', emphasis = 'default' }) {
  const summaries = buildBoqRoomSummaries(rooms, items)

  return (
    <section className="border-t border-[#ececec]">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="typo-section-title text-black">{title}</p>
        {summaries.length ? <p className="typo-meta text-[#7b7b7b]">{summaries.length} rooms</p> : null}
      </div>
      {summaries.length ? (
        <div>
          {summaries.map((room) => (
            <div key={room.id} className={`border-t px-4 py-3 ${room.openQuestionCount && emphasis === 'attention' ? 'border-[#f5dcc0] bg-[#fffdf8]' : 'border-[#f2f2f2]'}`}>
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onOpenRoom?.(room)}
                  className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="typo-body-strong text-black">{room.name}</p>
                      {room.openQuestionCount ? (
                        <span className="typo-caption rounded-full bg-[#fff3dd] px-2 py-1 text-[#a86a00]">{room.openQuestionCount} notes</span>
                      ) : null}
                    </div>
                    <p className="typo-meta mt-1 text-[#7b7b7b]">{room.itemCount} particulars</p>
                    {room.openQuestionCount && emphasis === 'attention' ? (
                      <p className="typo-meta mt-1 text-[#a86a00]">{room.disputedItemCount} disputed particulars need review</p>
                    ) : room.note ? <p className="typo-meta mt-1 text-[#9a9a9a]">{room.note}</p> : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <p className="typo-body-strong text-[#267449]">{formatRupees(room.total)}</p>
                    <CaretRight size={14} className="text-[#9a9a9a]" />
                  </div>
                </button>
                {onEditRoom ? (
                  <button
                    type="button"
                    onClick={() => onEditRoom(room)}
                    className="grid size-8 shrink-0 place-items-center rounded-full border border-[#e4e4e4] text-[#4f4f4f]"
                    aria-label={`Edit ${room.name}`}
                  >
                    <PencilSimpleLine size={14} />
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="typo-body px-4 pb-4 text-[#7b7b7b]">{emptyLabel}</p>
      )}
    </section>
  )
}

export function BoqParticularList({ items, onOpenItem, emptyLabel = 'No particulars added yet.' }) {
  return (
    <section className="border-t border-[#ececec]">
      <div className="px-4 py-3">
        <p className="typo-section-title text-black">Particulars</p>
      </div>
      {items.length ? (
        <div>
          {items.map((item) => {
            const openQuestions = (item.clientQuestions || []).filter((question) => question.status !== 'resolved').length
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenItem?.(item)}
                className="flex w-full items-start justify-between gap-3 border-t border-[#f2f2f2] px-4 py-3 text-left"
              >
                <div className="min-w-0">
                  <p className="typo-body text-black">{item.item}</p>
                  <p className="typo-meta mt-1 text-[#7b7b7b]">
                    {item.quantity} {item.unit} / {item.category} / {formatRupees(item.rate)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.vendor ? <span className="typo-caption rounded-full bg-[#eef7f1] px-2 py-1 text-[#267449]">{item.vendor}</span> : null}
                    <span className="typo-caption rounded-full bg-[#f6f6f6] px-2 py-1 text-[#6e6e6e]">{item.markupPercent}% mkp</span>
                    {openQuestions ? <span className="typo-caption rounded-full bg-[#fff3dd] px-2 py-1 text-[#a86a00]">{openQuestions} homeowner note{openQuestions > 1 ? 's' : ''}</span> : null}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <p className="typo-body-strong text-black">{formatRupees(getBoqItemAmount(item))}</p>
                  <CaretRight size={14} className="text-[#9a9a9a]" />
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <p className="typo-body px-4 pb-4 text-[#7b7b7b]">{emptyLabel}</p>
      )}
    </section>
  )
}

export function BoqQuestionThread({ questions, title, emptyLabel = 'No remarks on this particular yet.' }) {
  return (
    <section className="border-t border-[#ececec] py-4">
      <div className="px-4">
        <p className="typo-section-title text-black">{title}</p>
      </div>
      {questions.length ? (
        <div className="mt-3">
          {questions.map((question) => (
            <div key={question.id} className="border-t border-[#f2f2f2] px-4 py-3">
              <div className="flex items-center gap-2">
                <p className="typo-body-strong text-black">{question.createdBy || 'Homeowner'}</p>
                <span className={`typo-caption rounded-full px-2 py-1 ${question.status === 'resolved' ? 'bg-[#eef7f1] text-[#267449]' : 'bg-[#fff3dd] text-[#a86a00]'}`}>
                  {question.status === 'resolved' ? 'Resolved' : 'Open'}
                </span>
              </div>
              <p className="typo-body mt-2 text-[#5f7467]">{question.body}</p>
              {question.designerReply ? (
                <div className="mt-3 border-l border-[#dbe6df] pl-3">
                  <p className="typo-label uppercase text-[#5f7467]">Designer reply</p>
                  <p className="typo-body mt-1 text-black">{question.designerReply}</p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="typo-body px-4 pt-3 text-[#7b7b7b]">{emptyLabel}</p>
      )}
    </section>
  )
}
