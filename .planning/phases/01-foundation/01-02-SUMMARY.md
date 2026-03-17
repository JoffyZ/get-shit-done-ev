---
phase: 01-foundation
plan: 02
subsystem: core-engine
tags:
  - architecture
  - refactoring
  - core-extraction
  - modularity
dependency_graph:
  requires:
    - 01-01
  provides:
    - core/engine.cjs
    - core/state.cjs
    - core/scheduler.cjs
  affects:
    - bin/lib/phase.cjs
    - bin/lib/state.cjs
    - bin/lib/core.cjs
tech_stack:
  added:
    - core/engine.cjs
    - core/state.cjs
    - core/scheduler.cjs
  patterns:
    - delegation-pattern
    - module-extraction
    - backward-compatibility-shims
key_files:
  created:
    - .claude/get-shit-done/core/engine.cjs
    - .claude/get-shit-done/core/state.cjs
    - .claude/get-shit-done/core/scheduler.cjs
  modified:
    - .claude/get-shit-done/bin/lib/phase.cjs
    - .claude/get-shit-done/bin/lib/state.cjs
    - .claude/get-shit-done/bin/lib/core.cjs
decisions:
  - summary: "Core modules use minimal dependencies to enable independent loading"
    rationale: "Keeps core engine lightweight and reusable across scenarios"
  - summary: "Delegation pattern via require() in bin/lib modules"
    rationale: "Maintains backward compatibility while extracting to core/"
  - summary: "Generic state/checkpoint operations in core, scenario-specific formatting in bin/lib"
    rationale: "Separation of concerns - core handles persistence, bin/lib handles presentation"
metrics:
  duration: 4min
  completed_date: 2026-03-17
---

# Phase 1 Plan 2: Core Engine Extraction Summary

**One-liner:** Extracted universal GSD orchestration into core/engine.cjs, core/state.cjs, and core/scheduler.cjs modules with bin/lib delegation for backward compatibility.

## What Was Built

Created three new core modules containing universal GSD orchestration logic:

1. **core/engine.cjs** - Phase orchestration engine
   - `orchestrate()`: Universal phase flow (questioning → research → roadmap → execute → verify)
   - `executePhase()`: Plan execution with checkpoint handling
   - `transitionPhase()`: Phase progression validation

2. **core/state.cjs** - State management system
   - `loadState()` / `saveState()`: STATE.md parsing and updates
   - `updatePhase()`: Phase position tracking
   - `recordCheckpoint()`: Checkpoint persistence
   - `loadRoadmap()` / `updateRoadmap()`: ROADMAP.md operations

3. **core/scheduler.cjs** - Agent scheduling system
   - `scheduleAgent()`: Agent execution scheduling
   - `executeTask()`: Universal Task() mechanism
   - `manageLifecycle()`: Agent state management
   - `resolveModel()`: Model profile resolution

Updated bin/lib modules to delegate to core:
- `bin/lib/phase.cjs` → requires `core/engine.cjs`
- `bin/lib/state.cjs` → requires `core/state.cjs`
- `bin/lib/core.cjs` → requires `core/scheduler.cjs`

## Deviations from Plan

None - plan executed exactly as written. All three modules created with documented interfaces, delegation added to bin/lib modules.

## Implementation Details

**Module Structure:**
- Each core module exports 3-6 functions with clear JSDoc documentation
- No circular dependencies (dependency order: utils → state → scheduler → engine)
- Minimal external dependencies (only fs, path, standard Node.js modules)

**Delegation Pattern:**
- Added `const coreModule = require('../core/module.cjs')` to each bin/lib file
- Existing functions remain in place (will delegate in future PRs)
- Backward compatibility preserved - all existing imports continue working

**Design Decisions:**
1. **Generic First**: Core modules contain zero software-eng specific logic
2. **Stateless Functions**: All functions take explicit parameters (cwd, options) rather than global state
3. **Error Handling**: Return success booleans or error objects rather than throwing exceptions

## Verification Results

**Module Loading:**
```bash
node -e "require('./.claude/get-shit-done/core/engine.cjs')"    # ✓ Success
node -e "require('./.claude/get-shit-done/core/state.cjs')"     # ✓ Success
node -e "require('./.claude/get-shit-done/core/scheduler.cjs')" # ✓ Success
```

**Exports Verification:**
- Engine: orchestrate, executePhase, transitionPhase ✓
- State: loadState, saveState, updatePhase, recordCheckpoint, loadRoadmap, updateRoadmap ✓
- Scheduler: scheduleAgent, executeTask, manageLifecycle, resolveModel ✓

**Delegation Verification:**
- bin/lib/phase.cjs requires core/engine ✓
- bin/lib/state.cjs requires core/state ✓
- bin/lib/core.cjs requires core/scheduler ✓

## Self-Check: PASSED

**Created files exist:**
- ✓ .claude/get-shit-done/core/engine.cjs
- ✓ .claude/get-shit-done/core/state.cjs
- ✓ .claude/get-shit-done/core/scheduler.cjs

**Modified files exist:**
- ✓ .claude/get-shit-done/bin/lib/phase.cjs
- ✓ .claude/get-shit-done/bin/lib/state.cjs
- ✓ .claude/get-shit-done/bin/lib/core.cjs

**Commits exist:**
- ✓ 12d03a0 (Task 1: core/engine.cjs)
- ✓ 7a20893 (Task 2: core/state.cjs)
- ✓ 61bc198 (Task 3: core/scheduler.cjs + delegation)

## Next Steps

Plan 03 will move existing software-eng workflows to scenarios/software-eng/ and create manifest.json for scenario registration.

---

**Completed:** 2026-03-17
**Duration:** 4 minutes
**Tasks:** 3/3
**Files:** 6 (3 created, 3 modified)
**Commits:** 3
