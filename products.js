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

// PWA: register the service worker and show an "install app" button when the browser allows it.
if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
let installEvent;
addEventListener("beforeinstallprompt", e => {
  e.preventDefault(); installEvent = e;
  if (document.getElementById("install-app")) return;
  const b = document.createElement("button");
  b.id = "install-app"; b.className = "inst"; b.type = "button"; b.title = "Instalar app"; b.setAttribute("aria-label", "Instalar app");
  b.innerHTML = `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M12 7v7m-3-3 3 3 3-3"/></svg>`;
  b.onclick = async () => { installEvent.prompt(); await installEvent.userChoice; installEvent = null; b.remove(); };
  document.body.appendChild(b);
});
addEventListener("appinstalled", () => { const b = document.getElementById("install-app"); if (b) b.remove(); });