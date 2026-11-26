# mitchgainey.com: Squarespace → Cloudflare Pages

Static site in the **Soft Ground** design (headings: Hedvig Letters Serif, body: Hanken Grotesk). No framework and no npm dependencies.

## Layout

| Path | What it is |
|---|---|
| `src/pages/*.html` | One file per page. A JSON comment at the top sets the title, meta description, URL path, nav state and structured data. |
| `src/layout.html` | Shared `<head>`, header, mobile menu and footer |
| `src/assets/` | CSS, JS, images, favicon |
| `src/_redirects` | Old Squarespace URLs → new pages (301) |
| `src/_headers` | Cache and security headers |
| `functions/api/contact.js` | Contact form handler (Cloudflare Pages Function, sends via Resend) |
| `build.mjs` | Builds `dist/` (production) or `site/` (no-index preview) |
| `site/` | Built preview served on GitHub Pages. **Don't edit; it's generated.** |
| `current/`, `v1-…` to `v4-…` | The original homepage design explorations |

## Commands

    node build.mjs              # production build → dist/
    node build.mjs --preview    # preview build (noindex) → site/
    python3 -m http.server      # then open http://localhost:8000/site/

After editing anything in `src/`, run both builds. Commit `site/` so the GitHub preview updates.

## Deploying to Cloudflare Pages

1. Cloudflare dashboard → Workers & Pages → Create → Pages → connect this GitHub repo.
2. Build command: `node build.mjs` · Build output directory: `dist` · Root directory: (blank)
3. Settings → Variables and Secrets:
   - `RESEND_API_KEY` (secret): from resend.com, after verifying the mitchgainey.com domain there
   - `CONTACT_FROM`: e.g. `Mitch Gainey website <website@mitchgainey.com>`
   - `CONTACT_TO` (optional): defaults to Mitch@becomeproject.com.au
4. Custom domains → add `www.mitchgainey.com` and `mitchgainey.com`, then move DNS off Squarespace.
5. After launch, submit `https://www.mitchgainey.com/sitemap.xml` in Google Search Console.

The production build has no `noindex`, ships a real `robots.txt` and `sitemap.xml`, and keeps the Squarespace URLs (`/about`, `/services`, `/evidence-based-eft`, `/focusing`, `/resources/…`, `/contact`).

## Content to confirm with Mitch

- **EBEFT dates and price.** The live site said "May" and £497. The site now uses his registration page: 19–20 & 26–27 Feb 2027, £499 early bird until 19 Jan, then £549.
- **EBEFT for Trauma.** No registration link or fee on the old site, so the button opens an email enquiry.
- **Focusing "Register".** The old button linked to an unrelated store page, so it now opens an email. Use a booking link if he has one.
- **Focusing times.** Shown as 8–10:30am UK / 7–9:30pm Sydney. These hold until late March, when the clocks change in both countries.
- **EBEFT article date.** Shows 28 May 2019, which looks like a Squarespace placeholder. The article also credits the Clinical EFT model to Dawson Church, while the training page credits Dr Peta Stapleton.
- **Images.** Several photos are AI-generated and some show the Gemini sparkle watermark in a corner. `services-stock.jpg` is a Stocksy photo loaded from a different Squarespace account, so check the licence covers this site.
