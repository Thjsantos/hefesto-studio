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
- `assets/logo.png`, product photos in `assets/produtos/`.

## Business decisions
- WhatsApp: +55 16 99229-3603 (`5516992293603` in `products.js`).
- Instagram: https://instagram.com/hefesto_studioo
- Floating buttons (Instagram above WhatsApp) are icon only, no text, on every page. Everyone knows the logos, so don't write the names next to them.
- Each product has a "Modelo" (the Patreon creator whose model is printed), e.g. Tanuki Figures. Show it as "Modelo" on the detail page, not "Criador" and not with the word "Patreon" on cards.
- Prices depend on scale. A product with `scales:[{name,price,height}]` shows "A partir de <cheapest>" on the card. On the product page the first scale is preselected, and price, "Altura aproximada" and the WhatsApp quote message follow the selected scale.
- Product detail page "Pedir orçamento" sends a WhatsApp message with the product and scale. Final value, prazo and frete are confirmed with the studio.
- Optional product fields: `desc` (paragraph), `features` (bullet list), `specs` (extra table rows), `img`/`img2` (second image fades in on card hover), `gallery` (extra detail-page photos), `tag`, `old` (struck-through price).

## Current catalog
Only one product so far (in `data/products.json`): **Deku – My Hero Academy** (Anime, model Tanuki Figures), 1/6 32 cm R$ 1.900, 1/4 48 cm R$ 2.500. Features: resin maciça, encaixes magnéticos, LED no semáforo. Heights and prices were given by the owner, replace if they change. More products will be added later.

## Hosting and workflow
- Repo: https://github.com/Thjsantos/hefesto-studio (public). Live site via GitHub Pages from `main`: https://thjsantos.github.io/hefesto-studio/
- Don't push directly to `main`. Commit on a branch, push it and open a pull request; the owner merges. (The first feature push went straight to `main` by mistake.)
- Git and the GitHub CLI are installed and logged in as Thjsantos. If a push can't authenticate, run `gh auth setup-git`.
- The owner writes in English and Portuguese. Keep site copy in Portuguese.
