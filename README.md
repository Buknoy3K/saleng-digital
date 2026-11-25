# Saleng Digital website

The studio's own site in the **Heartwood** direction: an amber resin hero with pine growth rings, and dark pine panels for the content. Plain HTML, CSS and JS. No build step, so what you see in the folder is what goes live.

One exception: the 3D first screen. Edit `assets/js/hero3d.js` or `icons3d.js`, then run `npm install` (once) and `npm run build:3d` to rebuild `assets/js/hero3d.min.js`, which is the file the page actually loads (three.js is bundled inside, so nothing comes from another server). `assets/img/hero-poster.webp` is a still of the first icon shown until the 3D draws, and instead of it on data saver or 2G: re-take it with `make-poster.mjs` if the first icon changes.

## Pages
Everything is on one long home page (`index.html`). The menu scrolls to each section and highlights the one you're reading.

| Section | What's in it |
| --- | --- |
| `#top` Home | Giant SALENG, the definition, the "small system" line, client chips |
| `#services` | By business type (tabs: shops, laundries, offices, firms, something else) + Audit / Build / Support |
| `#work` | One row per client, with a screenshot that follows the cursor |
| `#pricing` | Spark / Flame / Bonfire + Care Plan + what every package includes |
| `#about` | Vision and Mission, built by IT students, Real clients / Built to fit / Always supported |
| `#contact` | Phone and email, with call / email / copy buttons, service area |

The only other pages are the client stories in `work/` (Snack Stop POS, ACA Laundry Kiosk, CCDC, Garcia). They hold the extra screenshots and photo.

## Edit
- **Phone, email, prices, feature counts, survey numbers, Garcia's result**: `assets/js/content.js`. Anything still containing `___` shows with an amber dashed outline. The **Call now** and **Email us** buttons stay off while their value is blank.
- **Menu and footer**: written once in `assets/js/site.js` (the `pages` list).
- **Colours and fonts**: `assets/css/site.css`, top of the file. They come from the pitch deck.
- **Images**: `assets/img/`. These are the pitch deck screenshots (demo data only), converted to WebP to keep pages light.

## Run locally
```
node serve.mjs
```
Open http://127.0.0.1:8765/. If that port is taken: `node serve.mjs . 8766`.

## Going live
GitHub Pages, like the pitch deck. Nothing is pushed until Wayne asks.
