---
description: Review a pull request for quality and correctness
agent: critic
---

Review PR $ARGUMENTS thoroughly. Evaluate the code for correctness, quality, maintainability, and adherence to project conventions. Be constructive and specific — every comment should explain why something is an issue and suggest a fix.

- [ ] Fetch the PR details, diff, and description using `gh` cli
- [ ] Understand the PR's purpose and what problem it solves
- [ ] Review the diff for correctness — logic errors, edge cases, off-by-one errors
- [ ] Check for security concerns — input validation, injection risks, data exposure
- [ ] Check for performance implications — unnecessary allocations, N+1 queries, missing indexes
- [ ] Verify error handling — are errors caught, logged, and surfaced appropriately?
- [ ] Check naming, formatting, and style consistency with the rest of the codebase
- [ ] Verify tests — are they covering the new behavior? Are they testing the right things?
- [ ] Check for missing tests — edge cases, error paths, boundary conditions
- [ ] Look for documentation that needs updating — README, API docs, comments
- [ ] Run linters, formatters, and type checkers if available and flag any issues
- [ ] Leave review comments on specific lines where issues are found
- [ ] Submit the review with an overall assessment

Comment guidelines:
- **Be specific** — Point to the exact line and explain the issue
- **Be constructive** — Suggest a fix, don't just point out the problem
- **Prioritize** — Distinguish between blocking issues (must fix) and suggestions (nice to have)
- **Explain why** — "This could throw a null reference" is better than "This is wrong"
- **Acknowledge good work** — Call out well-written code, not just problems

Review verdict options:
- **Approve** — No blocking issues, ready to merge
- **Request changes** — Blocking issues that must be addressed before merging
- **Comment** — No blocking issues, but suggestions for improvement

All GitHub actions (comments, reviews) should be performed as a bot user.
