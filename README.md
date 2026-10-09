# Scheduling judgment, tested

A small, honest proof of how I would evaluate a scheduling agent. It is not an AI agent and it does not solve scheduling.

- `cases.json`: 41 cases built from Vela's public examples and from published sources (`REFERENCES.md` lists them). Each has the situation as structured facts, the right move, my reason, and the source.
- `policy.js`: a hand-written rules baseline the cases are written against. To test a real agent, replace `decide()` and keep the cases.
- `check.mjs`: runs every case, runs an agent that accepts everything (it must not pass them all), then switches each rule off in turn: a rule no case notices is untested and fails the check.
- `verify_quotes.mjs`: re-fetches each cited page and confirms the quotes. The page shows a quote only if this found it.
- `index.html`: the page. Static, no build step other than `python build.py` (inlines the logo).

```
node check.mjs
node verify_quotes.mjs
```

Assumptions the page states plainly: a 9 to 6 working day, a 3 business day gap before a first chase, a 90 minute travel buffer, a 30 minute buffer between calls. The answer key is my reading of each rule; where a source gives the rule but not the move, the move is mine. No published benchmark covers tone, hierarchy or escalation judgment.
