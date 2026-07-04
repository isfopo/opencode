---
name: npm-audit
description: Critically evaluates npm packages for production readiness. Analyzes popularity, maintenance cadence, recency, team size, governance, dependency health, and security posture. Use when deciding whether to adopt an npm package, evaluating package risk, comparing alternatives, or auditing existing dependencies. Produces a clear verdict — ADOPT, CAUTION, or AVOID — with specific red flags.
---

# npm Package Risk Assessment

Critically evaluate whether an npm package should be used in a production project. This is a **risk assessment**, not a marketing summary. Your job is to find problems, not to sell the package.

**Be skeptical.** A package with 10M weekly downloads can still be a bad choice. A package maintained by one person is a single point of failure. A package not updated in 2 years is abandoned, regardless of how "stable" it claims to be.

## FIRST: Verify MCP Tools Available

**Run this before starting.** Try calling any `npmsentinel_*` tool. If unavailable, STOP — the npmsentinel MCP server is not configured.

Ask the user to add this to their MCP config:

```json
"npmsentinel": {
  "type": "remote",
  "url": "<your-npmsentinel-url>"
}
```

## Required MCP Tools

This skill depends on **seven** npmsentinel tools. Call ALL of them in parallel for the target package(s):

| Tool | Data Retrieved |
|------|---------------|
| `npmTrends` | Weekly download counts (popularity signal) |
| `npmLatest` | Current version, last publish date, description, license, provenance |
| `npmChangelogAnalysis` | Release cadence, version history, publishing frequency |
| `npmMaintainers` | Number of maintainers, names, email domains |
| `npmDeps` | Runtime dependencies count, dependency tree complexity |
| `npmScore` | Composite quality, maintenance, popularity scores (0-100) |
| `npmVulnerabilities` | Known CVEs or security advisories |

**Additional tools (call in parallel when relevant):**

| Tool | When to Use |
|------|-------------|
| `npmDeprecated` | Always call — catches deprecated packages early |
| `npmMaintenance` | For deeper maintenance metric breakdown |
| `npmRepoStats` | When governance/organizational backing is unclear |
| `npmTypes` | When TypeScript support matters for the project |
| `npmSize` | When bundle size is a concern |
| `npmAlternatives` | When the verdict is CAUTION or AVOID — always suggest alternatives |
| `npmPackageReadme` | When the package description is unclear |

## Workflow

### Step 1: Gather All Data (Parallel)

For each package, fire ALL of these calls simultaneously:

```
npmTrends(packages: ["<pkg>"], period: "last-month")
npmLatest(packages: ["<pkg>"])
npmChangelogAnalysis(packages: ["<pkg>"])
npmMaintainers(packages: ["<pkg>"])
npmDeps(packages: ["<pkg>"])
npmScore(packages: ["<pkg>"])
npmVulnerabilities(packages: ["<pkg>"])
npmDeprecated(packages: ["<pkg>"])
```

### Step 2: Score Each Dimension

Score each of the six dimensions **0–100**. Be critical — not generous.

---

#### Dimension 1: Popularity (Weight: 15%)

Measures real-world adoption. High downloads = more eyes on the code, more production usage, more community support.

| Weekly Downloads | Score | Signal |
|-----------------|-------|--------|
| > 1,000,000 | 90-100 | Ubiquitous — industry standard |
| 100,000 – 1,000,000 | 70-89 | Widely adopted |
| 10,000 – 100,000 | 50-69 | Moderate adoption |
| 1,000 – 10,000 | 30-49 | Niche use |
| < 1,000 | 0-29 | Very low adoption — high risk |

**Adjustments:**
- +10 if it's a top-50 npm package overall
- -15 if downloads are suspiciously flat (possible bot inflation)
- Context matters: a database driver with 50K downloads may be healthy; a utility library with 50K is suspect

---

#### Dimension 2: Maintenance Cadence (Weight: 20%)

How regularly does the package ship updates? An active release cadence means bugs get fixed and the codebase stays current.

| Cadence | Score | Signal |
|---------|-------|--------|
| Multiple releases per month | 85-100 | Actively maintained |
| Monthly releases | 70-84 | Healthy cadence |
| Quarterly releases | 50-69 | Acceptable for stable packages |
| 1-2 releases per year | 25-49 | Slow — only critical fixes? |
| No release in 12+ months | 0-24 | Effectively abandoned |

**Key data points from `npmChangelogAnalysis` and `npmLatest`:**
- Days since last publish
- Number of releases in the last 12 months
- Ratio of patch vs. minor vs. major releases (all patches = stagnation or just bug treading)

**Red flags:**
- Last release > 18 months ago → cap at 20 regardless of download count
- No releases in last 6 months + declining downloads → strong abandonment signal
- Only major version bumps with no patch releases → suggests unstable development

---

#### Dimension 3: Team Health & Governance (Weight: 25%)

