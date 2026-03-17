# manifest.json Specification

## Overview

The `manifest.json` file is the contract between GSD's core orchestration engine and scenario packages. It defines entry points, agent mappings, templates, and references that enable a scenario to plug into the GSD framework without code changes to the core engine.

## Schema Definition

### Complete Schema

```json
{
  "name": "string (scenario identifier, e.g., 'software-eng')",
  "version": "string (semver, e.g., '1.0.0')",
  "description": "string (human-readable scenario description)",
  "gsd_version": "string (minimum compatible GSD core version, e.g., '>=1.0.0')",
  "commands": [
    {
      "name": "string (command name, e.g., 'new-project')",
      "namespace": "string (command namespace, e.g., 'gsd')",
      "workflow": "string (relative path to workflow file, e.g., 'workflows/new-project.md')"
    }
  ],
  "agents": [
    {
      "role": "string (agent role identifier, e.g., 'gsd-planner')",
      "workflow": "string (relative path to agent workflow, e.g., 'agents/gsd-planner.md')",
      "model_profile_key": "string (model profile key, e.g., 'gsd-planner')"
    }
  ],
  "templates": [
    {
      "name": "string (template identifier, e.g., 'project')",
      "path": "string (relative path to template file, e.g., 'templates/project.md')"
    }
  ],
  "references": [
    {
      "name": "string (reference identifier, e.g., 'questioning')",
      "path": "string (relative path to reference file, e.g., 'references/questioning.md')"
    }
  ]
}
```

### Field Descriptions

#### Top-Level Fields

**`name`** (required)
- **Type:** string
- **Format:** Lowercase with hyphens, no spaces or special characters
- **Purpose:** Unique identifier for the scenario across all installed scenarios
- **Example:** `"software-eng"`, `"agent-creator"`, `"data-analysis"`

**`version`** (required)
- **Type:** string
- **Format:** Semantic versioning (MAJOR.MINOR.PATCH)
- **Purpose:** Track scenario version for compatibility and updates
- **Example:** `"1.0.0"`, `"2.1.3"`

**`description`** (required)
- **Type:** string
- **Format:** One-sentence human-readable description
- **Purpose:** Explain what this scenario does and when to use it
- **Example:** `"GSD software engineering workflow (questioning → research → roadmap → execute → verify)"`

**`gsd_version`** (required)
- **Type:** string
- **Format:** Semver range (npm-style: `>=1.0.0`, `^1.2.0`, `~1.0.0`)
- **Purpose:** Ensure scenario is compatible with installed GSD core version
- **Example:** `">=1.0.0"`, `"^1.24.0"`

#### commands Array

**Purpose:** Register commands that users can invoke via `/namespace:command-name`

Each command object has:

**`name`** (required)
- **Type:** string
- **Format:** Lowercase with hyphens
- **Purpose:** Command name (appears after colon in `/namespace:name`)
- **Example:** `"new-project"`, `"plan-phase"`, `"execute-phase"`

**`namespace`** (required)
- **Type:** string
- **Format:** Alphanumeric with hyphens and colons
- **Purpose:** Command namespace (appears before colon in `/namespace:name`)
- **Example:** `"gsd"`, `"agent"`, `"data"`

**`workflow`** (required)
- **Type:** string
- **Format:** Relative path from scenario root
- **Purpose:** Path to markdown workflow file that orchestrates this command
- **Example:** `"workflows/new-project.md"`, `"workflows/plan-phase.md"`

#### agents Array

**Purpose:** Define agent roles that can be spawned during workflow execution

Each agent object has:

**`role`** (required)
- **Type:** string
- **Format:** Lowercase with hyphens
- **Purpose:** Agent role identifier (used in Task() calls)
- **Example:** `"gsd-planner"`, `"gsd-executor"`, `"agent-designer"`

**`workflow`** (required)
- **Type:** string
- **Format:** Relative path from scenario root
- **Purpose:** Path to agent-specific workflow file
- **Example:** `"agents/gsd-planner.md"`, `"agents/gsd-executor.md"`

