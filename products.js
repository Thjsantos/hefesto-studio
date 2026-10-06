// Edit this list to manage the catalog. Add "img": "assets/produtos/arquivo.jpg" to show a real photo.
const WHATSAPP = "5516992293603"; // country + area code + number

const CATEGORIES = {
  anime:  { name: "Anime",  icon: "⚔️" },
  games:  { name: "Games",  icon: "🎮" },
  cosplay:{ name: "Cosplay",icon: "🎭" },
  mitologia:{ name: "Mitologia", icon: "🏛️" },
  pronta: { name: "Pronta Entrega", icon: "📦" },
};

const PRODUCTS = [
  { id:1, name:"Deku - My Hero Academy", cat:"anime", patreon:"Tanuki Figures", price:1600, img:"assets/produtos/deku-1.jpg", img2:"assets/produtos/deku-2.jpg" },
];

const brl = n => n.toLocaleString("pt-BR", { style:"currency", currency:"BRL" });

function cardHTML(p){
  const c = CATEGORIES[p.cat];
  const msg = encodeURIComponent(`Olá! Tenho interesse no produto: ${p.name} (${brl(p.price)}).`);
  return `<article class="card">
    <div class="pic">${p.tag?`<span class="tag">${p.tag}</span>`:""}${p.img?`<img src="${p.img}" alt="${p.name}" loading="lazy">${p.img2?`<img class="hover" src="${p.img2}" alt="${p.name}" loading="lazy">`:""}`:c.icon}</div>
    <div class="info">
      <small>${c.name}${p.patreon?` · ${p.patreon}`:""}</small><h3>${p.name}</h3>
      <div class="price">${brl(p.price)}${p.old?`<s>${brl(p.old)}</s>`:""}</div>
      <a class="btn small" href="https://wa.me/${WHATSAPP}?text=${msg}" target="_blank" rel="noopener">Pedir no WhatsApp</a>
    </div></article>`;
}
