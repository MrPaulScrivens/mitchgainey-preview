# Mitch Gainey: website rebuild (Squarespace → Cloudflare Pages)

Static HTML, no build step. Open `index.html` for the picker.

| Folder | Direction |
|---|---|
| `current/` | Faithful rebuild of the live Squarespace homepage |
| `v1-editorial/` | Warm paper, magazine layout, essay voice |
| `v2-soft-ground/` | Organic and calm, breathing "pause" interaction |
| `v3-clear-practice/` | Conversion-led: two paths, visible pricing, FAQ |
| `v4-nocturne/` | Dark, cinematic, photo-led |

Images were copied from the Squarespace CDN into `assets/img/`.

## Preview locally
    python3 -m http.server 8000

## Deploy
    npx wrangler pages deploy . --project-name mitchgainey

## Issues on the live site, fixed in the variations
- The Resources card links to /services
- The Facebook URL is malformed (`facebook.com/https://www.facebook.com/...`)
- The Focusing "Register" button points at `/strade-store/p/italian-dolomites`
- The /about "Book a consultation" button points at /work-with-me
- Typo "Trainings ae" on the EBEFT page
