import { useMemo, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import {
  formatRupees,
  getBoqItemAmount,
  groupBoqItemsByCategory,
  groupBoqItemsBySpace,
} from './boqUtils'
import { formatBoqHistoryDate } from './boqHistoryUtils'

function HistoryGroupRows({ groups, openGroups, onToggle }) {
  return (
    <div className="border-t border-[#ececec]">
      {groups.map(([name, items]) => {
        const total = items.reduce((sum, item) => sum + getBoqItemAmount(item), 0)
        const open = openGroups[name] ?? name === groups[0]?.[0]
        return (
          <section key={name} className="border-b border-[#ececec]">
            <button type="button" onClick={() => onToggle(name)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
              <div className="min-w-0">
                <p className="typo-body-strong text-black">{name}</p>
                <p className="typo-meta mt-1 text-[#7b7b7b]">{items.length} items</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="typo-body-strong text-[#267449]">{formatRupees(total)}</p>
                <CaretDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {open ? (
              <div>
                {items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 border-t border-[#f2f2f2] px-4 py-3">
                    <div className="min-w-0">
                      <p className="typo-body text-black">{item.item}</p>
                      <p className="typo-meta mt-1 text-[#7b7b7b]">
                        {item.quantity} {item.unit} / {item.category}
                      </p>
                    </div>
                    <p className="typo-body-strong shrink-0 text-black">{formatRupees(getBoqItemAmount(item))}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        )
      })}
    </div>
  )
}

export function BoqHistoryList({ title, entries, onOpen, emptyLabel = null }) {
  if (!entries?.length && !emptyLabel) return null

  return (
    <section className="border-t border-[#ececec] py-4">
      <div className="flex items-center justify-between gap-3 px-4">
        <p className="typo-section-title text-black">{title}</p>
        {entries?.length ? <p className="typo-meta text-[#7b7b7b]">{entries.length} signed</p> : null}
      </div>
      {entries?.length ? (
        <div className="mt-3">
          {entries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => onOpen?.(entry)}
              className="flex w-full items-center justify-between gap-3 border-b border-[#f2f2f2] px-4 py-3 text-left first:border-t first:border-[#f2f2f2]"
            >
              <div className="min-w-0">
                <p className="typo-body-strong text-black">{entry.title || `BOQ v${entry.version}`}</p>
                <p className="typo-meta mt-1 text-[#7b7b7b]">
                  Signed {formatBoqHistoryDate(entry.approvedAt)} / {entry.itemsSnapshot?.length || 0} items
                </p>
              </div>
              <p className="typo-body-strong shrink-0 text-[#267449]">{formatRupees(entry.grandTotal || 0)}</p>
            </button>
          ))}
        </div>
      ) : emptyLabel ? (
        <p className="typo-body px-4 pt-3 text-[#7b7b7b]">{emptyLabel}</p>
      ) : null}
    </section>
  )
}

export function BoqHistoryDetailBody({ snapshot }) {
  const [view, setView] = useState('By room')
  const [openRoomGroups, setOpenRoomGroups] = useState({})
  const [openCategoryGroups, setOpenCategoryGroups] = useState({})

  const items = useMemo(() => snapshot?.itemsSnapshot || [], [snapshot])
  const itemsBySpace = useMemo(() => groupBoqItemsBySpace(items), [items])
  const itemsByCategory = useMemo(() => groupBoqItemsByCategory(items), [items])

  if (!snapshot) return null

  return (
    <>
      <div className="border-b border-[#ececec] py-4">
        <p className="typo-label uppercase text-[#5f7467]">Signed total</p>
        <p className="typo-page-title mt-2 text-black">{formatRupees(snapshot.grandTotal || 0)}</p>
        <div className="mt-3 grid grid-cols-3 border-t border-[#ececec]">
          <div className="border-r border-[#ececec] py-3 pr-3 text-left">
            <p className="typo-body-strong text-black">{snapshot.itemsSnapshot?.length || 0}</p>
            <p className="typo-meta mt-1 text-[#7b7b7b]">Line items</p>
          </div>
          <div className="border-r border-[#ececec] px-3 py-3 text-left">
            <p className="typo-body-strong text-black">{formatRupees(snapshot.subtotal || 0)}</p>
            <p className="typo-meta mt-1 text-[#7b7b7b]">Subtotal</p>
          </div>
          <div className="pl-3 py-3 text-left">
            <p className="typo-body-strong text-black">{formatRupees(snapshot.gstAmount || 0)}</p>
            <p className="typo-meta mt-1 text-[#7b7b7b]">GST</p>
          </div>
        </div>
      </div>

      <div className="flex border-b border-[#ececec]">
        {['By room', 'By activity'].map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setView(label)}
            className={`typo-label min-w-0 flex-1 px-3 py-3 text-center ${view === label ? 'text-black' : 'text-[#7b7b7b]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'By room' ? (
        <HistoryGroupRows
          groups={itemsBySpace}
          openGroups={openRoomGroups}
          onToggle={(name) => setOpenRoomGroups((current) => ({ ...current, [name]: !current[name] }))}
        />
      ) : null}

      {view === 'By activity' ? (
        <HistoryGroupRows
          groups={itemsByCategory}
          openGroups={openCategoryGroups}
          onToggle={(name) => setOpenCategoryGroups((current) => ({ ...current, [name]: !current[name] }))}
        />
      ) : null}
    </>
  )
}
