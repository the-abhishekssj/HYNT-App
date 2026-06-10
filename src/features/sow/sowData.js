export const createInitialSowDocument = (project) => ({
  projectName: project?.scope || 'Sharma 3BHK Renovation',
  clientName: project?.client || 'Priya Sharma',
  location: project?.location || 'Bandra, Mumbai',
  projectType: project?.scope || '3BHK Full Renovation',
  startMonth: 'June 2025',
  handoverMonth: 'January 2026',
  totalValueLabel: '18,00,000',
  paymentStructure: '30-30-24-10%',
  gstLabel: 'As applicable',
  durationLabel: '~7 months',
  rooms: [
    { id: 'living', name: 'Living Room', scope: 'False ceiling, feature wall, TV unit with storage' },
    { id: 'kitchen', name: 'Kitchen', scope: 'Modular L-shape, quartz countertop, soft-close shutters' },
    { id: 'master', name: 'Master Bedroom', scope: '8ft wardrobe, bed back panel, study unit' },
    { id: 'kids', name: 'Kids Room x2', scope: 'Wardrobe, study table, wall graphics' },
  ],
  exclusions: [
    'Civil or structural work',
    'Electrical rewiring',
    'Plumbing work',
    'Loose furniture',
    'Appliances and fixtures',
  ],
  paymentTerms: [
    '30% advance on project start',
    '30% at Milestone 1 completion',
    '24% at Milestone 2 completion',
    '10% on final handover',
    'Payment delays beyond 7 days may pause work',
  ],
  termsNotes: [
    '+/-10% variation on final bill acceptable',
    'Client approvals required before fabrication',
    'Scope additions quoted separately in writing',
    'Site access to be provided during working hours',
    'Jurisdiction: Mumbai',
  ],
})

export const sowTemplates = [
  {
    id: 'residential',
    icon: 'House',
    name: 'Residential',
    subtitle: 'For apartments, villas, bungalows and home interiors.',
    tags: ['Home interiors', '30-30-24-10%', '+/-10% variation'],
  },
  {
    id: 'commercial',
    icon: 'Building',
    name: 'Commercial',
    subtitle: 'For offices, retail, hospitality and commercial fit-outs.',
    tags: ['Office and retail', '40-30-20-10%', '+/-15% variation'],
  },
]

export const sowClientRemarks = [
  {
    id: 'kitchen-scope',
    sectionKey: 'rooms',
    title: 'Scope - Room wise',
    targetRoomId: 'kitchen',
    remark: 'I want granite countertop, not quartz. Also please include a chimney provision in the scope.',
    proposedScope: 'Modular L-shape, granite countertop, soft-close shutters, chimney provision included',
  },
  {
    id: 'budget-estimate',
    sectionKey: 'budget',
    title: 'Budget Estimate',
    remark: 'Budget seems high. Can we bring it down to 15L? The kitchen granite change should be cheaper.',
    rejectionReason: 'The granite upgrade and chimney add cost. The 18L estimate protects execution quality and keeps the selected scope intact.',
  },
]

export const createHomeownerSowProject = () => ({
  projectName: 'Sharma 3BHK Renovation',
  clientName: 'Priya Sharma',
  location: 'Bandra, Mumbai',
  projectType: '3BHK Full Renovation',
  budgetLabel: '18,00,000',
  handoverMonth: 'January 2026',
  designerName: 'Riya Desai',
})
