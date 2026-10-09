# REFERENCES: scheduling judgment test harness

Built 2026-10-08. Read-only web research (WebSearch, WebFetch). No account, login, payment, or send.

How to read this file:
- Every checklist item has a source URL and either a short verbatim quote (marked Q) or a plain paraphrase (marked P).
- Evidence tags: AUTH = standard, spec, regulation text, official docs, or arXiv paper. REF = Wikipedia (tertiary). SELF = Vela describing itself (marketing, not independent proof the behaviour works). BLOG = practitioner blog or vendor content marketing (single opinion). CMT = a Hacker News commenter.
- The MOVE category (accept / counter-propose / ask a question / escalate to a human / wait and follow up / decline) is my mapping from the cited rule. The source gives the rule; the source does not always name the move. Treat the move as a proposed answer key, not a quoted one.
- Quotes come back through the fetch tool, which summarises pages. They were not re-checked character by character. Run the repo's verify step on them before they appear on a public page.

## (a) Summary of what the sources show

Vela's own public material (YC page, two job posts, tryvela.ai, its Launch HN post and five case studies) names a consistent set of judgment behaviours: rank decides who flexes (a 7 AM call is fine from a CEO, not from a peer), a client outranks a coffee chat, loose phrases like "Friday evenings are free" must be understood, silent invitees get chased, one moved meeting cascades into others, replies arrive on a different channel than the thread started on, and C-suite recipients expect a formal three-option proposal while high-volume candidates reply by SMS in shorthand. Vela's founders say the hard part is not parsing but "applying the wrong interaction pattern for the wrong segment", and that the ask-versus-infer decision depends on the stakes. The time-zone sources (IANA, Python docs, RFC 5545, MDN, Wikipedia) support concrete traps: India has no daylight saving and sits at UTC+05:30, Nepal at UTC+05:45, US and EU clocks change on different dates, some local times do not exist or occur twice, abbreviations like IST and CST are ambiguous, and week start and weekend days differ by locale. Executive-assistant norms (buffers, offering at least two options, formal tone upward, a small number of follow-ups, escalate sensitive items with a summary) are supported only by practitioner blogs and vendor content; no professional-association or peer-reviewed source was reached, and HBR article bodies were paywalled. Failure-mode evidence is mostly first-person blogs and one vendor incident record (Ashby: 6.6 percent of interviews in a window conflicted with recurring events). Published evals (NATURAL PLAN, BenchAgents BA-Calendar, CalConflictBench, CalBench) test constraint satisfaction, preference learning, and privacy. None found tests social hierarchy, tone, follow-up restraint, or when to escalate, so those categories in this harness have no external benchmark to lean on.

## (b) CHECKLIST (45 scenarios)

### Group A: behaviours Vela itself names

**A01** A CEO asks the recruiter for a 7 AM call.
- Move: accept
- WHY: Rank decides who flexes. Q: "take a 7 AM call with a CEO, but not with a peer" (job post).
- Source: https://www.ycombinator.com/companies/vela/jobs/sv62rsO-ai-operations-associate (SELF)

**A02** A colleague (peer) asks the same recruiter for a 7 AM call.
- Move: counter-propose (normal working hours)
- WHY: Same rule, other side of it. Q: "but not with their colleague".
- Source: https://www.ycombinator.com/companies/vela/jobs/qoFg7EJ-founding-engineer-vela-solving-scheduling-india (SELF)

**A03** A client and a coffee chat both want the same slot.
- Move: accept the client; counter-propose the coffee chat
- WHY: Q: "prioritize a client over a coffee chat without you setting specific rules".
- Source: https://www.ycombinator.com/companies/vela (SELF)

**A04** Principal says "Friday evenings are free."
- Move: accept (offer Friday evening times)
- WHY: Vela says it "understands exactly what that means". The page does not define the hours of "evening", so edge times (for example 9 PM) are UNSOURCED; see section (c).
- Source: https://www.ycombinator.com/companies/vela (SELF)

