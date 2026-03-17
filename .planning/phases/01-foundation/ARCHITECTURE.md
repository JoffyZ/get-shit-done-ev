# GSD Studio Architecture: Core Engine Extraction

## Overview

This document defines the architecture for extracting GSD's orchestration engine into a reusable core, separate from the software engineering scenario. The goal is to enable GSD to support multiple workflow scenarios (software development, data analysis, agent creation) while preserving all existing functionality.

## Current State Analysis

### Existing Monolithic Structure

```
.claude/get-shit-done/
├── bin/
│   ├── lib/
│   │   ├── core.cjs           # Shared utilities (path, output, config, git)
│   │   ├── state.cjs          # STATE.md operations
│   │   ├── phase.cjs          # Phase CRUD and lifecycle
│   │   ├── plan.cjs           # Plan operations
│   │   ├── roadmap.cjs        # ROADMAP.md operations
│   │   ├── requirements.cjs   # REQUIREMENTS.md operations
│   │   └── ...                # 20+ other modules
│   └── gsd-tools.cjs          # CLI entry point
├── workflows/                  # 39 workflow orchestration files
│   ├── new-project.md
│   ├── plan-phase.md
│   ├── execute-phase.md
│   └── ...
├── templates/                  # Document generation templates
│   ├── project.md
│   ├── plan.md
│   └── ...
└── references/                 # Reference documents for workflows
    ├── questioning.md
    ├── git-integration.md
    └── ...
```

### Software-Engineering-Specific vs Universal Logic

**Universal orchestration patterns (core engine):**
- Phase-based decomposition (questioning → research → roadmap → execute → verify)
- State persistence (STATE.md, ROADMAP.md)
- Agent scheduling and lifecycle (Task() mechanism)
- Checkpoint-based workflow control
- Git integration for atomic commits
- Progress tracking and metrics

**Software-engineering-specific logic (scenario package):**
- Code-focused questioning templates
- TDD execution patterns
- Nyquist validation (code verification)
- Software testing workflows
- Deployment and migration plans
- Code review and quality checks

### Tightly Coupled Components

**Current coupling issues:**
1. `bin/lib/` modules are generic but referenced from software-eng workflows
2. Workflows hardcode paths to templates and references
3. Agent role definitions scattered across workflow files
4. Commands defined in `.claude/commands/gsd/` without registration mechanism
5. No abstraction layer between core orchestration and domain logic

## Target Architecture

### Directory Structure

```
.claude/get-shit-done/
├── core/                       # Universal orchestration engine (NEW)
│   ├── engine.cjs             # Phase orchestration (questioning → research → roadmap → execute → verify)
│   ├── state.cjs              # STATE.md, ROADMAP.md, checkpoint management
│   ├── scheduler.cjs          # Agent scheduling, Task() mechanism, lifecycle
│   ├── loader.cjs             # Scenario package loading and registration
│   └── utils.cjs              # Shared utilities (from current bin/lib/core.cjs)
├── scenarios/                  # Pluggable scenario packages (NEW)
│   └── software-eng/          # Existing software engineering workflows
│       ├── manifest.json      # Scenario metadata and registration
│       ├── workflows/         # Moved from root workflows/
│       │   ├── new-project.md
│       │   ├── plan-phase.md
│       │   ├── execute-phase.md
│       │   └── ...
│       ├── agents/            # Agent-specific workflow files
│       │   ├── gsd-planner.md
│       │   ├── gsd-executor.md
│       │   └── ...
│       ├── templates/         # Moved from root templates/
│       │   ├── project.md
│       │   ├── plan.md
│       │   └── ...
│       └── references/        # Moved from root references/
│           ├── questioning.md
│           ├── tdd.md
│           └── ...
└── bin/
    ├── lib/                    # Shared utilities (kept for compatibility)
    │   ├── core.cjs           # (becomes thin wrapper to core/utils.cjs)
    │   ├── state.cjs          # (becomes thin wrapper to core/state.cjs)
    │   └── ...
    └── gsd-tools.cjs          # CLI (updated to load scenarios via core/loader.cjs)
```

