# OCR Asset Review Log

Tracking of OCR-derived logo/menu seed-asset confirmations for the review sheet.

Sheet: https://docs.google.com/spreadsheets/d/1KiUVoSdprQ3M26_XDq-CNxQ9dfTBDxZ7MfFFR_IPPBc/edit

## 2026-07-05 — Sheet tightened so logos/menus are gated, not just linked

- Confirmed 11 logos as safe to use in `OCR Confirmed Seed Assets`.
- Confirmed 1 usable menu for `Sofia's Tacos`.
- Held the `Traci's Cherished Creations LLC` menu — seed name is still only `Creations LLC`.
- Rejected/held the questionable logo and menu images instead of letting them seed profiles.
- Added `OCR Menu Visual Queue` for the small set of menu-like images needing visual review.
- Added `OCR Asset Name Fixes` with 18 name/logo mismatch fixes, e.g.:
  - `PLUM BERS` -> `Pensacola Plumbers`
  - `EL Cateitta-` -> `El Camino Tacos`
  - `FLOORING & DESIGN LLC` -> `Paradise Flooring & Design LLC`

### Gating result

The ready sheet now only exposes confirmed asset URLs. Anything uncertain stays marked
`needs_asset_confirmation`, `hold_for_review`, or `do_not_use`, so it won't quietly seed a
bad logo/menu.
