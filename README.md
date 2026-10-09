# Hefesto Studio

Catalog website for **Hefesto Studio**, a studio that sells 3D-printed resin figures (action figures, busts and props). Visitors browse the catalog, pick a scale and request a quote through WhatsApp. There is no checkout.

**Live site:** https://thjsantos.github.io/hefesto-studio/

The site is in Brazilian Portuguese (pt-BR).

## Features

- **Home, catalog and product pages** with a Greek/forge visual identity (parchment colors, meander borders, Cinzel + Inter fonts).
- **Catalog** with category filters (only categories that have products are shown) and text search.
- **Product page** with a photo gallery, an optional YouTube video, a scale selector and a details table. Price, approximate height and the WhatsApp message follow the selected scale.
- **"A partir de" pricing**: products with several scales show the cheapest price on the card.
- **Hover image** on catalog cards (a second photo fades in).
- **Quote by WhatsApp**: each button opens a chat with a pre-filled message for the product and scale.
- **Admin panel** to add and edit products without touching code (see below).
- **Responsive**: tested on phone-sized screens, no horizontal scroll.

## Tech

- Plain HTML, CSS and JavaScript, no framework and no build step.
- Hosted on **GitHub Pages**, deployed from `main`.
- Catalog stored in a JSON file and edited through **[Pages CMS](https://pagescms.org)**.

## Project structure

| Path | What it is |
|---|---|
| `index.html` | Home page |
| `catalogo.html` | Catalog with filters and search |
| `produto.html?id=<slug>` | Product detail page (the slug comes from the product name) |
| `products.js` | Shared logic: loads the catalog, prices, product cards, WhatsApp number |
| `data/products.json` | The catalog data |
| `style.css` | The single stylesheet |
| `.pages.yml` | Pages CMS configuration (the admin form) |
| `assets/` | Logo and product photos (`assets/produtos/`) |

## Product data

Each product in `data/products.json` can have:

| Field | Description |
|---|---|
| `name`, `cat` | Name and category (`anime`, `games`, `cosplay`, `mitologia`, `pronta`) |
| `patreon` | The model's creator, shown as "Modelo" |
| `img`, `img2`, `gallery` | Main photo, hover photo and up to 4 extra photos |
| `video` | Optional YouTube link (embedded as the last gallery item) |
| `desc`, `features` | Description paragraph and bullet list |
| `scales` | List of `{ name, price, height }`, for example `1/6`, `1900`, `32 cm` |
| `price`, `old`, `tag` | Single price (when there are no scales), previous price and a label such as "Novo" |

A product has at most 6 media items in total (photos plus the video).

## Run locally

The pages load `data/products.json` with `fetch`, so they must be served over HTTP. Opening the HTML files directly from disk will show an empty catalog.

```bash
# any static server works, for example:
npx serve .
# or use the "Live Server" extension in VS Code
```

Then open the address it prints, for example `http://localhost:3000`.

## Managing the catalog

1. Open [app.pagescms.org](https://app.pagescms.org) and sign in with GitHub.
2. Select this repository and open **Produtos**.
3. Add or edit a product and save. The change is committed to `main`, and GitHub Pages republishes the site in about a minute.

## Contributing and workflow

- Code changes go through a branch and a pull request, which the owner merges.
- `main` is protected against deletion and force-pushes.
- Product edits made in the CMS are committed directly to `main`.

## About

Built for Hefesto Studio. Instagram: [@hefesto_studioo](https://instagram.com/hefesto_studioo).