### Core Engine Responsibilities

**1. Phase Orchestration (`core/engine.cjs`)**
- Execute standard GSD phase flow: questioning → research → roadmap → execute → verify
- Invoke scenario-defined workflows at each phase
- Handle phase transitions and completions
- Manage phase directory structure (.planning/phases/)

**2. State Management (`core/state.cjs`)**
- Persist and query STATE.md (current position, status, decisions)
- Persist and query ROADMAP.md (phase definitions, progress tracking)
- Manage checkpoint state (paused workflows, resume points)
- Track performance metrics and decisions

**3. Agent Scheduling (`core/scheduler.cjs`)**
- Resolve agent roles to executable workflows (via scenario manifest)
- Launch agents using Task() mechanism
- Manage agent lifecycle (spawn, monitor, collect results)
- Handle agent model profile resolution

**4. Scenario Loading (`core/loader.cjs`)**
- Discover scenarios in scenarios/ directory
- Parse manifest.json files
- Register commands to .claude/commands/{namespace}/
- Build workflow path resolution tables
- Validate scenario dependencies and compatibility

### Scenario Package Responsibilities

**1. Domain-Specific Workflows**
- Define phase-specific workflows (e.g., new-project.md, plan-phase.md)
- Implement domain-specific questioning templates
- Define verification and testing strategies
- Provide deployment and operational workflows

**2. Agent Role Definitions**
- Map abstract roles (planner, executor, verifier) to specific agents
- Define agent capabilities and constraints
- Provide agent-specific workflow files (e.g., gsd-planner.md)

**3. Document Templates**
- Generate domain-specific documents (PROJECT.md, PLAN.md, SUMMARY.md)
- Define template variables and structure
- Provide example outputs

**4. Command Registration**
- Declare entry point commands in manifest.json
- Map commands to workflows
- Define command namespaces

### Interface Contract: manifest.json

The core engine and scenario packages communicate through a manifest.json interface:

**Core engine → Scenario:**
- Load manifest.json
- Resolve command → workflow mappings
- Resolve agent role → workflow mappings
- Locate templates and references by name

**Scenario → Core engine:**
- Declare commands, agents, templates, references
- Specify GSD version compatibility
- Define scenario metadata (name, version, description)

See MANIFEST-SPEC.md for detailed schema.

## Decoupling Strategy

### Phase 1: Extract Core Modules (Plan 02)

**Move bin/lib/ to core/:**
- `core/utils.cjs` ← bin/lib/core.cjs (path, config, git utilities)
- `core/state.cjs` ← bin/lib/state.cjs (STATE.md operations)
- `core/scheduler.cjs` ← NEW (extracted from bin/lib/phase.cjs + orchestration logic)
- `core/engine.cjs` ← NEW (phase flow orchestration)
- `core/loader.cjs` ← NEW (scenario loading)

**Compatibility shims in bin/lib/:**
- Keep bin/lib/core.cjs as thin wrapper re-exporting from core/utils.cjs
- Keep bin/lib/state.cjs as thin wrapper re-exporting from core/state.cjs
- Ensures existing imports don't break

### Phase 2: Package Software-Eng Scenario (Plan 03)

**Create scenarios/software-eng/ structure:**
- Move workflows/ → scenarios/software-eng/workflows/
- Move templates/ → scenarios/software-eng/templates/
- Move references/ → scenarios/software-eng/references/
- Extract agent files from workflows/ → scenarios/software-eng/agents/
- Create manifest.json with command/agent/template registry

