# Kronara — Marketing Website (kronara.app)

**This is the public marketing site.** It is *not* the app.

- **Live at:** https://kronara.app
- **GitHub repo:** `beezkneez/kronara`
- **Hosting:** GitHub Pages, served straight from the [`docs/`](docs) folder
  (`docs/CNAME` holds the `kronara.app` domain — don't delete it)
- **Build step:** none. `docs/index.html` is hand-written HTML using the
  Tailwind CDN, so whatever is committed is what ships.

## Layout

| Path | What it is |
|---|---|
| `docs/index.html` | The entire marketing site — hero, features, pricing, FAQ |
| `docs/onboarding.html` | Post-signup welcome / setup page |
| `docs/privacy.html`, `docs/terms.html`, `docs/security.html` | Legal + security pages |
| `docs/brand.css` | Shared brand stylesheet for the legal/security pages |
| `docs/assets/images/` | Logo lockup + square icon |
| `docs/assets/screenshots/` | Product screenshots used on the page |
| `website-tools/` | Puppeteer script that regenerates the screenshots (`npm install` first) |

## Brand

Charcoal and gold, taken from the Kronara lockup.

| Token | Value | Use |
|---|---|---|
| `gold` | `#D9AE68` | Primary accent — headings, links, icons, borders |
| `gold-light` | `#F2E0AE` | Highlights, gradient top-stop |
| `copper` | `#C17F33` | Secondary accent, differentiates feature groups |
| `ink` | `#070A0F` | Page background |
| `ink-header` | `#05070B` | Header |
| `ink-light` | `#0E141C` | Alternating sections |
| `ink-card` | `#131B24` | Cards |
| `ink-border` | `#263241` | Hairlines |
| `success` | `#6FBF8E` | Checkmarks, positive states |

Colours live in **one place** — the `tailwind.config` block at the top of
`docs/index.html` (and again in `docs/onboarding.html`). Change them there,
not inline.

> **Gold fills must carry dark text.** White on `gold` is 2.06:1 and fails
> contrast badly. Solid `bg-kronara-gold` / `bg-kronara-copper` elements use
> `text-kronara-ink`. Gold as *text* on a dark surface is fine (9.6:1).

## Don't confuse these repos

| Folder | Repo | What it is |
|---|---|---|
| `C:\dev\kronara-website` | `beezkneez/kronara` | **This** — the marketing site at kronara.app |
| `C:\dev\kronara` | `beezkneez/kronara-build` | The **app** (Node/Express + Postgres, deployed on Railway) |
| `C:\dev\kronara-admin` | `beezkneez/kronara-admin` | Tenant provisioning / admin tooling |
| `C:\dev\kronara-mobile` | — | Capacitor mobile shell |

## Deploying

Push to `main` — GitHub Pages publishes `docs/` automatically.

```sh
git add -A
git commit -m "your message"
git push
```
