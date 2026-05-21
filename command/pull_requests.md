---
description: List and review open pull requests
agent: worker
---

Show me all open pull requests for this project with enough detail to understand the current state of review and what needs attention.

- [ ] Fetch all open pull requests from the remote repository
- [ ] For each PR, gather: title, number, author, branch, date created, review status, and CI status
- [ ] Check which PRs have conflicts with their base branch
- [ ] Check which PRs are waiting on reviews and from whom
- [ ] Check which PRs have failing CI checks
- [ ] Identify stale PRs that haven't been updated recently

Present pull requests in a structured format:

```md
## Ready to Merge
- **#123**: [Title] — @author → base ← head — ✅ approved — ✅ CI passing — [date]

## Awaiting Review
- **#124**: [Title] — @author → base ← head — ⏳ 0/2 reviews — ✅ CI passing — [date]
- **#125**: [Title] — @author → base ← head — ⏳ 1/2 reviews — ❌ CI failing — [date]

## Needs Attention
- **#126**: [Title] — @author → base ← head — ⚠️ merge conflicts — ❌ CI failing — [date]

## Stale
- **#127**: [Title] — @author → base ← head — last updated 30+ days ago
```

After listing, provide:
1. **Summary** — Total PRs open, grouped by status
2. **Action items** — What needs to happen next for each PR that's blocked
3. **Priority picks** — Which PRs should be reviewed or merged first

If $ARGUMENTS is provided, filter to PRs matching that branch name, author, or keyword.