**A05** An invitee has not replied to a time proposal.
- Move: wait and follow up
- WHY: Q: "chases the people who don't reply". Cadence is UNSOURCED for Vela; see E05 and E06.
- Source: https://www.ycombinator.com/companies/vela (SELF)

**A06** One party moves one call, and shared interviewers now clash with other pending proposals.
- Move: counter-propose (re-propose to everyone affected, update invites, notify)
- WHY: Q: "A client reschedules one interview and it cascades into four others." P: founder reply says they track pending holds, rank by urgency, and re-propose when a confirmation on one thread invalidates a proposal on another.
- Source: https://news.ycombinator.com/item?id=47264741 (text read via https://hacker-news.firebaseio.com/v0/item/47264741.json) and the reply at https://hacker-news.firebaseio.com/v0/item/47267288.json (SELF)

**A07** An invitee answers by SMS a thread that began on email.
- Move: accept (treat it as the same conversation)
- WHY: Q: "A candidate responds on SMS to a thread that started on email."
- Source: https://hacker-news.firebaseio.com/v0/item/47264741.json (SELF)

**A08** The SMS reply comes from a shared device, or from a nickname that matches no contact.
- Move: ask a question (confirm who is writing)
- WHY: Q: "shared devices mean the responder might not be who you reached out to".
- Source: https://hacker-news.firebaseio.com/v0/item/47264741.json (SELF)

**A09** The recipient is a C-suite executive replying by email.
- Move: counter-propose (one formal message, three options)
- WHY: Q: "expect formal 3-option proposals".
- Source: https://hacker-news.firebaseio.com/v0/item/47264741.json (SELF)

**A10** A high-volume candidate on a shared phone answers a single proposed time with shorthand such as "y tm wrks."
- Move: accept (and read the time back in plain words)
- WHY: Q: "applying the wrong interaction pattern for the wrong segment". Sending this person a formal three-option email is the named failure. My reading of "y tm wrks" as yes is an inference.
- Source: https://hacker-news.firebaseio.com/v0/item/47264741.json (SELF)

**A11** Someone writes "next Friday."
- Move: ask a question (or restate the resolved date and wait for a yes)
- WHY: Q: "'next Friday' means different things on Monday versus Thursday". P: the founders say asking versus inferring depends on the stakes of getting it wrong.
- Source: https://hacker-news.firebaseio.com/v0/item/47264741.json (SELF)

**A12** An investor (LP) conversation request arrives for a partner.
- Move: escalate to a human
- WHY: Q: "An LP conversation gets booked personally". The customer says the agent does not book these itself.
- Source: https://tryvela.ai/case-studies/firstlook-partners (SELF, customer story hosted by Vela)

**A13** Calendar shows free at 2:30 PM, but the principal's flight lands at 2 PM.
- Move: counter-propose (a later slot)
- WHY: Q: "A flight lands at 2 PM, but that doesn't mean a 2:30 call works". Also names the failure: tools "would book over flights, ignore travel days".
- Source: https://tryvela.ai/case-studies/firstlook-partners (SELF)

**A14** A request would put the client and the candidate on one email thread or one visible invite.
- Move: decline (keep separate threads, hide parties on the invite)
- WHY: Q: "The client and candidate can never be on the same email thread". P: another customer required double-blind invites keeping candidate and interviewer details apart.
- Source: https://tryvela.ai/case-studies/paragon-legal and https://tryvela.ai/case-studies/scaling-interview-ops (SELF)

### Group B: time zones, calendars, language

**B01** A call is proposed for 10:00 AM India time with a participant in Kathmandu.
- Move: counter-propose (state both local times; 10:00 India is 10:15 Nepal)
- WHY: Q: "UTC+05:45" (Nepal), Q: "one of only three time zones with a 45-minute offset from UTC". India is "UTC+05:30". The 15-minute gap is my arithmetic; I confirmed Asia/Kolkata +05:30 and Asia/Kathmandu +05:45 with Python zoneinfo on this machine.
- Source: https://en.wikipedia.org/wiki/Time_in_Nepal and https://en.wikipedia.org/wiki/Indian_Standard_Time (REF)

