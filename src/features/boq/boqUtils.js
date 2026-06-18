export const INR = '\u20b9'

export const parseQuantityValue = (value) => {
  if (typeof value === 'number') return value
  const numeric = Number.parseFloat(String(value).replace(/[^0-9.]/g, ''))
  return Number.isFinite(numeric) ? numeric : 0
}

export const formatRupees = (value) => `${INR}${Math.round(value).toLocaleString('en-IN')}`
export const formatLakhs = (value) => `${INR}${value.toFixed(1)}L`

export const getBoqItemAmount = (item) => parseQuantityValue(item.quantity) * (Number(item.rate) || 0)
export const toBoqRoomId = (name = 'General') => {
  const slug = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `boq-room-${slug || 'general'}`
}

export const groupBoqItemsBySpace = (items = []) => {
  const groups = new Map()
  items.forEach((item) => {
    const key = item.space || 'General'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(item)
  })
  return Array.from(groups.entries())
}

export const groupBoqItemsByCategory = (items = []) => {
  const groups = new Map()
  items.forEach((item) => {
    const key = item.category || 'General'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(item)
  })
  return Array.from(groups.entries())
}

export const getUniqueBoqRoomsFromItems = (items = [], projectId = 'p-1') => {
  const rooms = []
  const seen = new Set()
  items.forEach((item, index) => {
    const name = item.space || 'General'
    const id = item.roomId || toBoqRoomId(name)
    const key = `${projectId}-${id}`
    if (seen.has(key)) return
    seen.add(key)
    rooms.push({
      id,
      projectId,
      name,
      note: '',
      order: index,
    })
  })
  return rooms
}

export const buildBoqRoomSummaries = (rooms = [], items = []) => {
  const roomMap = new Map()
  rooms.forEach((room, index) => {
    roomMap.set(room.id, {
      ...room,
      order: room.order ?? index,
      itemCount: 0,
      total: 0,
      openQuestionCount: 0,
      totalQuestionCount: 0,
      disputedItemCount: 0,
    })
  })

  items.forEach((item, index) => {
    const roomId = item.roomId || toBoqRoomId(item.space || 'General')
    if (!roomMap.has(roomId)) {
      roomMap.set(roomId, {
        id: roomId,
        projectId: item.projectId,
        name: item.space || 'General',
        note: '',
        order: rooms.length + index,
        itemCount: 0,
        total: 0,
        openQuestionCount: 0,
        totalQuestionCount: 0,
      })
    }
    const room = roomMap.get(roomId)
    const questions = item.clientQuestions || []
    const openQuestionCount = questions.filter((question) => question.status !== 'resolved').length
    room.itemCount += 1
    room.total += getBoqItemAmount(item)
    room.totalQuestionCount += questions.length
    room.openQuestionCount += openQuestionCount
    if (openQuestionCount) room.disputedItemCount += 1
  })

  return Array.from(roomMap.values()).sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
}

export const boqImportPreviewRows = [
  {
    space: 'Living Room',
    category: 'Civil',
    item: 'False Ceiling - Cove lighting',
    quantity: '320',
    unit: 'sqft',
    rate: 90,
    vendor: 'ABC Contractors',
    vendorRate: 75,
    markupPercent: 10,
  },
  {
    space: 'Living Room',
    category: 'Carpentry',
    item: 'TV Unit with storage',
    quantity: '1',
    unit: 'unit',
    rate: 55000,
    vendor: 'Raj Furniture',
    vendorRate: 47000,
    markupPercent: 7,
  },
  {
    space: 'Kitchen',
    category: 'Modular',
    item: 'Modular kitchen - L-shape, granite top',
    quantity: '1',
    unit: 'unit',
    rate: 220000,
    vendor: 'Sleek Kitchens',
    vendorRate: 203000,
    markupPercent: 8,
  },
  {
    space: 'Master Bedroom',
    category: 'Carpentry',
    item: 'Wardrobe - 8ft sliding mirror',
    quantity: '1',
    unit: 'unit',
    rate: 95000,
    vendor: 'Modi Interiors',
    vendorRate: 87000,
    markupPercent: 9,
  },
  {
    space: 'Kids Rooms x2',
    category: 'Carpentry',
    item: 'Wardrobe per room',
    quantity: '2',
    unit: 'unit',
    rate: 55000,
    vendor: '',
    vendorRate: 50500,
    markupPercent: 9,
    warning: 'Row 12: Missing vendor name - will import without',
  },
]

export const boqStatusLabels = {
  draft: 'In progress',
  shared: 'For approval',
  changesRequested: 'Changes requested',
  revised: 'Revised',
  approved: 'Approved',
}
