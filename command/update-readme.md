---
description: Update the README based on changes in a merged or open PR
agent: documenter
---

Update the project README.md and any other README.md or documentation to reflect changes introduced by PR $ARGUMENTS or the current branch.

- [ ] Fetch the PR details, description, and diff using `gh pr view $ARGUMENTS --json title,body,files,additions,deletions`
- [ ] Review the PR diff to understand what changed: new features, removed features, API changes, config changes, dependencies
- [ ] Read the current README.md to understand existing documentation
- [ ] Identify sections that need updating based on the PR changes:
  - **New features** → Add to usage section or create new section
  - **Removed features** → Remove or mark as deprecated
  - **API changes** → Update endpoint/function documentation
  - **Config changes** → Update configuration section
  - **New dependencies** → Update prerequisites or installation section
  - **Breaking changes** → Add migration note or warning
- [ ] Make targeted edits to the README — only change what the PR affects
- [ ] Follow the documenter formatting rules (sections separated by `---`, short paragraphs, no trailing semicolons in code)
- [ ] Verify the updated README against the documenter quality checklist
- [ ] Commit the README changes with `docs: update README for PR #$ARGUMENTS`

### Change Detection Guide

| PR Change Type | README Section to Update |
|----------------|-------------------------|
| New command/endpoint | Usage, API docs |
| New config option | Configuration |
| New dependency | Prerequisites, Getting started |
| Removed feature | Usage (remove or deprecate) |
| Breaking change | Add migration note or warning |
| New feature | Add to feature list or usage |
| Updated examples | Code examples in Usage |

If $ARGUMENTS is not a valid PR number, fetch the most recently merged PR and use that instead.