**B02** A weekly call between New York and Mumbai was set in spring and the series now spans a clock change.
- Move: ask a question (which side's local time the series stays pinned to)
- WHY: Q: "DST is not observed in this time zone." (India). US DST runs "Second Sunday in March at 02:00" to "First Sunday in November at 02:00". The offset between the two cities changes by one hour twice a year unless one side is pinned.
- Source: https://en.wikipedia.org/wiki/Indian_Standard_Time and https://en.wikipedia.org/wiki/Daylight_saving_time_by_country (REF)

**B03** A New York and Paris call is requested for a date between the US and EU clock changes.
- Move: counter-propose (restate with explicit offsets, recomputed)
- WHY: EU rule Q: "Last Sunday in March at 01:00 UTC". Paris is "usually six hours ahead of New York City" except "a few weeks" (Wikipedia DST article). I computed 2026 dates: US starts 8 Mar, EU starts 29 Mar, EU ends 25 Oct, US ends 1 Nov. Python check: 15 Mar 2026 12:00 New York = 17:00 Paris (5 hours); 15 Apr = 18:00 Paris (6 hours).
- Source: https://en.wikipedia.org/wiki/Daylight_saving_time_by_country and https://en.wikipedia.org/wiki/Daylight_saving_time (REF)

**B04** Someone asks for a local time that does not exist (for example 2:30 AM on a spring-forward day) or occurs twice (fall-back hour).
- Move: counter-propose (pick a valid time, state the UTC offset)
- WHY: Python docs, Q: "the offset from before the transition is used when fold=0". RFC 5545, Q: "the UTC offset before the gap" for a nonexistent time; for a repeated time it "refers to the first occurrence". Same RFC: a fixed time must be given in UTC or local time plus zone.
- Source: https://docs.python.org/3/library/zoneinfo.html and https://datatracker.ietf.org/doc/html/rfc5545 (AUTH)

**B05** A West Coast client asks for "9 PM tonight" with a candidate in India.
- Move: counter-propose (restate with the date in both zones)
- WHY: The calendar date differs. Checked in Python: 9:00 PM Wed 7 Oct 2026 in Los Angeles (UTC-07:00, per the Python docs offsets) is 9:30 AM Thu 8 Oct in India. A real customer account of after-hours scramble across coasts: P: Paragon Legal staff tracked time zones with sticky notes; Q: "a West Coast client emailed at 6 PM Pacific".
- Source: https://docs.python.org/3/library/zoneinfo.html and https://tryvela.ai/case-studies/paragon-legal (AUTH for offsets, SELF for the story)

**B06** An invitee's time zone cannot be detected and the invite shows UTC.
- Move: ask a question (confirm their city or zone)
- WHY: Calendly's own troubleshooting guide, Q: "Does your email provider show times in UTC or default to UTC?" P: when detection fails or conflicts, the time defaults to UTC, common with Hotmail, Yahoo, AOL users. P: calendar invites follow the receiving calendar's zone, email confirmations follow the booking page's zone.
- Source: https://community.calendly.com/how-do-i-40/time-zone-troubleshooting-guide-242 (BLOG, vendor help forum)

**B07** A message says "3 PM IST" or "9 AM CST."
- Move: ask a question (or restate with a city and a UTC offset)
- WHY: Q: "Such designations can be ambiguous". IST is Indian UTC+05:30, Irish UTC+01:00 or Israel UTC+02:00. CST is China UTC+08:00 or North American UTC-06:00 or Cuba UTC-05:00. China versus US Central is a 14-hour gap.
- Source: https://en.wikipedia.org/wiki/List_of_time_zone_abbreviations (REF)

**B08** A deadline says "by end of day" with people in two time zones.
- Move: ask a question (or state an explicit time and zone)
- WHY: WEAK SOURCE. P: search-result summaries of business glossaries say EOD usually means about 5 PM and usually the deadline-setter's zone, but varies, and the safe advice is to state time and zone. I did not open those pages (the Pipedrive page returned no relevant text). Use as a low-weight item.
- Source: https://www.clay.com/glossary/end-of-day (NOT OPENED, search snippet only)

**B09** "This week" or "Friday" is used with a participant whose locale starts the week on Sunday, or whose weekend is Friday and Saturday.
- Move: ask a question (or restate with explicit dates; offer Sunday to Thursday slots where the weekend differs)
- WHY: MDN getWeekInfo, Q: "Commonly 1, 5, 6, or 7" for firstDay. Docs example: Hebrew locale has firstDay 7 and weekend [5, 6] (Friday and Saturday); en-GB has firstDay 1 and weekend [6, 7]; ar-AF has weekend [4, 5]. Whether a given person's workplace follows the locale default is UNSOURCED. CSMonitor adds that "next" can mean from today or from the whole current week.
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getWeekInfo and https://www.csmonitor.com/The-Culture/In-a-Word/2022/0404/Schedulers-stumble-over-what-next-week-means (AUTH, BLOG)

**B10** A meeting is requested near a lunar-calendar holiday (Eid, Diwali).
- Move: wait and follow up (re-confirm the date nearer the time, or ask whether the person observes it)
- WHY: Islamic calendar, Q: "The beginning of each month differs from one Muslim country to another". P: months move about eleven days earlier each Gregorian year and the exact day depends on moon sighting. Hindu calendar: P (summariser paraphrase, weak): festival dates shift against the Gregorian calendar because of a lunar month plus an inserted extra month every 32 to 33 months. Exact 2026 holiday dates are UNSOURCED here.
- Source: https://en.wikipedia.org/wiki/Islamic_calendar and https://en.wikipedia.org/wiki/Hindu_calendar (REF)

### Group C: executive-assistant norms

**C01** A request would put a call directly against another call.
- Move: counter-propose (a slot that leaves a buffer)
- WHY: Q: "30-minute buffers surrounding all calls, and 1 hour with in-person meetings". P: place buffers when first scheduling, not the day of. (Andy Mowat, Prialto, updated 2012.)
- Source: https://www.prialto.com/blog/buffer-your-schedule (BLOG)

**C02** Someone asks to move an existing meeting to a better time for them.
- Move: decline (with a reason, unless the requester gives one)
- WHY: Q: "Default to 'no, with a reason,' not 'yes, with a calendar tetris move'". A search snippet of the same article says the default reply is to ask what is changing; that wording was not in the fetched text. See section (c).
- Source: https://theaicareerlab.com/blog/ea-calendar-defense-playbook/raw (BLOG, vendor, Alex Lowe, 2026-05-12)

**C03** The agent must decline or counter a request.
- Move: counter-propose (give at least two alternatives, one soon)
- WHY: Q: "at least two alternative slots" (one ideally within 48 hours, per the same page). Separately, Q: "personally offer a few times that work for me" (Casnocha). No independent research on the best number of options was found.
- Source: https://www.workclaw.com/blog/negotiation-etiquette-expert-scripts-timing-rules-2025 and https://casnocha.com/2018/05/having-schedule-meetings.html (BLOG)

**C04** The same time request goes to a senior leader and to a peer.
- Move: counter-propose (tone changes with rank)
- WHY: Senior leaders, Q: "formal, concise, deferential; prioritize clarity and options without insisting". Peers, Q: "collaborative, direct". Sample routine wording from an EA course: Q: "I'm happy to confirm the new meeting time".
- Source: https://www.workclaw.com/blog/negotiation-etiquette-expert-scripts-timing-rules-2025 and https://codesignal.com/learn/courses/representing-the-executive-through-client-communication/lessons/protecting-executive-time (BLOG)

**C05** The first proposal got no reply for several days.
- Move: wait and follow up (first follow-up after about 3 to 5 business days)
- WHY: Q: "three to five business days" as a default spacing; P: second follow-up 5 to 7 days later; tone, Q: "Do not open with an apology". Generic professional-email advice, not scheduling-specific; see section (c).
- Source: https://www.fyxer.com/blog/follow-up-email-after-no-response (BLOG, vendor)

**C06** The invitee has ignored the proposal and two follow-ups.
- Move: escalate to a human (the principal or coordinator decides)
- WHY: Q: "Two follow-ups after the initial email is a sensible limit". The source says stop; routing to a human is my inference, backed by Q: "High-priority or sensitive issues should be escalated" (CodeSignal).
- Source: https://www.fyxer.com/blog/follow-up-email-after-no-response and https://codesignal.com/learn/courses/representing-the-executive-through-client-communication/lessons/protecting-executive-time (BLOG)

**C07** A routine reschedule arrives, versus a request that touches something sensitive (for example moving a legal or board meeting).
- Move: accept the routine one; escalate to a human for the sensitive one (with a summary and a recommended next step)
- WHY: Q: "Routine requests like rescheduling a meeting or confirming details are usually safe". Q: "Summarize the issue and recommend next steps".
- Source: https://codesignal.com/learn/courses/representing-the-executive-through-client-communication/lessons/protecting-executive-time (BLOG)

### Group D: published failure modes of AI schedulers

**D01** The agent books a 4 PM Central event, but reading the event back shows 11:00 AM.
- Move: escalate to a human (and never report success without a read-back)
- WHY: Q: "newly created event sitting stubbornly at 11:00 AM CT". P: the tool silently ignored the timezone parameter. The same post reports the agent invented a confirmation: Q: "I even generated a fake 26-character alphanumeric Event ID". Single first-person account, 2026-03-10.
- Source: https://blog.lhotka.net/2026/03/10/An-Agentic-Tale (BLOG)

**D02** A slot looks free but a recurring event already occupies it.
- Move: decline (that slot; offer a clean one)
- WHY: Ashby incident record, Q: "book over a subset of recurring calendar events". P: about 6.6 percent of interviews scheduled in the window (9 to 14 January 2025) conflicted with existing recurring events.
- Source: https://status.ashbyhq.com/incidents/g1y2rmzkfg9p (AUTH for the incident, vendor-written)

**D03** Principal says "follow up with Sam," and two people or two threads fit.
- Move: ask a question (confirm the person and the thread)
- WHY: Q: "replied on the wrong thread". Named cause: ambiguous instruction, such as a follow-up request that does not name the contact.
- Source: https://www.usecarly.com/blog/how-to-correct-ai-assistant-mistakes/ (BLOG, vendor)

**D04** Principal says "sometime next week."
- Move: ask a question (or read back absolute dates before booking)
- WHY: Q: "booked next month instead of next week". Named cause: plain model error on dates, fixed by approval checkpoints while learning.
- Source: https://www.usecarly.com/blog/how-to-correct-ai-assistant-mistakes/ (BLOG, vendor)

**D05** The invitee already confirmed (by phone, or on another channel) but a chase message is queued.
- Move: wait and follow up (re-check state first; do not send the chase)
- WHY: Closest sourced analogue: Q: "sent a polite reminder to a client who paid on Friday". Cause: stale tool connection. Cross-channel state is also the founders' stated core challenge (A07).
- Source: https://www.usecarly.com/blog/how-to-correct-ai-assistant-mistakes/ (BLOG, vendor)

**D06** A reply that looks like a routine confirmation also mentions cancelling an investor meeting or a legal matter.
- Move: escalate to a human
- WHY: One of four named failure modes, Q: "Auto-replies that handle the easy cases and miss the consequential ones".
- Source: https://theaicareerlab.com/blog/why-ai-email-assistants-fail-for-executive-assistants/raw (BLOG, vendor, 2026-05-12)

**D07** The counterpart's agent asks why the principal cannot do Tuesday.
- Move: decline (to give the reason; say only that the time is unavailable)
- WHY: P: CalBench found agents revealed private context while negotiating; examples named include Q: "bankruptcy filing preparation". The paper frames this as a protocol problem, not only a prompt problem. Seen through a third-party summary, not the arXiv page.
- Source: https://www.emergentmind.com/papers/2605.09823 (AUTH paper, secondary summary)

**D08** The agent wants to chase a candidate on WhatsApp, but the candidate last wrote more than 24 hours ago.
- Move: wait and follow up (use an approved template, or switch channel)
- WHY: Q: "you may only send a message using an approved template" outside the 24-hour window.
- Source: https://www.twilio.com/docs/whatsapp/key-concepts (AUTH, Twilio documentation of WhatsApp rules)

**D09** An unsolicited chase would go out at 10:30 PM recipient time.
- Move: wait and follow up (send next local morning)
- WHY: US rule text, Q: "before the hour of 8 a.m. or after 9 p.m." local time at the called party's location. CONTESTED: the rule covers "telephone solicitation", and whether scheduling coordination counts is not settled by this source. Treat as a conservative norm, not a legal claim. Replying to a message the person just sent is a different case (Vela says it answers "at any hour").
- Source: https://www.law.cornell.edu/cfr/text/47/64.1200 (AUTH)

### Group E: constraints and evals from published benchmarks

**E01** Request violates a buffer, weekend, time-of-day, or blackout rule.
- Move: decline (that slot) then counter-propose a compliant one
- WHY: BenchAgents BA-Calendar constraint set includes meeting duration, buffer before and after (none, 5, 10, 15, 30 minutes), no weekends, no meetings before or after set hours, and no meetings during specific times. Scored by "pass all accuracy" and "fraction passed". P: reasoning models beat non-reasoning ones, and all models struggled with negation constraints.
- Source: https://arxiv.org/abs/2410.22584 (AUTH)

**E02** A meeting is flagged high priority.
- Move: accept (take the first available slot)
- WHY: Q: "High priority meeting (must be scheduled in first available slot)" is one BA-Calendar constraint.
- Source: https://arxiv.org/pdf/2410.22584 (AUTH)

**E03** No time works for everyone under the stated constraints.
- Move: ask a question (which constraint can be relaxed)
- WHY: BA-Calendar scores whether a model correctly says there is no solution. Q: "no solution is available". P: models answered this more often on infeasible instances. Asking which rule to relax is my mapping.
- Source: https://arxiv.org/pdf/2410.22584 (AUTH)

**E04** The principal declined Friday-afternoon slots in three earlier conflicts.
- Move: counter-propose (avoid Friday afternoons without being told again)
- WHY: CalConflictBench tests learning preferences from round-by-round feedback. Q: "Current LLMs do not exhibit Preference-Evolving capability". Metrics: Decision Accuracy, Optimal Rank Distance, Error Reduction Rate.
- Source: https://arxiv.org/html/2601.11957v1 (AUTH, arXiv preprint)

**E05** Baseline: two people, 9:00 to 17:00 Monday, half an hour needed, one person busy 9:00 to 9:30, 10:30 to 12:00, and later blocks.
- Move: accept (Monday 9:30 to 10:00)
- WHY: NATURAL PLAN's calendar example gives this answer: Q: "Monday, 9:30 - 10:00". Best model solve rate for calendar scheduling in that paper was 48.9 percent (Gemini 1.5 Pro), so even plain slot-finding is a real test.
- Source: https://arxiv.org/abs/2406.04520 (AUTH)

## (c) UNSOURCED or contested

UNSOURCED (do not rely on these):
- Tone for a CHRO. No Vela page says anything about a CHRO. Closest proxies are C04 (formal, deferential to senior leaders) and A09 (formal three options for C-suite). A CHRO case in the harness is my extrapolation.
- Meetings that cross midnight inside one zone (for example 11:30 PM to 12:30 AM). Nothing sourced about end-date rollover. B05 covers only the date difference between zones.
- "Early next week." I found no authoritative definition. A search summary of an unnamed page said it usually means Monday and Tuesday, sometimes Wednesday; I did not open it. A search snippet also said Vela handles this phrase, but the fetched Vela pages did not show it. Treat as UNVERIFIED; use CSMonitor (B09) for the general "next" ambiguity.
- A numeric best count of options to offer. Vela says it studies "how many options to propose before you hit decision paralysis" but publishes no number. Sources give three for C-suite (Vela) and at least two (a vendor blog).
- Follow-up cadence for scheduling specifically. C05 and C06 come from generic email follow-up advice by a vendor. Vela's own follow-up timing is unpublished.
- Definition of "evening" in "Friday evenings are free" (A04).
- India specifics: SMS or call quiet hours, the Indian weekend convention, public-holiday calendars. Not searched to a source.
- Exact 2026 dates for Eid and Diwali (B10).
- A persona-style check for mistakes by CHRO, investor, or recruiter titles. No source.

Contested or weak:
- C02: the fetched text says default to "no, with a reason"; a search snippet of the same article says the default reply is to ask "what's changing". I chose decline. Either could be argued.
- D09: TCPA text covers telephone solicitation; applying it to scheduling messages is not established by the source. Not legal advice.
- Evidence weight overall: groups C and D rest on blogs and vendor marketing (several by vendors selling AI assistants). Group A is Vela describing itself. Only groups B and E lean on specs, docs, and papers.
- HBR: only the 2018 tip on remote-team time-zone fairness was opened; its two points (rotate call times; translate times into every zone the team works in) support rotation, but I left it out of the 45 items to keep the list at the cap. The body text of five other HBR pages was paywalled or not returned. A search snippet claims one HBR piece cites a rule of no team meetings between 10 pm and 7 am; UNVERIFIED, not used.
- Search snippets only, not opened: TowardsAI article about a scheduling agent that ignored maintenance tags (page returned 403); a story of a slot that existed in none of Dublin, Berlin, Tokyo (origin not identified); a Hacker News comment that x.ai sent people to the wrong places (a commenter claim seen via a mirror, unverified); a claim that Vela prioritises an investor over an internal sync (search snippet).
- Wikipedia is tertiary, and the fetch tool summarised it. The timeanddate.com pages returned 403, so DST rules rest on Wikipedia, not timeanddate. The IANA page was fetched but it only describes the database; it does not list transitions. The Unicode CLDR translation page I fetched said nothing about week start, so MDN was used instead.
- No professional EA association (for example IAAP) page was reached. No peer-reviewed study on assistant scheduling norms was found.
- No published eval found that scores social hierarchy, tone, follow-up restraint, or ask-versus-infer decisions. That is a gap in the literature I could reach, not proof none exists.

## (d) Sources fetched, 2026-10-08

Opened and used:
1. https://www.ycombinator.com/companies/vela (SELF)
2. https://www.ycombinator.com/companies/vela/jobs/qoFg7EJ-founding-engineer-vela-solving-scheduling-india (SELF)
3. https://www.ycombinator.com/companies/vela/jobs/sv62rsO-ai-operations-associate (SELF)
4. https://tryvela.ai (SELF; fetched, quotes not used in the final list except as background)
5. https://www.ycombinator.com/companies/vela/jobs (job index, SELF)
6. https://hacker-news.firebaseio.com/v0/item/47264741.json (Launch HN post text, SELF) and canonical page https://news.ycombinator.com/item?id=47264741 (direct fetch failed)
7. https://hacker-news.firebaseio.com/v0/item/47267288.json (founder reply), plus commenter items 47264905, 47265717, 47267776, 47274579, 47265309, 47267424, 47265006, 47266462, 47266650, 47266915, 47265313 (CMT; read, not used in the list apart from background)
8. https://tryvela.ai/case-studies/ (index) and /paragon-legal, /firstlook-partners, /riviera-partners, /executive-coaching, /scaling-interview-ops (SELF)
9. https://en.wikipedia.org/wiki/Time_in_Nepal
10. https://en.wikipedia.org/wiki/Indian_Standard_Time
11. https://en.wikipedia.org/wiki/Daylight_saving_time_by_country
12. https://en.wikipedia.org/wiki/Daylight_saving_time
13. https://en.wikipedia.org/wiki/Time_zone
14. https://en.wikipedia.org/wiki/List_of_time_zone_abbreviations
15. https://en.wikipedia.org/wiki/Hindu_calendar
16. https://en.wikipedia.org/wiki/Islamic_calendar
17. https://docs.python.org/3/library/zoneinfo.html
18. https://datatracker.ietf.org/doc/html/rfc5545
19. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getWeekInfo
20. https://www.iana.org/time-zones
21. https://cldr.unicode.org/translation/date-time/date-time-patterns (nothing usable on week start)
22. https://infiniteundo.com/post/25326999628/falsehoods-programmers-believe-about-time (background)
23. https://www.csmonitor.com/The-Culture/In-a-Word/2022/0404/Schedulers-stumble-over-what-next-week-means (Melissa Mohr, 2022-04-04)
24. https://community.calendly.com/how-do-i-40/time-zone-troubleshooting-guide-242
25. https://www.prialto.com/blog/buffer-your-schedule
26. https://www.goodreads.com/author_blog_posts/10761986-12-best-practices-of-elite-executive-assistants (Victor Prince mirror; used as background only)
27. https://casnocha.com/2018/05/having-schedule-meetings.html (Ben Casnocha, 2018-05-16)
28. https://codesignal.com/learn/courses/representing-the-executive-through-client-communication/lessons/protecting-executive-time
29. https://theaicareerlab.com/blog/ea-calendar-defense-playbook/raw and https://theaicareerlab.com/blog/why-ai-email-assistants-fail-for-executive-assistants/raw (Alex Lowe, 2026-05-12)
30. https://www.fyxer.com/blog/follow-up-email-after-no-response
31. https://www.workclaw.com/blog/negotiation-etiquette-expert-scripts-timing-rules-2025
32. https://hbr.org/tip/2018/08/does-your-teams-work-style-inconvenience-remote-employees
33. https://www.twilio.com/docs/whatsapp/key-concepts
34. https://www.law.cornell.edu/cfr/text/47/64.1200
35. https://blog.lhotka.net/2026/03/10/An-Agentic-Tale
36. https://status.ashbyhq.com/incidents/g1y2rmzkfg9p
37. https://www.usecarly.com/blog/how-to-correct-ai-assistant-mistakes/
38. https://arxiv.org/abs/2406.04520 and PDF https://arxiv.org/pdf/2406.04520 (NATURAL PLAN, text extracted locally with pdftotext)
39. https://arxiv.org/abs/2410.22584 and PDF https://arxiv.org/pdf/2410.22584 (BenchAgents, text extracted locally)
40. https://arxiv.org/html/2601.11957v1 (CalConflictBench / PEARL)
41. https://www.emergentmind.com/papers/2605.09823 (CalBench, secondary summary)

Failed or empty (do not cite):
- https://www.timeanddate.com/time/change/usa, /time/dst/2026.html, /time/change/india, /time/zones/ist: HTTP 403.
- https://pub.towardsai.net/how-an-llm-scheduling-agent-ignored-metadata-and-ruined-executive-reviews-19eb62048781: HTTP 403 (search snippet only).
- https://www.askamanager.org/?p=36297: HTTP 403.
- https://news.ycombinator.com/item?id=47264741 directly: failed; https://hn.svelte.dev/item/47264741: connection refused. https://hn.nuxt.dev/item/47264741 returned a summary (used only for the x.ai commenter claim, unverified).
- https://community.lindy.ai/...: host not found.
- https://www.pipedrive.com/en/blog/what-is-cob: page content did not contain the topic.
- HBR bodies (paywalled or not returned): hbr.org/2014/06/managing-a-team-across-5-time-zones, /2014/12/what-executive-assistants-know-about-managing-up, /2011/05/the-case-for-executive-assistants, /2018/09/you-have-to-stop-canceling-and-rescheduling-things-really, /2011/03/scheduling-a-meeting-the-right.

Searches run (WebSearch, standard mode, 2026-10-08): EA buffers and options; HBR EA calendar; AI scheduling assistant failures; calendar scheduling agent benchmarks; follow-up counts before escalating; wrong-thread and over-eager follow-up complaints; EOD ambiguity; "early next week" ambiguity; CEO versus peer etiquette; HBR time-zone fairness (hbr.org only); HBR EA gatekeeper (hbr.org only); HBR rescheduling (hbr.org only); WhatsApp 24-hour window; TCPA quiet hours; Calendly time zones; Vela launch coverage.
