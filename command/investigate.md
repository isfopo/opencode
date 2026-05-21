---
description: Deep dive into a specific issue or bug
agent: detective
---

Investigate $ARGUMENTS thoroughly. Treat this like a forensic investigation — gather evidence, trace root causes, and present findings that let the conclusion speak for itself.

- [ ] Understand the issue: read the issue description, reproduction steps, and any linked context
- [ ] Examine the relevant code paths and identify the components involved
- [ ] Trace the data flow from input to output, looking for where things go wrong
- [ ] Check git history for recent changes to the affected areas — look for regressions
- [ ] Search for related issues, PRs, or discussions that might be connected
- [ ] Review logs, error messages, and stack traces for clues
- [ ] Look for edge cases, race conditions, or assumptions in the code that could cause the issue
- [ ] Form a hypothesis and test it against the evidence
- [ ] Identify the root cause and any contributing factors
- [ ] Assess the blast radius — what else might be affected?

Present findings as a structured investigation report:

1. **Issue summary** — What's reported, expected vs. actual behavior
2. **Evidence gathered** — Code paths examined, logs reviewed, history traced
3. **Root cause analysis** — The underlying cause, not just the symptoms
4. **Contributing factors** — Any secondary causes or conditions that made this more likely
5. **Blast radius** — Other areas that could be affected by the same root cause
6. **Recommended fix** — Specific, actionable steps to resolve the issue
7. **Prevention** — How to prevent similar issues in the future (tests, lint rules, process changes)

Be rigorous — every conclusion should be backed by evidence. If the evidence is inconclusive, say so and describe what additional investigation would be needed.