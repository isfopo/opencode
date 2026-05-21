---
description: Respond to PR review comments and fix issues
agent: worker
---

Address the review comments on PR $ARGUMENTS. Work through each comment methodically — evaluate whether it's valid, fix what needs fixing, and push the changes.

- [ ] Fetch the PR details and all review comments
- [ ] Read each comment and evaluate whether it's valid and actionable
- [ ] For valid comments, plan the fix — understand what change is being requested and why
- [ ] Implement the fixes, making minimal targeted changes rather than broad refactors
- [ ] Run type checking if the project uses a type system
- [ ] Run the linter and fix any errors or warnings in the changed code
- [ ] Run the test suite and ensure all tests pass
- [ ] Commit the changes with clear, descriptive messages referencing the review comments
- [ ] Push the changes and reply to each comment explaining what was done

When evaluating comments:
- **Valid and clear** → Fix it directly
- **Valid but unclear** → Ask for clarification before making changes
- **Subjective preference** → Consider adopting it if it improves readability or consistency, otherwise explain your reasoning
- **Invalid or incorrect** → Politely explain why, with evidence from the codebase or docs

Commit message format:
```
fix: address review comment on [file/area]

- [Specific change made]
- [Another change made]

Addresses #[comment-id]
```

If any comment reveals a problem that's out of scope for this PR, create a new issue for it and reference it in your reply rather than scope-creeping the current PR.