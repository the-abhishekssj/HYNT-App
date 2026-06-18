# HYNT HTML Build Audit

Validated against the current React build on 18 Jun 2026.

## Files Audited

- `HYNT_SOW_Both_Sides.html`
- `HYNT_Tasks_Tool.html`
- `HYNT_Finance_Tool.html`
- `HYNT_BOQ_Tool.html`
- `HYNT_Moodboard_Tool.html`
- `HYNT_SiteDiary_Tool.html`
- `HYNT_Team_Tool.html`
- `HYNT_Timeline_Tool.html`

## Overall Read

- The React app is now stronger than the HTML files on:
  - shared mock state between pro and homeowner
  - role switching and permission behavior
  - interconnected demo behavior across tools
- The HTML files are still stronger on:
  - module-specific depth
  - entry flows, alternate states, and onboarding screens
  - richer sub-screens inside each tool

## Module Audit

### `HYNT_SOW_Both_Sides.html`

Current React coverage:
- Pro SOW editing and sharing
- Homeowner review with remarks on specific sections
- Approve / reject / revise behavior
- Custom SOW creation path

Still missing from HTML:
- Template picker as a first-class entry screen
- AI generate flow
- Post-signoff amendment flow
- Richer signature / OTP / legal treatment

Status:
- Good enough for the demo
- Not the next thing to build

### `HYNT_Tasks_Tool.html`

Current React coverage:
- My tasks / team / approvals
- Task creation
- Permission-aware visibility
- Homeowner approval surface

Still missing from HTML:
- AI task suggestions
- Dedicated send-for-approval composer
- Richer approval card types and result states
- Tighter shared approvals lifecycle end-to-end

Status:
- Partially covered
- Still needs a proper approvals pass

### `HYNT_Finance_Tool.html`

Current React coverage:
- Pro finance workspace
- Homeowner payments workspace
- Shared invoice / payment / expense state
- Payment timeline shared across pro and homeowner
- Due / paid / upcoming handling

Still missing from HTML:
- Create invoice from BOQ schedule
- Manual invoice builder depth
- Record-payment detail screens
- Expense bill upload behavior
- P&L / export / reporting screens

Status:
- Stronger than before
- Still missing the richer finance workflows from HTML

### `HYNT_BOQ_Tool.html`

Current React coverage:
- Homeowner BOQ view
- Line item visibility
- BOQ-related homeowner questions

Still missing from HTML:
- Excel import flow
- Template download flow
- Import preview / confirm import
- Quotation revision flow
- Approve revised quotation flow
- Auto-create finance schedule after approval

Status:
- Main lifecycle is still missing
- One of the biggest remaining gaps

### `HYNT_Moodboard_Tool.html`

Current React coverage:
- Broader archive model
- Folder grid behavior
- Visibility and edit-access settings
- Homeowner-facing shared archive view

Still missing from HTML:
- Dedicated moodboard item-type flows
- Add item chooser
- Product link item
- Colour swatch item
- Text note item
- Comments inbox / resolve flow

Status:
- Archive architecture is better than the HTML
- Moodboard-specific depth is still behind the HTML

### `HYNT_SiteDiary_Tool.html`

Current React coverage:
- Pro site diary workspace
- Homeowner site diary workspace
- Buckets for logs / photos / sourcing / references
- Issues and issue status updates
- Homeowner reference sharing and designer replies
- Shared diary state between roles

Still missing from HTML:
- More explicit sourcing-only creation flow
- Some of the dedicated sub-screens and toggles
- A few richer photo / compose states from the HTML

Status:
- No longer a missing module
- Now reasonably aligned, with polish and depth still left

### `HYNT_Team_Tool.html`

Current React coverage:
- People and access page
- Role presets
- Grant toggles
- Invite creation
- Pending invite handling
- Active role switching for demoing permissions

Still missing from HTML:
- Dedicated add-team-member flow
- Dedicated add-client flow
- Join / accept invite screens
- OTP verification
- WhatsApp invite preview
- Paid seat / onboarding surfaces
- Activity / productivity summary cards

Status:
- Permission logic is solid
- Onboarding and invite acceptance are still largely missing
- This is the most obvious next build from the HTML files

### `HYNT_Timeline_Tool.html`

Current React coverage:
- Pro timeline workspace
- Homeowner timeline workspace
- Shared phase state
- Add phase
- Mark phase done
- Delay a phase and notify homeowner
- Timeline preview surfaced in homeowner project view

Still missing from HTML:
- Setup / template picker flow
- Richer phase edit surface
- More complete timeline setup states
- Some of the HTML's dedicated progress and phase-detail variants

Status:
- No longer missing
- Good base, but not yet as rich as the HTML

## Biggest Gaps Now

### Tier 1

- Team onboarding / invite acceptance / join flows
- BOQ import / quotation revision / finance handoff
- Tasks approvals lifecycle polish

### Tier 2

- Finance advanced workflows
- Moodboard-specific interactions inside archive
- Timeline setup / template-entry polish

### Tier 3

- SOW template / AI / amendment depth
- Export and reporting polish

## Recommended Next Build

1. `HYNT_Team_Tool.html`
   Reason: we already have permissions, but we still do not have the entry/onboarding surfaces that make the permission story believable.

2. `HYNT_BOQ_Tool.html`
   Reason: it connects directly into finance and makes the overall system feel more real.

3. `HYNT_Tasks_Tool.html`
   Reason: approvals still need a tighter end-to-end flow.

## Bottom Line

The right way to use the HTML files from here is:

- copy module structure from the HTML first
- preserve our shared-state and permission architecture
- only invent where the HTML truly has no coverage
