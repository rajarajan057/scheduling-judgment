#!/usr/bin/env node
// verify_quotes.mjs: re-fetch each cited page and confirm the short quote really is on it.
// The page only shows a quote when this script found it. Needs the network. Writes quotes.verified.json.
//   node verify_quotes.mjs
import { readFileSync, writeFileSync } from "node:fs";
const cases = JSON.parse(readFileSync(new URL("./cases.json", import.meta.url), "utf8"));
const norm = (s) => s.replace(/<[^>]+>/g, " ").replace(/&(#x27|#39|apos);/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\u2019|[‘’]/g, "'").replace(/\s+/g, " ").toLowerCase();
const pages = new Map(), out = { checked_at: new Date().toISOString(), results: {} };
let bad = 0;
for (const c of cases.filter((x) => x.source.quote)) {
  const url = c.source.url;
  if (!pages.has(url)) {
    try { const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (quote-verifier)" }, signal: AbortSignal.timeout(20000) }); pages.set(url, r.ok ? norm(await r.text()) : null); }
    catch { pages.set(url, null); }
  }
  const page = pages.get(url), ok = !!page && page.includes(norm(c.source.quote));
  out.results[c.id] = ok;
  if (!ok) bad++;
  console.log(`${ok ? "found    " : page ? "NOT FOUND" : "UNREACHED"} ${c.id}  "${c.source.quote}"`);
}
writeFileSync(new URL("./quotes.verified.json", import.meta.url), JSON.stringify(out, null, 1));
console.log(bad ? `\n${bad} quote(s) not confirmed; the page will show the paraphrase and the link only.` : "\nAll quotes confirmed on their pages.");
process.exit(bad ? 1 : 0);
