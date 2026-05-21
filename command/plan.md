---
description: Plan out epics and tasks for the project
agent: manager
---

Plan out the work for this project as a structured set of epics and tasks. Be detailed and sequential — start with project setup and foundational work, then move through core features to polish and release.

- [ ] Understand the project scope by reviewing the codebase, README, and any existing issues or docs
- [ ] Identify the major milestones (epics) needed to deliver the project
- [ ] Break each epic down into specific, actionable tasks
- [ ] Define dependencies between tasks and epics
- [ ] Assign priority levels based on importance and urgency
- [ ] Add technical details, implementation notes, and estimated complexity to each task
- [ ] Ensure the plan accounts for best practices: consistent coding style, modular architecture, linting, formatting, type checking, and testing
- [ ] Create the epics and tasks as GitHub issues with sub-issue relationships

Present the plan as a structured roadmap:

```md
## Epic 1: [Name] — [Priority] — [Estimated complexity]
> Goal: What this epic achieves

### Tasks
1. **[Task name]** — [Complexity: low/medium/high]
   - Description: What needs to be done
   - Technical notes: Key implementation details
   - Acceptance criteria: How we know it's done
   - Depends on: [Other task IDs, or "none"]

2. **[Task name]** — [Complexity: low/medium/high]
   ...
```

Guidelines for a good plan:
- **Setup first** — Project init, tooling, CI/CD before features
- **Core before polish** — Must-have features before nice-to-haves
- **Test as you go** — Testing tasks alongside feature tasks, not after
- **Small tasks** — Each task should be completable in a single focused session
- **Clear acceptance criteria** — Every task should have a testable definition of done

If $ARGUMENTS is provided, scope the plan to that specific feature, module, or milestone.