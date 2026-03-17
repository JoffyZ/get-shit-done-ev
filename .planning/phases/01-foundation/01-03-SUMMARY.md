---
phase: 01-foundation
plan: 03
subsystem: scenario-packages
tags:
  - architecture
  - scenario-packaging
  - software-eng-scenario
  - file-migration
dependency_graph:
  requires:
    - 01-02
  provides:
    - scenarios/software-eng/manifest.json
    - scenarios/software-eng/workflows/ (38 files)
    - scenarios/software-eng/templates/ (25 files)
    - scenarios/software-eng/references/ (13 files)
  affects:
    - core/loader.cjs (Plan 04 will consume manifest)
tech_stack:
  added:
    - scenarios/software-eng/ package structure
    - manifest.json schema implementation
  patterns:
    - scenario-package-pattern
    - manifest-based-registration
    - backward-compatibility-via-copy
key_files:
  created:
    - .claude/get-shit-done/scenarios/software-eng/manifest.json
    - .claude/get-shit-done/scenarios/software-eng/README.md
    - .claude/get-shit-done/scenarios/software-eng/workflows/ (38 files)
    - .claude/get-shit-done/scenarios/software-eng/templates/ (25 files)
    - .claude/get-shit-done/scenarios/software-eng/references/ (13 files)
  modified:
    - bin/lib/core.cjs (bug fix - delegation path)
    - bin/lib/state.cjs (bug fix - delegation path)
    - bin/lib/phase.cjs (bug fix - delegation path)
decisions:
  - summary: "Copy operation instead of move for backward compatibility during transition"
    rationale: "Original files remain functional until scenario loader is working (Plan 04)"
  - summary: "Fixed manifest template references to match actual filenames"
    rationale: "Templates like verification-report.md, UAT.md, retrospective.md have different names than manifest expected"
  - summary: "Removed non-existent plan.md template from manifest"
    rationale: "No plan.md template exists in templates/ directory"
metrics:
  duration: 4min
  completed_date: 2026-03-17
---

# Phase 1 Plan 3: Software-Eng Scenario Package Summary

**One-liner:** Packaged all existing GSD workflows (38), templates (25), and references (13) into scenarios/software-eng/ with manifest.json registration.

## What Was Built

Created the first GSD scenario package (scenarios/software-eng/) containing all current GSD functionality:

**1. Scenario Structure**
- Created `scenarios/software-eng/` directory with standard layout
- Subdirectories: `workflows/`, `agents/`, `templates/`, `references/`
- Follows SCENARIO-STRUCTURE.md specification

**2. Manifest Registration (manifest.json)**
- **36 commands:** new-project, plan-phase, execute-phase, verify-phase, research-phase, discuss-phase, discovery-phase, ui-phase, complete-milestone, new-milestone, plan-milestone-gaps, audit-milestone, add-phase, insert-phase, remove-phase, pause-work, resume-project, add-todo, check-todos, map-codebase, autonomous, validate-phase, ui-review, diagnose-issues, cleanup, stats, progress, settings, help, health, update, quick, add-tests, node-repair, transition, list-phase-assumptions
- **15 agents:** gsd-planner, gsd-roadmapper, gsd-executor, gsd-phase-researcher, gsd-project-researcher, gsd-research-synthesizer, gsd-codebase-mapper, gsd-verifier, gsd-plan-checker, gsd-integration-checker, gsd-nyquist-auditor, gsd-ui-researcher, gsd-ui-checker, gsd-ui-auditor, gsd-debugger
- **9 templates:** project, requirements, roadmap, summary, context, discovery, verification, uat, retrospective
- **13 references:** questioning, git-integration, git-planning-commit, model-profiles, model-profile-resolution, verification-patterns, tdd, checkpoints, planning-config, continuation-format, phase-argument-parsing, decimal-phase-calculation, ui-brand

**3. File Migration**
- **Workflows:** 38 .md files copied from `.claude/get-shit-done/workflows/`
- **Templates:** 25 .md files copied from `.claude/get-shit-done/templates/`
- **References:** 13 .md files copied from `.claude/get-shit-done/references/`

**4. Documentation**
- README.md explains scenario purpose, provides, and structure
- All files remain in original locations for backward compatibility

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed incorrect delegation paths in bin/lib modules**
- **Found during:** Plan initialization (gsd-tools.cjs failed to load)
- **Issue:** bin/lib/core.cjs, state.cjs, phase.cjs required `../core/*` instead of `../../core/*`
- **Fix:** Updated all three files to use correct relative paths (up two levels: bin/lib → bin → .claude/get-shit-done → core)
- **Files modified:** bin/lib/core.cjs, bin/lib/state.cjs, bin/lib/phase.cjs
- **Commit:** ce4148f

