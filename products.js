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
  { id:1, name:"Deku - My Hero Academy", cat:"anime", patreon:"Tanuki Figures", desc:"Izuku Midoriya, o Deku de My Hero Academia, em uma pose de avanço sobre uma base de escombros. A peça traz os relâmpagos verdes do One For All envolvendo o herói, o cachecol esvoaçante, o traje com cinto e luvas detalhadas, além de um cenário danificado com um semáforo ao fundo. Escultura em resina com acabamento artesanal, pintada à mão no estúdio.",
  features:["Todo em resina maciço", "Com encaixes magnéticos", "LED no semáforo"],
  scales:[{ name:"1/6", price:1900, height:"32 cm" }, { name:"1/4", price:2500, height:"48 cm" }], img:"assets/produtos/deku-1.jpg", img2:"assets/produtos/deku-2.jpg" },
];
// Products with "scales" show "A partir de" the cheapest one
PRODUCTS.forEach(p => { if(p.scales){ p.price = Math.min(...p.scales.map(s=>s.price)); p.from = true; } });

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
