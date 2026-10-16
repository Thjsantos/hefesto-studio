# Hefesto Studio – website context

Catalog site for Hefesto Studio, a studio that sells 3D-printed resin figures (action figures, busts, props). Site language: Brazilian Portuguese (pt-BR). Orders are made through WhatsApp, there is no checkout.

## Stack and structure
- Static site: plain HTML, CSS and JS, no build step.
- `index.html` – home (hero, "Como comprar", "Peça sob encomenda"). The "Categorias" and "Destaques da forja" sections were removed on purpose ("don't need yet"); the data and CSS for them are still around.
- `catalogo.html` – catalog with filter buttons and search. Filter buttons only show categories that have products.
- `produto.html?id=<slug>` – product detail page, opened by clicking a card's image.
- `data/products.json` – the catalog (`{"products":[...]}`). Edited by the owner through the Pages CMS admin panel (config in `.pages.yml`, photos go to `assets/produtos/`). Each product's id/URL slug is derived from its name.
- `products.js` – shared logic: `WHATSAPP`, `CATEGORIES`, `productsReady` (promise that loads the JSON into `PRODUCTS`; pages must wait for it), `brl`, `priceHTML`, `priceText`, `cardHTML`. Opening pages via `file://` fails because of the fetch, use a local server.
- `style.css` – single stylesheet. Greek/forge look: parchment colors, meander bands, Cinzel + Inter fonts.
- Logo files: `assets/logo-120.png` (header, footer and favicon, 13 KB) and `assets/logo.webp` (home hero, 66 KB). The original 513 KB `logo.png` was removed on purpose because it loaded on every page, do not use a large image for the small header logo. Product photos in `assets/produtos/`.
- PWA (installable app): `manifest.webmanifest`, `sw.js` (service worker: network-first for pages, scripts and data so CMS changes show up right away, offline fallback from cache; photos stale-while-revalidate; bump `CACHE` in `sw.js` when the shell file list changes) and icons `assets/icon-*.png` (made from the logo; the maskable one has padding). `products.js` registers the worker and shows a floating "Instalar app" button (above Instagram) when the browser fires `beforeinstallprompt` (Android Chrome; iPhone has no such event). A Play Store version (TWA) would need the owner to have their own domain, not decided yet.

## Business decisions
- WhatsApp: +55 16 99229-3603 (`5516992293603` in `products.js`).
- Instagram: https://instagram.com/hefesto_studioo
- Floating buttons (Instagram above WhatsApp) are icon only, no text, on every page. Everyone knows the logos, so don't write the names next to them.
- Each product has a "Modelo" (the Patreon creator whose model is printed), e.g. Tanuki Figures. Show it as "Modelo" on the detail page, not "Criador" and not with the word "Patreon" on cards.
- Prices depend on scale. A product with `scales:[{name,price,height}] (height is a number of cm)` shows "A partir de <cheapest>" on the card. On the product page the first scale is preselected, and price, "Altura aproximada" and the WhatsApp quote message follow the selected scale.
- Product detail page "Pedir orçamento" sends a WhatsApp message with the product and scale. Final value, prazo and frete are confirmed with the studio.
- Optional product fields: `desc` (paragraph), `features` (bullet list), `specs` (extra table rows), `img`/`img2` (second image fades in on card hover), `gallery` (extra detail-page photos), `video` (YouTube link, any format: shorts, watch or youtu.be; embedded on the detail page as the last gallery item and counts as 1 of the max 6 media per product, max 4 extra photos in the CMS), `tag`, `old` (struck-through price).

## Current catalog
The catalog lives in `data/products.json` and is edited by the owner in the Pages CMS, so it changes without code changes (5 products at the time of writing: Deku, Frieren, Jin Kazama, Tokito, War). Read the file for names, prices, scales and heights instead of trusting a copy here. Descriptions of figures are written from the product photos and approved by the owner. The CMS form (`.pages.yml`) validates names (no double spaces), heights (a number of centimetres, the site adds " cm"; text values like "32 cm" from older data still display), destaques (no trailing punctuation) and YouTube links, and descriptions keep their line breaks (`white-space: pre-line`).

## Related project: automated mobile tests
- Separate project and repo (planned: `hefesto-studio-tests`) in `C:\Users\tmend\hefesto-studio-tests`: pytest + Appium (Python), run on the owner's Android phone against the live site. It has its own `CLAUDE.md`; work on it in a session opened in that folder.
- The tests read the live `data/products.json` and `products.js` (`WHATSAPP` constant) and rely on these selectors and ids. **If you rename or remove them, the tests break, so tell the owner and update the tests project too:**
  - header: `button.burger`, `header nav a`; floating buttons `a.wpp`, `a.ig`
  - home: `.hero h1`, `.hero .cta a.btn`, `#wpp-main`, `#como-comprar .step`
  - catalog: `#grid .card` (with `h3`, `small`, `.price`, `a.pic`), `#filters button`, `#q`, `#empty`
  - product page: `.summary h1`, `.summary small`, `#price`, `.scales button` (class `on` when selected), `#height`, `#quote`, `.thumbs button` (`.vid` for the video), `#main img`, `#main iframe`, `#empty`
  - behaviors: scale selection updates price, height and the quote message; max 6 media per product; product address `produto.html?id=<slug>`; filters only for categories that have products; the catalog lists products newest first, i.e. the reverse of the order in `data/products.json` (the CMS appends new products at the end; reordering in the CMS changes the order on the site). The tests repo should check this order.
- CI: `.github/workflows/e2e-tests.yml` runs when a pull request to `main` is opened or updated and again on every push to `main` (after a merge or a Pages CMS save). It checks out the code, serves it with `python -m http.server`, checks out `Thjsantos/hefesto-studio-tests` (branch `main`) and runs `pytest --target emulated --headless` with `HEFESTO_URL=http://localhost:8000/`, so a change is tested before it goes live. The HTML report is uploaded as the `e2e-report` artifact. If the check fails because of a deliberate site change, update the tests repo first (or in parallel).
- When you change site behavior on purpose, add or update the matching test in that project.
## Hosting and workflow
- Repo: https://github.com/Thjsantos/hefesto-studio (public). Live site via GitHub Pages from `main`: https://thjsantos.github.io/hefesto-studio/
- Don't push directly to `main`. Commit on a branch, push it and open a pull request; the owner merges. (The first feature push went straight to `main` by mistake.)
- Git and the GitHub CLI are installed and logged in as Thjsantos. If a push can't authenticate, run `gh auth setup-git`.
- `main` has a ruleset ("Protect main"): no deletion and no force-pushes, for everyone. Pages CMS saves are normal commits straight to `main`, that is expected.
- Commit with the GitHub no-reply email (`42556262+Thjsantos@users.noreply.github.com`), never the Gmail address. Older commits already contain the Gmail, the owner decided to leave them.
- Pass PR bodies to `gh pr create` with `--body-file` (a file without BOM), inline quotes break in PowerShell.
- The owner writes in English and Portuguese. Keep site copy in Portuguese.
