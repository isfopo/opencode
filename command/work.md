---
description: Implement a solution to a GitHub issue
agent: worker
---

Implement a solution for issue $ARGUMENTS in the current repository. Work through it methodically — understand the problem, plan the approach, implement, test, and ship it.

- [ ] Read the issue description, acceptance criteria, and any linked context
- [ ] Understand the existing codebase — find the relevant files, functions, and data flows
- [ ] Create a new branch from `develop` named for the issue (e.g., `fix/123-short-description` or `feat/123-short-description`)
- [ ] Plan the solution — outline the changes needed and the files that will be affected
- [ ] Implement the solution with clean, well-commented code
- [ ] Write tests that cover the new behavior, edge cases, and error paths
- [ ] Run the linter and fix any issues
- [ ] Run the type checker if applicable and resolve any errors
- [ ] Run the full test suite and ensure everything passes
- [ ] Review your own changes — read through the diff as if you were reviewing someone else's code
- [ ] Run a QA audit with @assurance subagent to catch anything you missed
- [ ] Create a pull request with a clear description linking back to the issue

PR description template:
```md
## What
[Short description of what this PR does]

## Why
Closes #[issue-number]

## How
- [Key change 1]
- [Key change 2]
- [Key change 3]

## Testing
- [How to test this change]
- [Edge cases covered]
```

If you discover problems that are out of scope for this issue:
1. Create a new GitHub issue describing the problem
2. Reference the new issue in a comment on the current issue
3. Don't scope-creep the current branch — stay focused on the original issue