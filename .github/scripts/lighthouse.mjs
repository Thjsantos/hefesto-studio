// Runs Lighthouse (mobile) on the home, catalog and one product page of the site served at BASE_URL,
// saves the reports in ./reports and writes a Markdown summary to reports/lighthouse-summary.md.
// Report only: it never fails on a low score.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, appendFileSync } from "node:fs";

const BASE_URL = (process.env.BASE_URL || "http://localhost:8000/").replace(/\/?$/, "/");
const OUT = "reports";
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const LABELS = { performance: "Performance", accessibility: "Accessibility", "best-practices": "Best practices", seo: "SEO" };

// Same rule as slugify() in products.js, to build the product page address.
const slugify = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const products = JSON.parse(readFileSync("data/products.json", "utf8")).products;
const sample = products.find((p) => p.scales?.length > 1) || products[0];
const pages = [
  { name: "home", label: "Home", path: "index.html" },
  { name: "catalog", label: "Catalog", path: "catalogo.html" },
  ...(sample ? [{ name: "product", label: `Product (${sample.name.replace(/\s+/g, " ")})`, path: `produto.html?id=${slugify(sample.name)}` }] : []),
];

mkdirSync(OUT, { recursive: true });

const run = (page) => {
  const base = `${OUT}/lighthouse-${page.name}`;
  execFileSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["--yes", "lighthouse@13", BASE_URL + page.path, "--quiet",
      "--only-categories=" + CATEGORIES.join(","),
      "--output=json", "--output=html", `--output-path=${base}`,
      "--chrome-flags=--headless=new --no-sandbox"],
    { stdio: "inherit", shell: process.platform === "win32" },
  );
  return JSON.parse(readFileSync(`${base}.report.json`, "utf8"));
};

const dot = (score) => (score >= 0.9 ? "🟢" : score >= 0.5 ? "🟠" : "🔴");
const pct = (score) => `${dot(score)} ${Math.round(score * 100)}`;

const results = [];
for (const page of pages) {
  console.log(`\nLighthouse: ${page.label} (${BASE_URL + page.path})`);
  results.push({ page, lhr: run(page) });
}

const metric = (lhr, id) => lhr.audits[id]?.displayValue ?? "-";
let md = "<!-- lighthouse-report -->\n## Lighthouse report\n\n";
md += "| Page | " + CATEGORIES.map((c) => LABELS[c]).join(" | ") + " | FCP | LCP | TBT | CLS |\n";
md += "|---|" + "---|".repeat(CATEGORIES.length + 4) + "\n";
for (const { page, lhr } of results) {
  md += `| ${page.label} | ` + CATEGORIES.map((c) => pct(lhr.categories[c].score)).join(" | ") + ` | ` +
    ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift"]
      .map((id) => metric(lhr, id)).join(" | ") + " |\n";
}

md += "\n";
for (const { page, lhr } of results) {
  const flagged = [];
  for (const cat of Object.values(lhr.categories)) {
    for (const ref of cat.auditRefs) {
      const a = lhr.audits[ref.id];
      if (ref.weight > 0 && a.score !== null && a.score < 0.9) {
        flagged.push(`- **${LABELS[cat.id] ?? cat.id}:** ${a.title}${a.displayValue ? ` (${a.displayValue})` : ""}`);
      }
    }
  }
  md += `<details><summary>${page.label}: ${flagged.length ? `${flagged.length} thing(s) Lighthouse flags` : "nothing flagged"}</summary>\n\n` +
    (flagged.length ? flagged.join("\n") + "\n" : "No audit scored below 90.\n") + "\n</details>\n\n";
}

md += "_Report only, no pass/fail limits yet. Measured on the pull request's code served from a local server on the GitHub runner " +
  "(phone profile, simulated slow 4G, no compression), so the numbers differ from the live site and move a few points between runs. " +
  "The full HTML reports are in the `lighthouse-reports` artifact of this run._\n";

writeFileSync(`${OUT}/lighthouse-summary.md`, md);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
console.log("\n" + md);
