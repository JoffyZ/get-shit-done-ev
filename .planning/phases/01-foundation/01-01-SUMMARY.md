---
phase: 01-foundation
plan: 01
subsystem: architecture
tags: [design, documentation, core-engine, scenario-system, manifest-spec]

# Dependency graph
requires:
  - phase: none
    provides: "First plan in project - no dependencies"
provides:
  - "Core engine architecture specification with core/ and scenarios/ separation"
  - "manifest.json schema for scenario registration"
  - "Scenario package directory structure conventions"
affects: [01-02-PLAN, 01-03-PLAN, 01-04-PLAN, Phase-2, Phase-3]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Core engine extraction strategy from monolithic structure"
    - "Scenario package system with manifest-based registration"
    - "Interface contract between core and scenario packages"

key-files:
  created:
    - ".planning/phases/01-foundation/ARCHITECTURE.md"
    - ".planning/phases/01-foundation/MANIFEST-SPEC.md"
    - ".planning/phases/01-foundation/SCENARIO-STRUCTURE.md"
  modified: []

key-decisions:
  - "Core engine separated into core/ with engine, state, scheduler, loader modules"
  - "Scenarios packaged with manifest.json defining commands, agents, templates, references"
  - "Backward compatibility maintained via compatibility shims in bin/lib/"
  - "Migration path: extract core → package software-eng → implement loader → add hot-switching"

patterns-established:
  - "Manifest-based scenario registration without code changes to core"
  - "Dependency graph for ordered extraction (utils → state → scheduler → engine → loader)"
  - "Path resolution: relative in manifest, absolute at runtime"
  - "Validation on load: structure, manifest, file existence, version compatibility"

requirements-completed: [SCEN-01, SCEN-02]

# Metrics
duration: 5min
completed: 2026-03-17
---

# Phase 01 Plan 01: Design Architecture and Scenario System

**Core engine extraction blueprint with manifest-based scenario registration, ensuring backward compatibility with existing GSD workflows**

## Performance

- **Duration:** ~5 minutes
- **Started:** 2026-03-17T02:24:02Z
- **Completed:** 2026-03-17T02:29:00Z
- **Tasks:** 3
- **Files created:** 3

## Accomplishments

- Comprehensive architecture document defining core/scenario separation strategy
- Complete manifest.json specification with schema, validation rules, and loading behavior
- Scenario package directory structure with file naming conventions and best practices

## Task Commits

Each task was committed atomically:

1. **Task 1: Design core engine architecture and scenario system** - `78e58e4` (docs)
2. **Task 2: Define manifest.json specification** - `15e9d49` (docs)
3. **Task 3: Define scenario package directory structure** - `2c720b2` (docs)

## Files Created

- `.planning/phases/01-foundation/ARCHITECTURE.md` - 318 lines: Core engine extraction architecture with current state analysis, target structure (core/ and scenarios/), decoupling strategy, migration path, backward compatibility guarantees, dependency graph, and risk mitigation
- `.planning/phases/01-foundation/MANIFEST-SPEC.md` - 363 lines: Complete manifest.json schema with field descriptions, software-eng example with 5 commands and 4 agents, validation rules (name uniqueness, file existence, version compatibility), and loading behavior documentation
- `.planning/phases/01-foundation/SCENARIO-STRUCTURE.md` - 333 lines: Standard directory layout with manifest.json (REQUIRED), workflows/ (REQUIRED), agents/ (OPTIONAL), templates/ (OPTIONAL), references/ (OPTIONAL), file naming conventions, path resolution rules, validation on load, and software-eng example (~70 files)

## Decisions Made

**Architecture decisions:**
1. **Core modules:** Separate core into engine.cjs (orchestration), state.cjs (STATE/ROADMAP persistence), scheduler.cjs (agent lifecycle), loader.cjs (scenario registration), utils.cjs (shared utilities)
2. **Interface contract:** manifest.json as the sole communication mechanism between core and scenarios - core reads manifest, scenarios declare capabilities
3. **Backward compatibility:** Keep bin/lib/ as compatibility shims re-exporting from core/ - ensures existing imports don't break during migration
4. **Migration order:** Extract in dependency order (utils → state → scheduler → engine → loader) to avoid circular dependencies

**Manifest schema decisions:**
1. **Required fields:** name, version, description, gsd_version, commands array - ensures minimum viable scenario
2. **Path resolution:** All paths relative in manifest, resolved to absolute by core at runtime - simplifies manifest authoring
3. **Validation timing:** Load-time validation (structure, files, version) with clear error messages - fail fast, fail clearly
4. **Extensibility:** Schema designed for future extensions (dependencies, exports, hooks) without breaking v1 manifests

**Structure decisions:**
1. **Required directories:** Only manifest.json and workflows/ required - keeps minimum scenario simple
2. **Naming conventions:** Lowercase-with-hyphens for all file/directory names - consistent cross-platform
3. **File organization:** One file per command/agent/template - predictable structure, easy to navigate
4. **Validation approach:** Comprehensive load-time checks (structure, manifest, file existence) with detailed error messages

## Deviations from Plan

None - plan executed exactly as written. All three design documents created according to specifications with comprehensive content.

## Issues Encountered

None - design phase with no implementation artifacts to validate.

## Next Phase Readiness

**Ready for Plan 02 (Core Engine Extraction):**
- ✓ Target architecture defined with clear module boundaries
- ✓ Dependency graph documented for ordered extraction
- ✓ Backward compatibility strategy specified
- ✓ Success criteria established (existing commands must work)

**Ready for Plan 03 (Package Software-Eng Scenario):**
- ✓ Scenario directory structure documented
- ✓ manifest.json schema defined with software-eng example
- ✓ File naming conventions specified
- ✓ Migration checklist provided (move workflows/, templates/, references/)

**Ready for Plan 04 (Implement Scenario Loader):**
- ✓ Loader responsibilities documented (discovery, parsing, validation, registration)
- ✓ Loading behavior specified (5 phases: discovery → parsing → validation → registration → activation)
- ✓ Error handling requirements defined
- ✓ Runtime resolution patterns documented

**Blockers:** None - all subsequent plans have complete specifications to implement against.

---
*Phase: 01-foundation*
*Completed: 2026-03-17*