**This is the most important dimension.** A package maintained by a single person is a bus-factor-of-one risk. It doesn't matter how popular it is — if that person gets hit by a bus, loses interest, or has a disagreement with their employer, the package dies.

| Team Structure | Score | Signal |
|---------------|-------|--------|
| Large team (5+) at known org | 85-100 | Strong governance |
| Small team (3-4) at known org | 70-84 | Backed by organization |
| 2-3 maintainers, mixed orgs | 50-69 | Decent but fragile |
| 2 maintainers, same employer | 40-59 | Better than one, but correlated risk |
| Single maintainer | 0-30 | **CRITICAL RISK** |

**Governance signals:**
- Is it backed by an organization? (Meta → React, Microsoft → TypeScript, Vercel → Next.js, npm → semver)
- Do maintainer emails match an org domain? (@google.com, @meta.com, @vercel.com)
- Is there a contributing guide, CODEOWNERS, or governance doc in the repo?
- Are issues triaged? (check `npmRepoStats` for issue response time)

**Hard rules:**
- Single maintainer → maximum score of 30, no exceptions
- Single maintainer + no releases in 6+ months → maximum score of 15
- Single maintainer + no org backing → maximum score of 20
- Org-backed but all maintainers from same company → still cap at 75 (company priority shifts)

---

#### Dimension 4: Dependency Health (Weight: 15%)

Fewer runtime dependencies = smaller attack surface, fewer breaking change vectors, simpler audit.

| Runtime Dependencies | Score | Signal |
|---------------------|-------|--------|
| 0 | 95-100 | Zero-dependency — ideal |
| 1-3 | 75-94 | Minimal — acceptable |
| 4-10 | 50-74 | Moderate — review each |
| 11-25 | 25-49 | Heavy — audit required |
| 25+ | 0-24 | Excessive — serious risk |

**Also check:**
- Are any runtime dependencies themselves deprecated or unmaintained?
- Is there a dependency that accounts for a disproportionate share of the tree?
- Do dependencies have overlapping functionality? (bloat signal)

**Note:** Dev dependencies don't count toward this score — they don't ship to production.

---

#### Dimension 5: Security & Trust (Weight: 15%)

| Factor | Score Impact |
|--------|-------------|
| No known vulnerabilities | +80 baseline |
| Known unpatched vulnerabilities | -40 per unpatched CVE |
| Known patched vulnerabilities | -10 per CVE (at least they were fixed) |
| Has SLSA provenance / signed attestations | +15 |
| Has npm signatures | +5 |
| No provenance or signatures | 0 (neutral, not penalized — many good packages lack this) |
| License is copyleft (GPL) when project is proprietary | -30 |
| License is permissive (MIT, ISC, Apache-2.0, BSD) | +10 |
| License is unknown or custom | -20 |

---

#### Dimension 6: Quality Signals (Weight: 10%)

Use the composite scores from `npmScore`:

| Quality Sub-Score | Weight |
|-------------------|--------|
| Quality score | 40% |
| Maintenance score | 40% |
| Popularity score | 20% |

Combine into a single 0-100 score for this dimension.

**Additional signals:**
- Has TypeScript types (bundled or via @types)? +10
- Has comprehensive README? +5
- Has test coverage info? +5

---

### Step 3: Compute Final Score

```
final_score = (popularity × 0.15) + (cadence × 0.20) + (team × 0.25) + (deps × 0.15) + (security × 0.15) + (quality × 0.10)
```

### Step 4: Determine Verdict

| Final Score | Verdict | Meaning |
|------------|---------|---------|
| 80-100 | ✅ **ADOPT** | Low risk. Well-maintained, well-governed, widely trusted. |
| 60-79 | ⚠️ **CAUTION** | Usable but with known risks. Document mitigations. |
| 40-59 | 🔶 **RISKY** | Significant concerns. Consider alternatives. |
| 0-39 | 🛑 **AVOID** | Unacceptable risk. Do not use in production. |

**Override rules (these trump the numeric score):**

| Condition | Override |
|-----------|----------|
| Package is deprecated | → AVOID, regardless of score |
| Unpatched critical CVE | → AVOID, regardless of score |
| Single maintainer + no releases in 12+ months | → AVOID, regardless of score |
| Score is 80+ but single maintainer | → Cap at CAUTION (60-79) |
| Score is 80+ but last release > 18 months ago | → Cap at CAUTION (60-79) |
| Org-backed + actively maintained + 5+ maintainers | → Can boost to ADOPT if score is 75+ |

### Step 5: Find Alternatives (When Verdict is CAUTION, RISKY, or AVOID)

Always call `npmAlternatives` when the verdict is not ADOPT. Present alternatives with the same scoring framework so the user can compare.

## Output Format

Present the assessment as follows. Be direct. No hedging. No "on the other hand."

