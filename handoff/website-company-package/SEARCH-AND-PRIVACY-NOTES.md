# Search, launch, and privacy notes

## Search strategy

The firm-site page is the search asset. It should contain native HTML headings, introductory text, explanatory copy, links, and the legal notice in addition to the embedded tool. Search engines do not guarantee that content inside an iframe will be attributed to the parent page.

Required firm-page settings:

- Return public HTTP status `200` without a login or click gate.
- Use a self-referencing canonical URL for `https://swinglelevin.com/georgia-sentencing-guide/`.
- Keep the page indexable and include it in the XML sitemap.
- Add crawlable internal links from Resources, DUI, felony, drug-offense, misdemeanor, property-crime, and relevant blog pages.
- Keep the existing serious-felony sentencing article as a separate explanatory resource and link it to the interactive guide rather than replacing it with duplicate copy.
- Use the Search Console URL Inspection tool after launch and request indexing only after the final public page passes the vendor checklist.

## Embedded-app indexing coordination

After the new firm-site page is public and verified, coordinate with the guide maintainer about adding the response directive `X-Robots-Tag: noindex, indexifembedded` to the standalone Vercel page. Google documents this as a way to keep embedded content available to the parent page without ranking the standalone embed URL.

Do not make that change before the firm page is live. Do not block the Vercel app in `robots.txt`, because a crawler must be able to fetch it to process the directive. Other search engines may not support `indexifembedded`, so the firm's native page copy remains essential.

Google references:

- Iframe association is not guaranteed: `https://developers.google.com/search/help/office-hours/2023/december#how-to-index-the-contents-of-an-iframe-when-using-an-iframe`
- `indexifembedded`: `https://developers.google.com/search/blog/2022/01/robots-meta-tag-indexifembedded`
- Helpful, people-first content: `https://developers.google.com/search/docs/fundamentals/creating-helpful-content`
- Crawlable internal links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`

## Privacy-conscious measurement

It is reasonable to measure:

- Views of the firm-site guide page
- Successful iframe loads
- Clicks on the full-screen fallback link
- Clicks on the firm's consultation button

Do not record typed searches, selected offenses, sentencing-factor answers, case facts, or other indications of a visitor's legal interests unless Swingle Levin separately reviews and approves that collection. Do not send such information to advertising pixels by default.

## Maintenance

- The embedded Vercel URL is the maintained tool and should not be copied into the content-management system.
- The firm page should display the legal-review date near the tool.
- When the legal data changes, update the review date and verify the same core searches used in the launch checklist.
- If the embedded tool is unavailable, the fallback link should remain visible and the firm page should still contain useful native content.
