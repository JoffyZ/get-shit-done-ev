---
phase: 01-foundation
plan: 04
subsystem: core
tags: [scenario-loader, manifest-parser, command-registry, hot-switching, nodejs]

# Dependency graph
requires:
  - phase: 01-03
    provides: "scenarios/software-eng/ package with manifest.json"
provides:
  - "core/loader.cjs with loadScenarios(), registerCommands(), hotSwitch()"
  - "Scenario loading on gsd-tools startup"
  - "Dynamic command registration from manifest.json"
  - "CLI commands: list-scenarios, switch-scenario, scenario-info"
affects: [02-agent-creator, all-future-scenarios]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Scenario package discovery via manifest.json"
    - "In-memory registry for scenarios and commands"
    - "Dynamic command file generation from manifests"
    - "Hot-switching without restart"

key-files:
  created:
    - ".claude/get-shit-done/core/loader.cjs"
  modified:
    - ".claude/get-shit-done/bin/gsd-tools.cjs"

key-decisions:
  - "Scenario loading happens on gsd-tools module load for immediate availability"
  - "Command registry tracks workflow paths for resolution without file system lookups"
  - "Hot-switching clears and regenerates command files to support scenario switching"
  - "Non-fatal warnings for scenario loading errors to allow gsd-tools to function"

patterns-established:
  - "Scenario package structure: manifest.json + workflows/ + agents/ + templates/ + references/"
  - "Command registration generates .md files in .claude/commands/ namespace directories"
  - "Workflow path resolution via commandRegistry for O(1) lookups"
  - "Module-level initialization for zero-overhead scenario system access"

requirements-completed: [CORE-04, SCEN-03, SCEN-05]

# Metrics
duration: 6min
completed: 2026-03-17
---

# Phase 01 Plan 04: Scenario Loading & Hot-Switching Summary

**Dynamic scenario loading with manifest-driven command registration, hot-switching support, and backward-compatible CLI integration**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-17T02:52:10Z
- **Completed:** 2026-03-17T02:58:33Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments
- Scenario package discovery and validation from scenarios/ directory
- Dynamic command registration from manifest.json to .claude/commands/
- Hot-switching between scenarios without restart
- Backward-compatible integration with existing gsd-tools CLI
- Comprehensive end-to-end testing (6/6 tests passed)

## Task Commits

Each task was committed atomically:

1. **Task 1a: Implement core scenario loading functions** - `d388fa6` (feat)
2. **Task 1b: Implement command registration and hot-switching** - `6e42ccd` (feat)
3. **Task 2: Integrate scenario loader into gsd-tools CLI** - `8e2bd70` (feat)
4. **Task 3: Test scenario system end-to-end** - `cf21074` (feat)

**Plan metadata:** `f3db839` (docs: complete plan)

## Files Created/Modified

**Created:**
- `.claude/get-shit-done/core/loader.cjs` - Scenario loading, manifest validation, command registration, hot-switching (278 lines)
- `.planning/phases/01-foundation/SCENARIO-TEST-RESULTS.md` - Comprehensive test documentation (116 lines)

**Modified:**
- `.claude/get-shit-done/bin/gsd-tools.cjs` - Added scenario initialization, list-scenarios, switch-scenario, scenario-info commands

**Generated (dynamic):**
- `.claude/commands/gsd/*.md` - 42 command files generated from software-eng manifest

## Decisions Made

**Scenario loading timing:** Load scenarios on gsd-tools module load (not per-command) to ensure immediate availability and avoid repeated file system scans.

**Error handling strategy:** Non-fatal warnings for scenario loading errors allow gsd-tools to function for other commands even if scenario system fails.

**Command registry design:** Track workflow paths in-memory for O(1) resolution without repeated file system lookups.

**Hot-switching implementation:** Clear and regenerate command files instead of incremental updates to guarantee clean state transitions.

## Deviations from Plan

None - plan executed exactly as written.

All scenarios loaded successfully, all commands registered, all tests passed.

## Issues Encountered

None - implementation proceeded smoothly. Manifest validation, file existence checks, and workflow path resolution all worked as designed.

## End-to-End Test Results

All 6 tests passed (see SCENARIO-TEST-RESULTS.md for details):

1. **Scenario discovery** - software-eng found
2. **Scenario info** - Manifest details retrieved (36 commands, 15 agents, 9 templates, 13 references)
3. **Command registration** - 42 command files created
4. **Workflow path resolution** - Absolute paths resolved correctly
5. **Backward compatibility** - Existing init commands work unchanged
6. **Hot-switching** - Scenario switch successful (36 commands re-registered)

## Next Phase Readiness

**Phase 1 Foundation Complete:**
- Core modules extracted (engine.cjs, state.cjs, scheduler.cjs, loader.cjs)
- Scenario system operational and tested
- software-eng scenario packaged and loaded by default
- Command registration working
- Backward compatibility verified

**Ready for Phase 2:** Agent Creator Scenario
- Use scenario template to create agent-creator scenario package
- Leverage loader infrastructure for new scenario
- Package agent design workflows into new scenario
- No breaking changes required to core system

## Self-Check: PASSED

**Files verified:**
- ✓ .claude/get-shit-done/core/loader.cjs (created)
- ✓ .planning/phases/01-foundation/SCENARIO-TEST-RESULTS.md (created)

**Commits verified:**
- ✓ d388fa6 (Task 1a: Implement core scenario loading functions)
- ✓ 6e42ccd (Task 1b: Implement command registration and hot-switching)
- ✓ 8e2bd70 (Task 2: Integrate scenario loader into gsd-tools CLI)
- ✓ cf21074 (Task 3: Test scenario system end-to-end)

**Generated files verified:**
- ✓ 42 command files in .claude/commands/gsd/

All claimed files exist, all commits verified, all tests passed.

---
*Phase: 01-foundation*
*Completed: 2026-03-17*
