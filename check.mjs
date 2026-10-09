#!/usr/bin/env node
// check.mjs: run the scheduling cases. No network, no dependencies. Anyone can run it.
//   node check.mjs            every case, the accept-everything agent, and one more thing:
//                             switch each rule off in turn; the cases must catch it (a rule no case notices is untested)
// Exit 0 only if all of that holds.
import { readFileSync } from "node:fs";
import { decide, naive, judge, RULES } from "./policy.js";

const cases = JSON.parse(readFileSync(new URL("./cases.json", import.meta.url), "utf8"));
const fails = [];
const run = (enabled) => cases.map((c) => ({ c, ...judge(c.expect, enabled === "naive" ? naive() : decide(c.facts, enabled)) }));

// 0. the file itself is sound
const ids = new Set();
for (const c of cases) {
  if (ids.has(c.id)) fails.push(`duplicate case id ${c.id}`);
  ids.add(c.id);
  if (!c.source?.url || !c.source?.tag) fails.push(`${c.id}: no source`);
  if (!c.expect?.move) fails.push(`${c.id}: no expected move`);
}

// 0b. every question can be shown as a real message, and the play order covers each case exactly once
const order = JSON.parse(readFileSync(new URL("./order.json", import.meta.url), "utf8"));
for (const c of cases) if (!c.from || !c.msg || !c.ctx) fails.push(`${c.id}: missing sender, message or context`);
if (order.length !== cases.length || new Set(order).size !== cases.length || order.some((i) => !ids.has(i))) fails.push("order.json is not each case exactly once");
for (const r of RULES) if (!r.short) fails.push(`rule ${r.id}: no short name`);

// 1. the rules baseline passes every case
const all = run(null);
// known gaps: questions the careful assistant is KNOWN to get wrong (no rule yet). They must stay wrong: if one starts
// passing, the flag is stale; if a normal question fails, a rule broke.
for (const r of all) {
  if (r.c.known_gap && r.pass) fails.push(`${r.c.id} is flagged known_gap but the baseline now passes it: remove the flag`);
  if (!r.c.known_gap && !r.pass) fails.push(`${r.c.id} ${r.c.title}: ${r.fails.join("; ")}`);
}
console.log(`rules baseline        ${all.filter((x) => x.pass).length}/${cases.length}  (${cases.filter((c) => c.known_gap).length} known gaps, by design)`);

// 2. an agent that says yes to everything must not pass everything
const nv = run("naive");
console.log(`accept-everything     ${nv.filter((x) => x.pass).length}/${cases.length}`);
if (nv.every((x) => x.pass)) fails.push("the accept-everything agent passes every case: the cases test nothing");

// 3. every rule is tested: switch it off and at least one case must fail, and that case must be one the rule decided
const decidedBy = new Map();
for (const c of cases) { const d = decide(c.facts); if (d.rule) (decidedBy.get(d.rule) || decidedBy.set(d.rule, []).get(d.rule)).push(c.id); }
for (const rule of RULES) {
  const enabled = new Set(RULES.map((r) => r.id)); enabled.delete(rule.id);
  const base = new Set(all.filter((x) => x.pass).map((x) => x.c.id));   // only count cases that passed before this rule was removed
  const broke = run(enabled).filter((x) => !x.pass && base.has(x.c.id)).map((x) => x.c.id);
  const used = decidedBy.get(rule.id) || [];
  console.log(`without ${rule.id.padEnd(20)} ${broke.length ? "caught by " + broke.join(", ") : "NOT CAUGHT"}`);
  if (!broke.length) fails.push(`rule "${rule.id}" can be switched off and no case notices`);
  if (!used.length) fails.push(`rule "${rule.id}" decided no case at all`);
}

console.log(fails.length ? `\nFAIL\n  ${fails.join("\n  ")}` : "\nPASS: every case passes, every rule is caught when removed.");
process.exit(fails.length ? 1 : 0);
