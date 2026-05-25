---
description: Iteratively review and respond to a PR until all concerns are addressed
agent: worker
---

Run an iterative review-respond cycle on PR $ARGUMENTS. Alternate between reviewing the PR and addressing feedback until every concern — including minor ones — has been resolved. Escalate decisions that require human judgment.

## Loop Process

Repeat the following cycle until no new concerns are found:

### Phase 1: Review
- Use the @critic subagent to run a thorough review of the current PR state
- The critic should categorize every finding:
  - **Code fix** — Can be addressed directly in code (logic, style, tests, docs)
  - **Design decision** — Requires architectural or product-level judgment
  - **Process question** — About scope, timeline, or priorities
- Record all findings in a running list

### Phase 2: Triage
For each finding from the review:
- **Code fix** → Queue for the respond phase
- **Design decision** → **ESCALATE to the human** with context and recommended options
- **Process question** → **ESCALATE to the human** with context and recommended options

Wait for human responses on any escalated items before proceeding. Apply their decisions to the findings list.

### Phase 3: Respond
- Address all queued code fixes methodically
- Run type checking, linting, and tests after changes
- Commit with clear messages referencing the specific concerns addressed
- Push changes and reply to review comments

### Phase 4: Check Completion
- Use the @critic subagent to run another review pass on the updated PR
- If new concerns are found → return to Phase 2
- If no new concerns are found → the loop is complete

## Escalation Rules

Ask the human whenever a concern involves:
- **Architectural changes** — Restructuring modules, changing patterns, introducing new dependencies
- **Product decisions** — Feature scope, user-facing behavior, API design choices
- **Trade-off calls** — Performance vs. readability, completeness vs. speed, etc.
- **Ambiguous feedback** — When a review comment is unclear and interpretation matters
- **Scope questions** — Whether something belongs in this PR or a follow-up
- **Risk acceptance** — When the reviewer flags a risk that the team may need to consciously accept

When escalating, provide:
1. The specific concern or question
2. Why it requires human judgment
3. 2-3 concrete options with pros/cons
4. Your recommendation

## Termination Conditions

The loop ends when:
- A full review pass produces zero new findings, OR
- All remaining findings are explicitly accepted by the human as "won't fix" / "deferred"

## Final Summary

When the loop completes, produce a summary:
- Total iterations performed
- Concerns addressed (count by category: code fix, design decision, process)
- Concerns deferred (with human approval)
- Final PR status and readiness assessment

## Guardrails

- Maximum 10 iterations — if concerns persist beyond this, summarize the remaining issues and ask the human how to proceed
- Each iteration should be smaller than the last — if the same issues keep recurring, escalate
- Never silently dismiss a concern — every finding must be either fixed, explicitly deferred with approval, or escalated
- Out of scope concerns should be formed into new issues using `/issue`
