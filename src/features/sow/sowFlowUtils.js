export const sowStatusLabels = {
  draft: 'Draft',
  'client-review': 'With client',
  remarks: 'Remarks',
  'revision-ready': 'Revision ready',
  executed: 'Executed',
}

export const sowAiSteps = [
  {
    id: 'brief',
    title: 'Project brief',
    prompt: 'I already know the client, location, and base scope. Tell me the key intent for this SOW so I can frame it correctly.',
    placeholder: 'Example: Warm contemporary 3BHK, full interior renovation with better storage and a cleaner kitchen layout.',
  },
  {
    id: 'rooms',
    title: 'Rooms and deliverables',
    prompt: 'Call out any room-level additions or changes you want me to capture.',
    placeholder: 'Example: Add foyer storage, utility shutters, granite in kitchen, and chimney provision.',
  },
  {
    id: 'exclusions',
    title: 'Exclusions',
    prompt: 'List anything that should stay outside scope unless separately approved.',
    placeholder: 'Example: AC units, loose furniture, civil demolition, and loose decor pieces.',
  },
  {
    id: 'billing',
    title: 'Billing structure',
    prompt: 'What payment logic should the draft follow?',
    placeholder: 'Example: 30 percent booking, 30 percent after drawings, 30 percent before installation, 10 percent at handover.',
  },
  {
    id: 'notes',
    title: 'Execution notes',
    prompt: 'Any special terms, approvals, dependencies, or expectations I should include?',
    placeholder: 'Example: Client approvals before fabrication, material lead times may affect schedule, and all add-ons need written approval.',
  },
]

const splitLines = (value = '') => value
  .split('\n')
  .map((item) => item.replace(/^[\s\-*.\u2022]+/, '').trim())
  .filter(Boolean)

const unique = (items = []) => Array.from(new Set(items.filter(Boolean)))

export const cloneSowDocument = (document) => ({
  ...document,
  rooms: (document.rooms || []).map((room) => ({ ...room })),
  exclusions: [...(document.exclusions || [])],
  paymentTerms: [...(document.paymentTerms || [])],
  termsNotes: [...(document.termsNotes || [])],
})

const ensureKitchenScope = (scope = '', additions = []) => {
  const baseParts = scope
    .split(/[.,]/)
    .map((item) => item.trim())
    .filter(Boolean)
  return unique([...baseParts, ...additions]).join(', ')
}

export const buildAiGeneratedDocument = ({ document, project, answers = {} }) => {
  const next = cloneSowDocument(document)
  const brief = answers.brief?.trim() || ''
  const roomNotes = answers.rooms?.trim() || ''
  const exclusionNotes = answers.exclusions?.trim() || ''
  const billingNotes = answers.billing?.trim() || ''
  const noteText = answers.notes?.trim() || ''
  const combined = `${brief} ${roomNotes}`.toLowerCase()

  if (brief) {
    next.projectType = project?.scope || next.projectType
  }

  if (/granite/.test(combined) || /chimney/.test(combined)) {
    next.rooms = next.rooms.map((room) => {
      if (room.id !== 'kitchen') return room
      return {
        ...room,
        scope: ensureKitchenScope(room.scope, [
          /granite/.test(combined) ? 'Granite countertop' : null,
          /chimney/.test(combined) ? 'Chimney provision included' : null,
        ]),
      }
    })
  }

  if (/foyer/.test(combined) && !next.rooms.some((room) => room.id === 'foyer')) {
    next.rooms.unshift({
      id: 'foyer',
      name: 'Foyer',
      scope: 'Shoe storage, mirror panel, and entry feature treatment',
    })
  }

  if (/utility/.test(combined) && !next.rooms.some((room) => room.id === 'utility')) {
    next.rooms.push({
      id: 'utility',
      name: 'Utility',
      scope: 'Service storage, appliance provision, and utility shutters',
    })
  }

  const parsedExclusions = splitLines(exclusionNotes)
  if (parsedExclusions.length) {
    next.exclusions = unique([...next.exclusions, ...parsedExclusions])
  }

  const parsedBilling = splitLines(billingNotes)
  if (parsedBilling.length) {
    next.paymentTerms = parsedBilling
  } else if (billingNotes) {
    next.paymentTerms = [billingNotes]
  }

  const parsedNotes = splitLines(noteText)
  if (parsedNotes.length) {
    next.termsNotes = unique([...next.termsNotes, ...parsedNotes])
  }

  return next
}

export const getSowAmendmentOptions = (document) => [
  {
    id: 'room-kitchen',
    label: 'Kitchen scope',
    sectionTitle: 'Section 2 - Scope (Kitchen)',
    patch: { type: 'room-scope', targetId: 'kitchen' },
    currentValue: document.rooms.find((room) => room.id === 'kitchen')?.scope || '',
  },
  {
    id: 'budget-total',
    label: 'Budget estimate',
    sectionTitle: 'Section 5 - Budget estimate',
    patch: { type: 'field', key: 'totalValueLabel' },
    currentValue: document.totalValueLabel || '',
  },
  {
    id: 'timeline-duration',
    label: 'Timeline duration',
    sectionTitle: 'Section 4 - Timeline',
    patch: { type: 'field', key: 'durationLabel' },
    currentValue: document.durationLabel || '',
  },
  {
    id: 'payment-terms',
    label: 'Payment terms',
    sectionTitle: 'Section 6 - Payment terms',
    patch: { type: 'list', key: 'paymentTerms' },
    currentValue: (document.paymentTerms || []).join('\n'),
  },
  {
    id: 'terms-notes',
    label: 'Terms and notes',
    sectionTitle: 'Section 7 - Terms and notes',
    patch: { type: 'list', key: 'termsNotes' },
    currentValue: (document.termsNotes || []).join('\n'),
  },
]

export const applySowAmendmentPatchToDocument = (document, amendment) => {
  const next = cloneSowDocument(document)
  const patch = amendment?.patch || {}

  if (patch.type === 'room-scope' && patch.targetId) {
    next.rooms = next.rooms.map((room) => (
      room.id === patch.targetId ? { ...room, scope: amendment.newValue } : room
    ))
    return next
  }

  if (patch.type === 'field' && patch.key) {
    next[patch.key] = amendment.newValue
    return next
  }

  if (patch.type === 'list' && patch.key) {
    next[patch.key] = splitLines(amendment.newValue)
    return next
  }

  return next
}