**Update command files:**
- .claude/commands/gsd/*.md files remain in place (for backward compat)
- Commands now reference scenarios/software-eng/workflows/ paths
- Scenario loader generates commands dynamically in future

### Phase 3: Implement Scenario Loader (Plan 04)

**core/loader.cjs implementation:**
- Scan scenarios/ directory for subdirectories
- Parse each manifest.json
- Validate structure (required fields, file existence)
- Build command registry (command name → workflow path)
- Build agent registry (role → workflow path)
- Build template registry (name → template path)
- Provide resolution APIs for core engine

**Update gsd-tools.cjs:**
- Initialize loader at startup
- Use loader for command resolution
- Use loader for agent resolution

### Phase 4: Add Hot-Switching (Plan 04)

**Runtime scenario switching:**
- Store active scenario in .planning/config.json (default: software-eng)
- Loader resolves paths relative to active scenario
- User can switch via config change (no restart needed)
- Commands filtered by active scenario

## Migration Path

**Ordered implementation (matches Phase 1 plans):**

1. **Plan 01 (this document):** Design architecture, define manifest spec, define structure
2. **Plan 02:** Extract core/engine.cjs, core/state.cjs, core/scheduler.cjs from bin/lib/
3. **Plan 03:** Move software-eng files to scenarios/software-eng/, create manifest.json
4. **Plan 04:** Implement core/loader.cjs, update gsd-tools.cjs, enable hot-switching

**Testing at each step:**
- Run existing `/gsd:new-project` command
- Execute a simple plan with `/gsd:execute-phase`
- Verify STATE.md updates correctly
- Check ROADMAP.md generation

## Backward Compatibility

**Guarantees:**

1. **Existing commands work without changes**
   - `/gsd:new-project`, `/gsd:plan-phase`, `/gsd:execute-phase` continue functioning
   - Same command interface and behavior

2. **STATE.md, ROADMAP.md formats unchanged**
   - Existing projects can upgrade without migration
   - State persistence logic identical

3. **Git integration behavior preserved**
   - Atomic commits per task
   - Same commit message formats
   - Same branching strategy support

4. **User-facing command names stay the same**
   - No command renames or deprecations
   - Command discovery mechanism unchanged (for now)

**Compatibility testing strategy:**
- Maintain test suite of existing GSD commands
- Run suite after each core extraction step
- Block merge if any command breaks

## Risks and Mitigations

**Risk 1: Breaking existing workflows during refactor**
- **Impact:** Users cannot run GSD commands, projects blocked
- **Mitigation:** Comprehensive test suite, gradual migration with shims, feature flagging

**Risk 2: Over-abstracting too early**
- **Impact:** Core engine too complex, harder to maintain than monolith
- **Mitigation:** Extract only proven generic patterns (orchestration, state, scheduling), keep domain logic in scenarios

**Risk 3: Circular dependencies during extraction**
- **Impact:** Can't cleanly separate core from scenarios
- **Mitigation:** Dependency graph (below), extract in correct order (utils → state → scheduler → engine → loader)

**Risk 4: Manifest schema too rigid or too loose**
- **Impact:** Can't support new scenarios OR scenarios can break core engine
- **Mitigation:** Schema validation with clear error messages, version compatibility checks, extensive manifest examples

## Dependency Graph

**Extraction order (no circular deps):**

```
core/utils.cjs              # No dependencies on other core modules
    ↓
core/state.cjs              # Depends on: core/utils.cjs
    ↓
core/scheduler.cjs          # Depends on: core/utils.cjs, core/state.cjs
    ↓
core/engine.cjs             # Depends on: core/utils.cjs, core/state.cjs, core/scheduler.cjs
    ↓
core/loader.cjs             # Depends on: core/utils.cjs, core/engine.cjs
    ↓
scenarios/software-eng/     # Depends on: core engine APIs (via manifest)
```

**Rule:** Extract from bottom to top. Each module only depends on modules above it.

## Success Criteria

Architecture extraction is successful when:

1. User can run `/gsd:new-project` and create a project (existing behavior works)
2. Core engine loads independently (can import core/engine.cjs without scenario)
3. Software-eng scenario is packaged (scenarios/software-eng/ contains all domain logic)
4. Scenario loader discovers and registers software-eng (manifest.json is parsed)
5. All files referenced in manifest.json exist and are valid
6. No existing GSD command breaks (100% backward compatibility)

---

**Next steps:** See MANIFEST-SPEC.md for manifest.json schema details, and SCENARIO-STRUCTURE.md for package directory conventions.
