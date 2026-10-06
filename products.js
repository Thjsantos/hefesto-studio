// Edit this list to manage the catalog. Add "img": "assets/produtos/arquivo.jpg" to show a real photo.
const WHATSAPP = "5516992293603"; // country + area code + number

const CATEGORIES = {
  anime:  { name: "Anime",  icon: "⚔️" },
  games:  { name: "Games",  icon: "🎮" },
  cosplay:{ name: "Cosplay",icon: "🎭" },
  mitologia:{ name: "Mitologia", icon: "🏛️" },
  pronta: { name: "Pronta Entrega", icon: "📦" },
};

// The catalog lives in data/products.json (edited through the Pages CMS admin, see .pages.yml).
// Pages must wait for productsReady before using PRODUCTS.
const PRODUCTS = [];
const slugify = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const productsReady = fetch("data/products.json", { cache: "no-cache" }).then(r => r.json()).then(d => {
  d.products.forEach(p => {
    p.id = slugify(p.name);
    // Products with "scales" show "A partir de" the cheapest one
    if (p.scales && p.scales.length) { p.price = Math.min(...p.scales.map(s => s.price)); p.from = true; }
  });
  PRODUCTS.push(...d.products);
});
const brl = n => n.toLocaleString("pt-BR", { style:"currency", currency:"BRL" });
const priceHTML = p => `${p.from?`<span class="from">A partir de</span>`:""}${brl(p.price)}${p.old?`<s>${brl(p.old)}</s>`:""}`;
const priceText = p => `${p.from?"a partir de ":""}${brl(p.price)}`;

function cardHTML(p){
  const c = CATEGORIES[p.cat];
  const msg = encodeURIComponent(`Olá! Tenho interesse no produto: ${p.name} (${priceText(p)}).`);
  return `<article class="card">
    <a class="pic" href="produto.html?id=${p.id}" aria-label="Ver detalhes de ${p.name}">${p.tag?`<span class="tag">${p.tag}</span>`:""}${p.img?`<img src="${p.img}" alt="${p.name}" loading="lazy">${p.img2?`<img class="hover" src="${p.img2}" alt="${p.name}" loading="lazy">`:""}`:c.icon}</a>
    <div class="info">
      <small>${c.name}${p.patreon?` · ${p.patreon}`:""}</small><h3>${p.name}</h3>
      <div class="price">${priceHTML(p)}</div>
      <a class="btn small" href="https://wa.me/${WHATSAPP}?text=${msg}" target="_blank" rel="noopener">Pedir no WhatsApp</a>
    </div></article>`;
}
