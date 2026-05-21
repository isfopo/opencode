---
description: List and prioritize open issues
agent: manager
---

Show me all open issues for this project, organized by priority so I can see what needs attention first.

- [ ] Sync with the remote repository to get the latest issues
- [ ] Fetch all open issues with their labels, assignees, and dates
- [ ] Categorize issues by type (bug, feature, enhancement, task, etc.)
- [ ] Assess priority based on labels, age, and any linked dependencies
- [ ] Identify blocked issues and what they're blocked by
- [ ] Identify the next most urgent unblocked piece of work

Present issues in a structured format:

```md
## 🔴 Critical / High Priority
- **#123**: [Issue title] — [status] — [assignee] — [date]
- **#124**: [Issue title] — [status] — [assignee] — [date]

## 🟡 Medium Priority
- **#125**: [Issue title] — [status] — [assignee] — [date]

## 🟢 Low Priority / Backlog
- **#126**: [Issue title] — [status] — [assignee] — [date]

## ⛔ Blocked
- **#127**: [Issue title] — blocked by #123 — [assignee] — [date]
```

After listing, provide:
1. **Total count** — How many issues are open, grouped by category
2. **Next action** — The single most urgent unblocked issue to pick up next
3. **Stale issues** — Any issues that haven't been updated in 30+ days that might need closing

If $ARGUMENTS is provided, filter or focus on issues matching that label, assignee, or keyword.