**2. [Rule 2 - Missing Critical] Fixed manifest template path mismatches**
- **Found during:** Task 2c verification (Node validation script reported missing files)
- **Issue:** Manifest referenced `verification.md`, `uat.md`, `milestone-retrospective.md`, `plan.md` but actual files are `verification-report.md`, `UAT.md`, `retrospective.md` (no plan.md)
- **Fix:** Updated manifest.json paths to match actual filenames, removed non-existent plan.md
- **Files modified:** scenarios/software-eng/manifest.json
- **Commit:** 3342801 (included with Task 2c)

## Implementation Details

**Scenario Package Structure:**
```
scenarios/software-eng/
├── manifest.json          # 36 commands, 15 agents, 9 templates, 13 references
├── README.md              # Scenario documentation
├── workflows/             # 38 workflow orchestration files
├── agents/                # (Empty - agents use workflow files directly)
├── templates/             # 25 document generation templates
└── references/            # 13 shared knowledge documents
```

**Copy vs Move Strategy:**
- All files COPIED (not moved) from original locations
- Original `.claude/get-shit-done/workflows/`, `templates/`, `references/` remain intact
- Ensures existing GSD commands continue working during transition
- Plan 04 (scenario loader) will enable the scenario package, then original files can be deprecated

**Manifest Validation:**
- All 36 workflow files exist in `workflows/`
- All 9 template files exist in `templates/`
- All 13 reference files exist in `references/`
- Node validation script confirms 100% file existence

## Verification Results

**Directory Structure:**
```bash
ls -R scenarios/software-eng/
# ✓ manifest.json
# ✓ README.md
# ✓ workflows/ (38 files)
# ✓ templates/ (25 files)
# ✓ references/ (13 files)
# ✓ agents/ (empty - ready for future agent-specific workflows)
```

**Manifest Validation:**
```bash
node -e "JSON.parse(fs.readFileSync('manifest.json'))"
# ✓ Valid JSON
# ✓ 36 commands registered
# ✓ 15 agents registered
# ✓ 9 templates registered
# ✓ 13 references registered
```

**File Existence:**
```bash
# Node validation script checked all manifest references
# ✓ All 36 workflow files exist
# ✓ All 9 template files exist
# ✓ All 13 reference files exist
# ✓ 0 missing files
```

**Backward Compatibility:**
```bash
test -f .claude/get-shit-done/workflows/new-project.md
# ✓ Original files still exist
```

## Self-Check: PASSED

**Created files exist:**
- ✓ .claude/get-shit-done/scenarios/software-eng/manifest.json
- ✓ .claude/get-shit-done/scenarios/software-eng/README.md
- ✓ .claude/get-shit-done/scenarios/software-eng/workflows/ (38 files)
- ✓ .claude/get-shit-done/scenarios/software-eng/templates/ (25 files)
- ✓ .claude/get-shit-done/scenarios/software-eng/references/ (13 files)

**Modified files exist (bug fix):**
- ✓ .claude/get-shit-done/bin/lib/core.cjs
- ✓ .claude/get-shit-done/bin/lib/state.cjs
- ✓ .claude/get-shit-done/bin/lib/phase.cjs

**Commits exist:**
- ✓ ce4148f (Bug fix: delegation paths)
- ✓ 8f63551 (Task 1: manifest + structure)
- ✓ 4debda7 (Task 2a: workflows)
- ✓ 2c536f5 (Task 2b: templates)
- ✓ 3342801 (Task 2c: references + manifest fix)

## Next Steps

Plan 04 will implement the scenario loader (core/loader.cjs) that:
- Discovers scenarios in `scenarios/` directory
- Parses and validates `manifest.json`
- Registers commands, agents, templates, references
- Enables dynamic scenario loading at GSD initialization

---

**Completed:** 2026-03-17
**Duration:** 4 minutes
**Tasks:** 3/3 (Task 1: structure + manifest, Task 2a: workflows, Task 2b: templates, Task 2c: references)
**Files:** 77 created (1 manifest, 1 README, 38 workflows, 25 templates, 13 references), 3 modified (bug fix)
**Commits:** 5 (1 bug fix + 4 tasks)