**`model_profile_key`** (required)
- **Type:** string
- **Format:** String matching a key in GSD's model profiles
- **Purpose:** Resolve which model to use for this agent based on user's profile selection
- **Example:** `"gsd-planner"`, `"gsd-executor"`, `"gsd-verifier"`

#### templates Array

**Purpose:** Define document templates that workflows can reference

Each template object has:

**`name`** (required)
- **Type:** string
- **Format:** Lowercase identifier
- **Purpose:** Template name (used in workflow template references)
- **Example:** `"project"`, `"plan"`, `"summary"`

**`path`** (required)
- **Type:** string
- **Format:** Relative path from scenario root
- **Purpose:** Path to markdown template file
- **Example:** `"templates/project.md"`, `"templates/plan.md"`

#### references Array

**Purpose:** Define reference documents that workflows can include for context

Each reference object has:

**`name`** (required)
- **Type:** string
- **Format:** Lowercase identifier with hyphens
- **Purpose:** Reference name (used in workflow @ references)
- **Example:** `"questioning"`, `"git-integration"`, `"tdd"`

**`path`** (required)
- **Type:** string
- **Format:** Relative path from scenario root
- **Purpose:** Path to markdown reference file
- **Example:** `"references/questioning.md"`, `"references/tdd.md"`

## Example: software-eng Scenario

```json
{
  "name": "software-eng",
  "version": "1.0.0",
  "description": "GSD software engineering workflow (questioning → research → roadmap → execute → verify)",
  "gsd_version": ">=1.0.0",
  "commands": [
    {
      "name": "new-project",
      "namespace": "gsd",
      "workflow": "workflows/new-project.md"
    },
    {
      "name": "plan-phase",
      "namespace": "gsd",
      "workflow": "workflows/plan-phase.md"
    },
    {
      "name": "execute-phase",
      "namespace": "gsd",
      "workflow": "workflows/execute-phase.md"
    },
    {
      "name": "verify-phase",
      "namespace": "gsd",
      "workflow": "workflows/verify-phase.md"
    },
    {
      "name": "map-codebase",
      "namespace": "gsd",
      "workflow": "workflows/map-codebase.md"
    }
  ],
  "agents": [
    {
      "role": "gsd-planner",
      "workflow": "agents/gsd-planner.md",
      "model_profile_key": "gsd-planner"
    },
    {
      "role": "gsd-executor",
      "workflow": "agents/gsd-executor.md",
      "model_profile_key": "gsd-executor"
    },
    {
      "role": "gsd-verifier",
      "workflow": "agents/gsd-verifier.md",
      "model_profile_key": "gsd-verifier"
    },
    {
      "role": "gsd-researcher",
      "workflow": "agents/gsd-researcher.md",
      "model_profile_key": "gsd-researcher"
    }
  ],
  "templates": [
    {
      "name": "project",
      "path": "templates/project.md"
    },
    {
      "name": "plan",
      "path": "templates/plan.md"
    },
    {
      "name": "summary",
      "path": "templates/summary.md"
    },
    {
      "name": "requirements",
      "path": "templates/requirements.md"
    },
    {
      "name": "roadmap",
      "path": "templates/roadmap.md"
    }
  ],
  "references": [
    {
      "name": "questioning",
      "path": "references/questioning.md"
    },
    {
      "name": "git-integration",
      "path": "references/git-integration.md"
    },
    {
      "name": "tdd",
      "path": "references/tdd.md"
    },
    {
      "name": "checkpoints",
      "path": "references/checkpoints.md"
    },
    {
      "name": "deviations",
      "path": "references/deviations.md"
    }
  ]
}
```

## Validation Rules

**Enforced by core/loader.cjs during scenario loading:**

### Name Uniqueness
- Scenario `name` must be unique across all installed scenarios in `scenarios/` directory
- Loader maintains registry of loaded scenario names
- Duplicate names cause loading failure with clear error message