```
# Package Risk Assessment: <package-name>

## Verdict: ✅ ADOPT / ⚠️ CAUTION / 🔶 RISKY / 🛑 AVOID

> <One-sentence summary of why. Be blunt.>

## Score Breakdown

| Dimension | Score | Rating | Key Finding |
|-----------|-------|--------|-------------|
| Popularity | XX/100 | 🟢/🟡/🔴 | <one-liner> |
| Maintenance Cadence | XX/100 | 🟢/🟡/🔴 | <one-liner> |
| Team & Governance | XX/100 | 🟢/🟡/🔴 | <one-liner> |
| Dependency Health | XX/100 | 🟢/🟡/🔴 | <one-liner> |
| Security & Trust | XX/100 | 🟢/🟡/🔴 | <one-liner> |
| Quality Signals | XX/100 | 🟢/🟡/🔴 | <one-liner> |
| **Weighted Total** | **XX/100** | | |

**Rating key:** 🟢 70+ | 🟡 40-69 | 🔴 <40

## Red Flags

<Numbered list of specific red flags found. Each one is a concrete, verifiable concern.>

1. 🔴 **<Red flag title>** — <evidence from data>
2. 🟡 **<Warning>** — <evidence from data>
...

## Positive Signals

<Numbered list of genuine strengths. Don't pad — only list real strengths.>

1. 🟢 **<Strength>** — <evidence>
...

## Key Facts

| Property | Value |
|----------|-------|
| Latest Version | X.Y.Z |
| Last Published | <date> (<N> days/months ago) |
| Weekly Downloads | N |
| Maintainers | N (<names or org>) |
| License | <type> |
| Runtime Dependencies | N |
| Bundle Size | N (if checked) |
| TypeScript Types | Yes/No |
| Provenance | Yes/No |

## Recommendation

<2-4 sentences. State clearly what the user should do.>
- If ADOPT: "Safe to use. <brief context.>"
- If CAUTION: "Usable but <specific risk>. Mitigate by <specific action>."
- If RISKY: "Consider alternatives. <why>. If you must use it, <mitigation>."
- If AVOID: "Do not use. <why>. Use <alternative> instead."

## Alternatives (if CAUTION or worse)

| Package | Score | Verdict | Key Difference |
|---------|-------|---------|----------------|
| <alt-1> | XX/100 | <verdict> | <why it's better> |
| <alt-2> | XX/100 | <verdict> | <why it's better> |
```

## Comparing Multiple Packages

When the user asks to compare packages, assess each independently using the full framework, then present a side-by-side summary table:

| | Package A | Package B | Package C |
|---|-----------|-----------|-----------|
| **Score** | XX/100 | XX/100 | XX/100 |
| **Verdict** | ADOPT | CAUTION | AVOID |
| **Popularity** | 🟢 | 🟡 | 🔴 |
| **Maintenance** | 🟢 | 🔴 | 🟡 |
| **Team** | 🟢 | 🔴 | 🟡 |
| **Dependencies** | 🟢 | 🟡 | 🔴 |
| **Security** | 🟢 | 🟢 | 🟡 |
| **Quality** | 🟢 | 🟡 | 🔴 |

Then recommend the best choice with reasoning.

## Common Patterns & Shortcuts

### "Should I use X?" (single package)
→ Full assessment with all 6 dimensions.

### "Should I use X or Y?" (comparison)
→ Full assessment for each, then side-by-side table.

### "Is X safe?" (quick check)
→ Still run the full assessment but can be more concise in the output. Safety is the primary concern — weight security dimension more heavily in the narrative.

### "What's a good alternative to X?"
→ Assess X first (to understand what's wrong), then call `npmAlternatives`, assess the top 3 results, and recommend the best.

### Auditing a project's package.json
→ Read `package.json`, extract all runtime dependencies, assess each, then produce a prioritized action list sorted by risk (highest risk first).

## Anti-Patterns to Watch For

Call these out explicitly in the Red Flags section:

- **The "Bus Factor of One"**: Popular package, single maintainer. Examples: many community utilities. Risk: abandonment, unpatched CVEs, no succession plan.
- **The "Corporate Abandon"**: Org-backed package, no releases in 2+ years. The team moved on but the package still has millions of dependents.
- **The "Dependency Monster"**: Package with 30+ transitive dependencies. Each one is a potential breaking change or security vector.
- **The "Stale Giant"**: Millions of downloads, not updated in 18+ months. It "works" but the ecosystem has moved on.
- **The "License Trap"**: GPL-licensed package in a proprietary project. Legal risk, not technical risk — but equally dangerous.
- **The "Vulnerability Rack"**: 3+ known CVEs, some unpatched. The maintainers are not responsive to security issues.
- **The "Download Mirage"**: High downloads but almost all from a single popular package that depends on it. If that one package switches, downloads collapse.
- **The "TypeScript Tax"**: No TypeScript types, forcing the project to either use untyped JS or rely on community `@types` that may be outdated.
