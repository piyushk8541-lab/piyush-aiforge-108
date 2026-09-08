# Piyush Kumar — Freelance Web & App Developer · Website

A professional, modern personal-service website for **Piyush Kumar** — freelance web & app
developer (landing pages, business websites and web tools at affordable, fixed prices).

Built as a **static site with zero build step**: plain HTML + CSS + vanilla JS. Deploy by
dropping the folder on any static host (Vercel, Netlify, GitHub Pages, cPanel, etc.).

## Run locally

```bash
# from this folder — any static server works
python3 -m http.server 8123
# then open http://localhost:8123
```

## Structure

```
index.html          → single-page site (all sections in order)
css/styles.css      → design system (dark, developer theme)
js/app.js           → pricing engine, booking flow, portfolio & AI-tools grids
assets/             → hero illustration, QR graphics, favicon
fonts/              → self-hosted woff2 fonts (no third-party font CDN needed)
```

Page flow: signature strip (ॐ नमः शिवाय) → Hero → About → **Services & Rate Card**
(3 categories × Basic/Standard/Pro, every plan selectable) → Portfolio → My AI Tools →
Booking (auto-filled form + WhatsApp + payment terms) → Footer signature.

## The important files / how to extend

| Want to…                              | Edit                                                            |
| ------------------------------------- | --------------------------------------------------------------- |
| Change a price / feature / plan copy  | `PRICING` + `PRICING_RAW` at the top of `js/app.js`             |
| Change the WhatsApp number            | `WA_NUMBER` in `js/app.js` (used by every link, the form, QR)   |
| Add a portfolio project               | Push an object into `PORTFOLIO` in `js/app.js`                  |
| Add a launched AI tool                | Push an object into `AI_TOOLS` in `js/app.js`                   |
| Regenerate a QR graphic               | `python3 make-qr.py` (see below) or any QR tool → `assets/`     |
| Change colours / fonts                | `:root` tokens + `@font-face` block in `css/styles.css`         |

**Note:** `js/app.js` is the single source of truth for the rate card. Both the desktop
comparison table and the mobile plan cards are rendered from the same data, so a change
updates every view at once.

## Booking flow behaviour

1. Visitor picks a category tab (Landing Pages / Business Websites / Web Tools).
2. Each plan has a **Choose this plan** button → the selection appears in the booking
   form's summary bar below and the page scrolls to it.
3. "Send Request" opens WhatsApp (`wa.me/919234610543`) with a pre-filled message
   containing the plan, price, name, number and requirement.
4. Payment terms (50% advance / 50% after delivery / direct contact) sit right beside the form.

## Regenerating QR graphics

```bash
python3 -m venv /tmp/qrenv && /tmp/qrenv/bin/pip install qrcode pillow
/tmp/qrenv/bin/python make-qr.py
```

`make-qr.py` writes `assets/qr-prem-technicians.png` (portfolio) and
`assets/qr-whatsapp.png` (booking). Point new portfolio QRs at any URL you like.

## License

MIT — see [LICENSE](LICENSE).
