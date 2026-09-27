---
description: Commit and push current work with a well-crafted commit message
agent: conductor
---

Commit the current work and push it to the remote repository.

Workflow:
- First classify the change as **small** or **material**.
- For a small change (one logical, reversible change with no API, schema, dependency, auth, permission, migration, deployment, or destructive impact):
  1. Run one compact inspection: `git status --short --branch`, `git diff --stat`, and `git diff --check`.
  2. Review the relevant diff, choose the commit type, stage only the intended files, and commit.
  3. Run the narrowest relevant verification, then push.
- For a material change or unclear diff, use the full checklist below, including logical grouping, broader verification, and any required human checkpoint or review.

Small changes must not trigger specialist delegation, an elaborate todo plan, or redundant full-repository checks.

Full checklist:
- [ ] Check the working tree with `git status` and `git diff` to see all changes
- [ ] Review the changes and group them logically — if there are multiple unrelated changes, stage them separately for separate atomic commits
- [ ] Determine the correct conventional commit type (feat, fix, docs, style, refactor, test, chore, perf, ci) based on the nature of the changes
- [ ] Write a commit message that explains WHY the change was made, not just WHAT changed — the diff already shows what changed
- [ ] Stage only the appropriate files and create atomic commit(s)

Commit message rules:
- Subject line: 30 characters or less, imperative style ("add" not "added")
- Use conventional commit prefixes: feat, fix, docs, style, refactor, test, chore, perf, ci
- Body (optional): wrap at 72 characters, explain the motivation for the change
- Reference issues with `Closes #123` or `Refs #123` when applicable
- Each commit should represent one logical change — don't mix unrelated changes
- Do not commit secrets, generated artifacts, or unrelated local changes.

If $ARGUMENTS is provided, use it as the commit message or as context for what the commit should focus on.
