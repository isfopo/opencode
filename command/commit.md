---
description: Commit and push current work with a well-crafted commit message
agent: committer
---

Commit the current work and push it to the remote repository.

- [ ] Check the working tree with `git status` and `git diff` to see all changes
- [ ] Review the changes and group them logically — if there are multiple unrelated changes, stage them separately for separate atomic commits
- [ ] Determine the correct conventional commit type (feat, fix, docs, style, refactor, test, chore, perf, ci) based on the nature of the changes
- [ ] Write a commit message that explains WHY the change was made, not just WHAT changed — the diff already shows what changed
- [ ] Stage the appropriate files and create the commit
- [ ] Push to the remote branch

Commit message rules:
- Subject line: 50 characters or less, imperative mood ("add" not "added")
- Use conventional commit prefixes: feat, fix, docs, style, refactor, test, chore, perf, ci
- Body (optional): wrap at 72 characters, explain the motivation for the change
- Reference issues with `Closes #123` or `Refs #123` when applicable
- Each commit should represent one logical change — don't mix unrelated changes

If $ARGUMENTS is provided, use it as the commit message or as context for what the commit should focus on.