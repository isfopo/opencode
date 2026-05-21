---
description: Create a new repo and set up the first issues
agent: manager
---

Create a new repository called "$ARGUMENTS" and set it up with a solid foundation for development.

- [ ] Create the repository on GitHub with a clear description
- [ ] Initialize with a README.md that explains the project's purpose, tech stack, and how to get started
- [ ] Create a `develop` branch and set it as the default branch
- [ ] Set up branch protection rules if applicable
- [ ] Plan out the initial set of epics and tasks based on the project scope
- [ ] Create epic issues with detailed descriptions covering the technical approach
- [ ] Create task issues as sub-issues under each epic, with clear acceptance criteria
- [ ] Clone the repo locally and navigate to it

Use this template for each issue:

```md
---
name: Feature Request
about: Suggest a new feature or improvement
title: "[Feature]: "
labels: enhancement
assignees: ''
---

### Feature Description
What feature would you like to see?

### Why Is This Needed?
Explain the problem or need for this feature.

### Suggested Solutions
Describe how this feature could be implemented.

### Additional Context
Add any relevant screenshots, links, or resources.
```

Epics should be broad milestones (e.g., "Project Setup", "Core Feature", "Testing & QA"). Tasks under each epic should be specific, actionable, and include:
- Technical details and implementation notes
- Estimated complexity (low/medium/high)
- Dependencies on other tasks
- Clear acceptance criteria

If $ARGUMENTS includes a project description or tech stack, use that to inform the repo setup and initial issues.