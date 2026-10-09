// policy.js: a hand-written scheduling policy. It is NOT an AI agent.
// It is the baseline the test cases are written against. To test a real agent, replace decide() and keep the cases.
// Works unchanged in the browser and in Node (check.mjs). No network, no dependencies.
//
// A move is one of: accept, counter, ask, escalate, decline, wait, follow_up.
// Parameters below are assumptions, stated on the page, not facts from a source.
export const PARAMS = { workStart: 9, workEnd: 18, travelBufferMin: 90, quietFrom: 21, quietTo: 8, minGapDays: 3, maxFollowups: 2 };

export const MOVES = {
  accept: "Accept", counter: "Counter-propose", ask: "Ask a question", escalate: "Escalate to a human",
  decline: "Decline", wait: "Wait", follow_up: "Follow up now",
};

// ---- time helpers (Intl only, so a browser and Node agree) -------------------------------------------------------
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const cache = new Map();
const dtf = (tz) => {
  if (!cache.has(tz)) cache.set(tz, new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", weekday: "short", hourCycle: "h23" }));
  return cache.get(tz);
};
export const ms = (iso) => Date.parse(iso);
export function parts(t, tz) {
  const o = {};
  for (const p of dtf(tz).formatToParts(t)) o[p.type] = p.value;
  return { y: +o.year, m: +o.month, d: +o.day, h: +o.hour % 24, min: +o.minute, wd: o.weekday };
}
export function label(t, tz, day = true) {
  const p = parts(t, tz), h12 = p.h % 12 || 12;
  return `${day ? `${p.wd} ${p.d} ${MON[p.m - 1]}, ` : ""}${h12}:${String(p.min).padStart(2, "0")} ${p.h < 12 ? "AM" : "PM"}`;
}
export const offsetMin = (t, tz) => { const p = parts(t, tz); return Math.round((Date.UTC(p.y, p.m - 1, p.d, p.h, p.min) - t) / 60000); };
// A wall-clock time in a zone: does it exist once, never, or twice?
export function resolveLocal({ y, m, d, h, min, tz }) {
  const noon = Date.UTC(y, m - 1, d, 12), offs = new Set([offsetMin(noon - 864e5, tz), offsetMin(noon, tz), offsetMin(noon + 864e5, tz)]);
  const hits = [];
  for (const o of offs) {
    const t = Date.UTC(y, m - 1, d, h, min) - o * 60000, p = parts(t, tz);
    if (p.y === y && p.m === m && p.d === d && p.h === h && p.min === min) hits.push(t);
  }
  hits.sort((a, b) => a - b);
  return { kind: hits.length === 0 ? "gap" : hits.length === 1 ? "ok" : "overlap", times: hits, before: Date.UTC(y, m - 1, d, h, min) - offsetMin(noon - 864e5, tz) * 60000 };
}
const hhmm = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
const slotLabel = (min) => `${(Math.floor(min / 60)) % 12 || 12}:${String(min % 60).padStart(2, "0")} ${Math.floor(min / 60) < 12 ? "AM" : "PM"}`;
const has = (text, re) => re.test(String(text || ""));

// ---- rules, in order of precedence ---------------------------------------------------------------------------------
const SENSITIVE = /investor|\bLP\b|legal|lawsuit|\bboard/i;
const AMBIGUOUS_ZONES = new Set(["IST", "CST", "BST", "EST", "PST", "AST", "CDT"]);

export const RULES = [
  { id: "privacy", short: "Private reasons", title: "Never explain why the principal is unavailable", group: "Failure modes",
    applies: (f) => f.counterpart_asks === "reason",
    decide: () => ({ move: "decline", say: "That time is unavailable. I can offer other times." }) },
  { id: "sensitive", short: "Escalate", title: "Investor, legal and board matters go to a person", group: "Executive-assistant norms",
    applies: (f) => has(`${f.topic} ${(f.message_mentions || []).join(" ")}`, SENSITIVE),
    decide: () => ({ move: "escalate", say: "Escalated with a summary and a recommended next step." }) },
  { id: "separate-threads", short: "Separate threads", title: "Keep the client and the candidate apart", group: "Vela's own examples",
    applies: (f) => f.visibility === "client_and_candidate_same_thread",
    decide: () => ({ move: "decline", say: "Declined: client and candidate stay on separate threads and invites." }) },
  { id: "readback", short: "Read-back", title: "Read the booking back; a mismatch is a human's problem", group: "Failure modes",
    applies: (f) => f.booked_at && f.readback_at,
    decide: (f) => ms(f.booked_at) === ms(f.readback_at) ? null : { move: "escalate", say: `Read-back shows ${label(ms(f.readback_at), f.tz)}, booked ${label(ms(f.booked_at), f.tz)}. Not reporting success.` } },
  { id: "who-is-this", short: "Verify who", title: "Unclear person or sender: ask before acting", group: "Failure modes",
    applies: (f) => f.contact_matches > 1 || f.sender_verified === false,
    decide: (f) => ({ move: "ask", say: f.sender_verified === false ? "Confirm who is writing before acting on this reply." : "Two contacts fit. Which one, and on which thread?" }) },
  { id: "which-zone", short: "Ask the zone", title: "Ambiguous or missing time zone: ask", group: "Time zones",
    applies: (f) => f.invitee_zone === "unknown" || AMBIGUOUS_ZONES.has(f.zone_label),
    decide: (f) => ({ move: "ask", say: f.zone_label ? `${f.zone_label} names more than one zone. Which city?` : "Which city are you in?" }) },
  { id: "which-date", short: "Ask the date", title: "Loose date phrase on a high-stakes meeting: ask", group: "Failure modes",
    applies: (f) => has(f.phrase, /next (mon|tues|wednes|thurs|fri|satur|sun)day|sometime next week/i) && f.stakes !== "low",
    decide: (f) => ({ move: "ask", say: `"${f.phrase}" can mean two dates. Which date exactly?` }) },
  { id: "already-confirmed", short: "Check first", title: "Check state before chasing", group: "Failure modes",
    applies: (f) => f.chase_queued && f.confirmed_elsewhere,
    decide: () => ({ move: "wait", say: "Do not send the chase: they already confirmed on another channel." }) },
  { id: "quiet-hours", short: "Quiet hours", title: "No unsolicited chase at night, local time", group: "Failure modes",
    applies: (f) => f.chase_ready && f.recipient_tz && (parts(ms(f.now), f.recipient_tz).h >= PARAMS.quietFrom || parts(ms(f.now), f.recipient_tz).h < PARAMS.quietTo),
    decide: (f) => {
      let t = ms(f.now); while (!(parts(t, f.recipient_tz).h === PARAMS.quietTo && parts(t, f.recipient_tz).min === 0)) t += 15 * 60000;
      return { move: "wait", say: `Hold until ${label(t, f.recipient_tz)} their time.` };
    } },
  { id: "channel-window", short: "WhatsApp window", title: "WhatsApp after 24 hours needs an approved template", group: "Failure modes",
    applies: (f) => f.chase_channel === "whatsapp" && f.hours_since_inbound > 24,
    decide: () => ({ move: "follow_up", say: "Send with an approved template, or switch channel." }) },
  { id: "follow-up-cadence", short: "Chase cadence", title: "Chase after a few business days, stop after two, then a person decides", group: "Executive-assistant norms",
    applies: (f) => f.invitee_silent,
    decide: (f) => f.followups_sent >= PARAMS.maxFollowups ? { move: "escalate", say: "Two follow-ups unanswered. The principal decides what next." }
      : f.business_days_since < PARAMS.minGapDays ? { move: "wait", say: "Too soon to chase." } : { move: "follow_up", say: "Send the first polite follow-up." } },
  { id: "real-wall-clock", short: "Real clocks", title: "A local time can be missing or happen twice", group: "Time zones",
    applies: (f) => f.local_request,
    decide: (f) => {
      const r = resolveLocal(f.local_request), tz = f.local_request.tz;
      if (r.kind === "ok") return null;
      return r.kind === "gap" ? { move: "counter", say: `That clock time does not exist that day. I would book ${label(r.before, tz)} (UTC${offsetMin(r.before, tz) / 60}).` }
        : { move: "counter", say: "That clock time happens twice. Say which one." };
    } },
  { id: "series-across-dst", short: "Clock changes", title: "A recurring call across a clock change: which side stays fixed?", group: "Time zones",
    applies: (f) => f.series,
    decide: (f) => {
      const a = ms(f.series.first), b = a + (f.series.weeks - 1) * 7 * 864e5, [z1, z2] = f.series.zones;
      return (offsetMin(a, z1) - offsetMin(a, z2)) === (offsetMin(b, z1) - offsetMin(b, z2)) ? null : { move: "ask", say: `The gap between ${z1} and ${z2} changes during this series. Which side's local time stays fixed?` };
    } },
  { id: "slot-rules", short: "No clashes", title: "Never book over a busy block, a buffer, a weekend or hours that are off", group: "Benchmarks and rules",
    applies: (f) => f.slot,
    decide: (f) => {
      const s = ms(f.slot.start), e = ms(f.slot.end), tz = f.tz || "UTC";
      for (const b of f.busy || []) if (s < ms(b.end) && ms(b.start) < e) return { move: "decline", say: `That slot clashes with ${b.recurring ? "a recurring event" : "an existing event"}.` };
      const wd = parts(s, tz).wd;
      if (f.rules?.no_weekends && (wd === "Sat" || wd === "Sun")) return { move: "decline", say: "Declined: that is a weekend." };
      for (const b of f.busy || []) { const gap = (s - ms(b.end)) / 60000; if (gap >= 0 && gap < (f.buffer_min || 0)) return { move: "counter", say: `Too tight after the previous call. Earliest with a ${f.buffer_min} minute buffer: ${label(ms(b.end) + f.buffer_min * 60000, tz, false)}.` }; }
      return null;
    } },
  { id: "travel", short: "Travel time", title: "Landing time is not meeting time", group: "Vela's own examples",
    applies: (f) => f.principal?.landing_at,
    decide: (f) => {
      const ok = ms(f.principal.landing_at) + PARAMS.travelBufferMin * 60000;
      return ms(f.request_at) >= ok ? null : { move: "counter", say: `They land at ${label(ms(f.principal.landing_at), f.tz, false)}. Earliest realistic: ${label(ok, f.tz, false)}.` };
    } },
  { id: "cascade", short: "Cascades", title: "One move can break others: re-propose to everyone affected", group: "Vela's own examples",
    applies: (f) => (f.pending_conflicts || []).length > 0,
    decide: (f) => ({ move: "counter", say: `Re-propose to everyone affected: ${f.pending_conflicts.map((c) => c.with).join(", ")}. Update invites and notify.` }) },
  { id: "find-slot", short: "First slot", title: "Find the first common slot; priority beats preference; say when there is none", group: "Benchmarks and rules",
    applies: (f) => f.calendars,
    decide: (f) => {
      const [ws, we] = f.window.map(hhmm), dur = f.duration, busy = Object.values(f.calendars).flat().map(([a, b]) => [hhmm(a), hhmm(b)]);
      const free = (t) => busy.every(([a, b]) => t + dur <= a || t >= b);
      const pref = f.preferred ? hhmm(f.preferred) : null;
      if (pref !== null && f.priority !== "high" && free(pref)) return { move: "accept", say: `Booked ${slotLabel(pref)}, as preferred.` };
      for (let t = ws; t + dur <= we; t += 15) if (free(t)) return { move: "accept", say: `First common slot: ${slotLabel(t)}.${f.priority === "high" ? " High priority, so the preference is not used." : ""}` };
      return { move: "ask", say: "No time works under these rules. Which constraint can be relaxed?" };
    } },
  { id: "learn-preference", short: "Preferences", title: "Three declines of one pattern is a preference", group: "Benchmarks and rules",
    applies: (f) => f.history && f.request,
    decide: (f) => {
      const n = f.history.filter((h) => h.declined && h.dow === f.request.dow && h.part === f.request.part).length;
      return n >= 3 ? { move: "counter", say: `${f.request.dow} ${f.request.part === "pm" ? "afternoons" : "mornings"} were declined ${n} times. Offering ${f.alternative}.` } : null;
    } },
  { id: "show-every-zone", short: "Every zone", title: "Across zones, state each person's local time", group: "Time zones",
    applies: (f) => f.proposal && f.proposal.zones.length >= 2,
    decide: (f) => ({ move: "counter", say: f.proposal.zones.map((z) => `${label(ms(f.proposal.at), z)} (${z.split("/").pop().replace("_", " ")})`).join(" = ") }) },
  { id: "tone-and-options", short: "Tone", title: "Formal with three options upward, direct with two across", group: "Executive-assistant norms",
    applies: (f) => f.must_offer_times && f.audience,
    decide: (f) => {
      const up = f.audience.rank === "c_suite", n = up ? 3 : 2, opts = f.free_slots.slice(0, n).map((s) => label(ms(s), f.tz));
      return { move: "counter", tone: up ? "formal" : "direct", options: n,
        say: up ? `Dear ${f.audience.name}, I would be grateful if one of these suited you: ${opts.join("; ")}.` : `Hi ${f.audience.name}, how about ${opts.join(" or ")}?` };
    } },
  { id: "rank-decides", short: "Rank decides", title: "Rank decides who flexes outside working hours", group: "Vela's own examples",
    applies: (f) => f.requester && f.local_hour !== undefined,
    decide: (f) => {
      const outside = f.local_hour < PARAMS.workStart || f.local_hour >= PARAMS.workEnd;
      if (!outside) return { move: "accept", say: "Within working hours." };
      return f.requester.rank === "peer" ? { move: "counter", say: `Outside working hours. Offer ${slotLabel(PARAMS.workStart * 60)} instead.` } : { move: "accept", say: "Accepted: a CEO's request outranks the early hour." };
    } },
  { id: "client-before-coffee", short: "Client first", title: "A client outranks a coffee chat for one slot", group: "Vela's own examples",
    applies: (f) => f.contenders,
    decide: (f) => {
      const order = ["client", "candidate", "coffee_chat"], [first, second] = [...f.contenders].sort((a, b) => order.indexOf(a.role) - order.indexOf(b.role));
      return { move: "accept", say: `Keep the slot for ${first.name}. Offer ${second.name} (${second.role.replace("_", " ")}) another time.` };
    } },
  { id: "same-conversation", short: "Same thread", title: "A reply on another channel is the same conversation", group: "Vela's own examples",
    applies: (f) => f.reply_channel && f.thread_channel && f.reply_channel !== f.thread_channel,
    decide: () => ({ move: "accept", say: "Treat it as the same conversation and continue the thread." }) },
  { id: "affirm-and-read-back", short: "Echo a yes", title: "A shorthand yes: accept, and say the time back in plain words", group: "Vela's own examples",
    applies: (f) => f.reply_text && f.proposed_single,
    decide: (f) => has(f.reply_text, /^\s*(y|yes|yep|ok|okay)\b/i) ? { move: "accept", say: `Confirmed. Reading it back: ${label(ms(f.proposed_single.at), f.proposed_single.tz)}.` } : null },
];

// The "accept everything" agent: the failure the rules exist to prevent.
export function naive() { return { move: "accept", say: "", rule: null }; }

// Decide with a set of enabled rule ids (default: all). The first applicable rule that returns a decision wins.
export function decide(facts, enabled = null) {
  for (const r of RULES) {
    if (enabled && !enabled.has(r.id)) continue;
    if (!r.applies(facts)) continue;
    const d = r.decide(facts);
    if (d) return { ...d, rule: r.id };
  }
  return { move: "accept", say: "No rule applied: do what was asked.", rule: null };
}

// A case passes when the move matches and every extra expectation holds.
export function judge(expect, got) {
  const say = (got.say || "").toLowerCase(), fails = [];
  if (expect.move !== got.move) fails.push(`move ${got.move}, expected ${expect.move}`);
  for (const s of expect.includes || []) if (!say.includes(String(s).toLowerCase())) fails.push(`says nothing like "${s}"`);
  for (const s of expect.excludes || []) if (say.includes(String(s).toLowerCase())) fails.push(`must not say "${s}"`);
  if (expect.tone && expect.tone !== got.tone) fails.push(`tone ${got.tone || "none"}, expected ${expect.tone}`);
  if (expect.options && expect.options !== got.options) fails.push(`${got.options || 0} options, expected ${expect.options}`);
  return { pass: fails.length === 0, fails };
}
