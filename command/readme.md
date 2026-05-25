---
description: Write a README.md in the specified folder (root if not specified)
agent: documenter
---

Write a README.md file for the project or module.

- [ ] Determine the target folder: use "$ARGUMENTS" if provided, otherwise use the project root
- [ ] Research the project by reading package.json, config files, source structure, and any existing docs
- [ ] Identify the project name, purpose, tech stack, and key features
- [ ] Follow the README template from the documenter agent guidelines
- [ ] Include working code examples for the getting started and usage sections
- [ ] Link to any existing documentation rather than duplicating content
- [ ] Verify the README against the documenter quality checklist before saving

The README should cover:
- What the project does (one line)
- How to get started (prerequisites + quick start)
- How to use it (common use case with code)
- Configuration options
- How to contribute
- License

If $ARGUMENTS is provided, treat it as a folder path relative to the project root where the README should be written. If no argument is given, write to the project root.