### File Existence
- All paths in `workflow`, `path` fields must exist relative to scenario root
- Loader validates each referenced file during manifest parsing
- Missing files cause validation failure with list of missing paths

### Namespace Format
- Command `namespace` must match pattern: `^[a-z0-9][a-z0-9-:]*[a-z0-9]$`
- Prevents conflicts with shell special characters
- Ensures commands are typeable and discoverable

### Version Compatibility
- `gsd_version` must be valid semver range
- Loader checks if installed GSD core version satisfies range
- Incompatible versions cause loading failure with upgrade/downgrade instructions

### Required Fields
- `name`, `version`, `description`, `gsd_version` are mandatory
- At least one command must be defined in `commands` array
- Missing required fields cause parsing failure with clear error

### Path Resolution
- All relative paths are resolved from scenario package root
- Paths must not escape scenario directory (no `../` outside root)
- Absolute paths are not allowed

## Loading Behavior

**Executed by core/loader.cjs at GSD initialization:**

### 1. Discovery Phase
- Scan `.claude/get-shit-done/scenarios/` directory
- Identify subdirectories (each is a potential scenario package)
- Read `manifest.json` from each subdirectory

### 2. Parsing Phase
- Parse JSON with error handling (syntax errors reported clearly)
- Extract all fields: name, version, description, gsd_version, commands, agents, templates, references
- Build in-memory registry of scenario metadata

### 3. Validation Phase
- Check required fields are present
- Validate `gsd_version` compatibility with installed core
- Verify all `workflow` and `path` files exist
- Check `namespace` format compliance
- Ensure scenario `name` is unique

### 4. Registration Phase
- Register commands to core engine's command dispatcher
  - Command key: `{namespace}:{name}`
  - Command handler: Load and execute workflow file
- Register agent roles to core scheduler
  - Role key: `{role}`
  - Agent workflow: Path to agent workflow file
  - Model profile: `{model_profile_key}` for resolution
- Register templates to template engine
  - Template key: `{name}`
  - Template path: Resolved absolute path
- Register references for workflow inclusion
  - Reference key: `{name}`
  - Reference path: Resolved absolute path

### 5. Activation Phase
- Mark scenario as loaded and available
- Add scenario to active scenarios list
- Enable command discovery for this scenario's commands

### Error Handling
- **Syntax errors:** Report file path and JSON parse error
- **Missing fields:** List all missing required fields
- **Version incompatibility:** Show installed GSD version, required range, upgrade instructions
- **Missing files:** List all files referenced but not found
- **Duplicate names:** Show conflicting scenarios and suggest rename
- **Validation failures:** Exit with non-zero status, log detailed error

### Runtime Resolution
- **Command invocation:** `/gsd:new-project` → Lookup "gsd:new-project" in command registry → Load `scenarios/software-eng/workflows/new-project.md`
- **Agent spawning:** `Task("gsd-planner", ...)` → Lookup "gsd-planner" in agent registry → Load `scenarios/software-eng/agents/gsd-planner.md`
- **Template rendering:** `@template:project` → Lookup "project" in template registry → Load `scenarios/software-eng/templates/project.md`
- **Reference inclusion:** `@reference:questioning` → Lookup "questioning" in reference registry → Load `scenarios/software-eng/references/questioning.md`

## Future Extensions

**Not in v1, but schema-compatible:**

- **Dependencies:** `"dependencies": ["other-scenario-name"]` for scenario composition
- **Exports:** `"exports": {...}` for sharing agents/templates between scenarios
- **Config schema:** `"config_schema": {...}` for scenario-specific settings
- **Hooks:** `"hooks": {"pre_command": "...", "post_command": "..."}` for lifecycle events
- **Metadata:** `"author": "...", "license": "...", "repository": "..."` for scenario packages

---

**Next:** See SCENARIO-STRUCTURE.md for directory layout conventions that implement this manifest specification.
