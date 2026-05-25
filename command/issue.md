---
description: Create a new GitHub issue with a well-structured description
agent: manager
---

Create a new GitHub issue for this project.

- [ ] Determine the issue type from $ARGUMENTS or ask the user: bug, feature, enhancement, task, epic, or docs
- [ ] Craft a clear, descriptive title using conventional prefixes: `[Bug]:`, `[Feature]:`, `[Enhancement]:`, `[Task]:`, `[Epic]:`, `[Docs]:`
- [ ] Write a structured issue body with the appropriate template below
- [ ] Assign relevant labels based on the issue type and content
- [ ] Create the issue on GitHub using `gh issue create`
- [ ] Print the issue URL for reference

### Bug Template
```md
### Description
[Clear, concise description of the bug]

### Steps to reproduce
1. [First step]
2. [Second step]
3. [Observed behavior]

### Expected behavior
[What should happen]

### Environment
- OS: [macOS/Windows/Linux]
- Node/Browser version: [version]
- Relevant package versions: [versions]

### Additional context
[Screenshots, logs, or related issue links]
```

### Feature Template
```md
### Description
[What feature is needed and why]

### User story
As a [user type], I want [goal] so that [benefit]

### Acceptance criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### Suggested approach
[High-level implementation ideas, if known]

### Additional context
[Links, mockups, or related discussions]
```

### Task Template
```md
### Description
[What needs to be done]

### Acceptance criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

### Technical notes
[Implementation details, files to touch, dependencies]

### Depends on
[#issue-number or "none"]
```

### Epic Template
```md
### Goal
[What this epic achieves]

### Scope
- [Feature/task 1]
- [Feature/task 2]
- [Feature/task 3]

### Success criteria
[How we know this epic is complete]

### Tasks
- [ ] #123 — [Task description]
- [ ] #124 — [Task description]
```

If $ARGUMENTS is provided, use it as the issue description or context. If it includes a type prefix (e.g., "bug: login fails on Safari"), parse the type automatically.
