# Swingle Levin Georgia Sentencing Guide website handoff

This package gives the Swingle Levin website company everything needed to add the Georgia Sentencing Guide as a new page on the firm's existing website.

## Recommended result

- Public page: `https://swinglelevin.com/georgia-sentencing-guide/`
- Page title: `Georgia Sentencing Guide & Penalty Lookup | Swingle Levin`
- Live tool: `https://georgia-sentencing-guide.vercel.app/`
- Recommended navigation location: `Resources`

The preferred implementation is a normal, indexable page on `swinglelevin.com` containing useful introductory copy and the embedded guide. This keeps visitors on the firm website and gives search engines meaningful same-domain content. A bare link that sends visitors directly to Vercel is an acceptable fallback, but it is not the preferred traffic or search-engine approach.

## What the website company should do

1. Create a new public page at `/georgia-sentencing-guide/`.
2. Use the title, meta description, H1, introductory copy, and optional supporting copy in `SEO-PAGE-COPY.md`.
3. Paste the contents of `EMBED-CODE.html` into a Custom HTML, Code, or Embed block below the firm's normal header and navigation.
4. Add the new page to the Resources menu.
5. Add relevant internal links to the guide from existing DUI, felony, misdemeanor, drug-crime, theft, assault, and other practice-area pages.
6. Keep the page indexable and set its canonical URL to `https://swinglelevin.com/georgia-sentencing-guide/`.
7. Complete every item in `VENDOR-TEST-CHECKLIST.md` before publishing.

## Technical requirements

- The iframe source is `https://georgia-sentencing-guide.vercel.app/`.
- If the firm website uses a Content Security Policy, allow this source in `frame-src`.
- Do not copy the sentencing database into the firm's content-management system. The live embed is the maintained version and will receive future legal-data and software updates automatically.
- Do not remove or obscure the legal disclaimer at the top of the embedded guide.
- The embed contains no login and requires no API key.
- If the page builder strips iframe code, ask the website host to permit the Vercel URL or use the direct-link fallback supplied in the embed code.

## Package files

- `EMBED-CODE.html` — ready-to-paste page section and embedded tool.
- `SEO-PAGE-COPY.md` — recommended search title, description, headings, and page copy.
- `TECHNICAL-INTEGRATION-NOTES.md` — framing, security, PWA isolation, and optional branded-subdomain guidance.
- `VENDOR-TEST-CHECKLIST.md` — desktop, phone, accessibility, and legal-notice checks.
- `SEARCH-AND-PRIVACY-NOTES.md` — indexing, launch coordination, internal linking, and privacy-conscious measurement.
- `SEND-TO-WEBSITE-COMPANY.txt` — a ready-to-send handoff message.
- `VERSION.txt` — the live version covered by this package.
- `assets/app-icon-512.png` — guide icon for a Resources card or other firm-site link.

Questions about the guide or corrections to its legal information should be sent to `Adam@SwingleLevin.com`.
