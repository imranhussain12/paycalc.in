# paycalc.in

Free salary, pension and tax calculators for Indian Central Government employees.
Pure static HTML + CSS + vanilla JS. No frameworks, no build step, no server.

**Live:** https://paycalc.in

## Structure

```
index.html              Homepage
tools/                  7 calculators (8th CPC, pension, arrears, DA, HRA, income tax, take-home)
guides/                 6 in-depth guides
levels/                 19 programmatic per-pay-level pages + index
assets/css/style.css    Single shared stylesheet
assets/js/main.js       Shared helpers (Indian number formatting, mobile nav, live-recalc wiring)
assets/js/ads.js        AdSense loader (see below)
assets/js/calculators/  One file per calculator
_headers / _redirects   Cloudflare Pages config
```

## How calculators work

Each calculator page defines inputs with a `data-calc` attribute. `main.js` wires every
`data-calc` element to a page-level `window.recalc()` on `input`/`change`, so results update
live with no submit button. All maths runs client-side — no figures leave the browser.

Shared helpers: `formatINR()` (Indian grouping: ₹1,25,000), `inWords()` (lakh/crore), `parseNum()`.

## Current rate assumptions

| Item | Value | Notes |
|---|---|---|
| DA | 60% | effective Jan 2026 |
| HRA | 27% / 18% / 9% | X / Y / Z cities |
| NPS | 10% employee + 14% govt | on Basic + DA |
| 7th CPC fitment factor | 2.57 | for comparison |
| Min / max basic (7th CPC) | ₹18,000 / ₹2,50,000 | Level 1 / Level 18 |
| Income tax | FY 2026-27 new regime | Income-tax Act, 2025 |

When DA is revised, update: `assets/js/calculators/da.js` (`DA_HISTORY`), the `value="60"`
defaults in the tool pages, and the rate references in the guides.

## Activating AdSense

1. Get paycalc.in approved in AdSense (the base script already loads on every page,
   so the integration is live for review).
2. Create display ad units, copy each `data-ad-slot` id into `AD_SLOTS` in
   `assets/js/ads.js` (keys match the `.ad-slot` element ids: `ad-top`, `ad-mid`,
   `ad-article`, `ad-footer`).
3. Set `ENABLED: true`, commit, push. Placeholders become live responsive units.

`ads.txt` already carries the publisher id.

## Deploy

Cloudflare Pages, connected to this repo. Build command: none. Output directory: `/`.
Every push to `main` deploys.

## QA before pushing

Serve locally and check: calculators produce correct values, no console errors,
no horizontal scroll at 360px, all internal links resolve, sitemap covers every page.
