# Technical integration notes

## Supported integration

Use the maintained production origin for both the iframe and the full-screen link:

`https://georgia-sentencing-guide.vercel.app/`

Do not hard-code any `/_next/static/` URLs. Those filenames change when the guide is deployed.

The production app currently permits iframe embedding and requires no login, API key, or shared secret. If the firm site has a Content Security Policy, it must allow `https://georgia-sentencing-guide.vercel.app` in `frame-src`.

## Keep the PWA isolated

Do not copy `sw.js`, the manifest, or the compiled app files into the root of the main firm website. The service worker is intentionally scoped to `/` on its own Vercel origin. Placing it at the firm-site root could allow it to control and cache unrelated pages on `swinglelevin.com`.

Do not simply mount the current build under a firm-site subpath. A move to `/georgia-sentencing-guide/` would require coordinated changes to the app's base path, manifest scope, service-worker scope, icons, cache paths, and release checks. The supplied native page plus cross-origin embed avoids that risk.

## Framing security

The app is read-only and currently permits framing so the vendor can build and test the page. After the vendor supplies its exact production and staging origins, coordinate with the guide maintainer to restrict the app's `frame-ancestors` policy to approved Swingle Levin domains.

If the vendor chooses to add an iframe `sandbox`, it must preserve at least:

`allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox`

The supplied code intentionally omits `sandbox` to avoid breaking source links or browser behavior.

## Phone installation

Installing a web app from inside a cross-origin iframe is not reliable. Keep the visible `Open the Georgia Sentencing Guide full screen` link below the embed. Visitors can use that full-screen page to install the guide on an iPhone or Pixel.

## Optional branded direct address

For a later branding improvement, the firm may point a dedicated hostname such as `sentencing.swinglelevin.com` to the existing Vercel project. A dedicated hostname keeps the PWA isolated from the main website while presenting a Swingle Levin address. This requires coordinated DNS and Vercel-domain setup and should not replace the indexable firm-site wrapper page.

## Asset links

- Web app manifest: `https://georgia-sentencing-guide.vercel.app/manifest.webmanifest`
- 512-pixel icon: `https://georgia-sentencing-guide.vercel.app/icon-512.png`
- Maskable Android icon: `https://georgia-sentencing-guide.vercel.app/icon-maskable-512.png`
- Apple touch icon: `https://georgia-sentencing-guide.vercel.app/apple-touch-icon.png`
