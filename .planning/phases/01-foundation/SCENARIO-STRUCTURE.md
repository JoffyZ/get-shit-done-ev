# Scenario Package Directory Structure

## Overview

This document defines the standard directory layout for GSD scenario packages. All scenarios follow this consistent structure to enable predictable loading, validation, and path resolution by the core engine.

## Standard Structure

```
scenarios/{scenario-name}/
├── manifest.json          # Scenario metadata and registration (REQUIRED)
├── workflows/             # Workflow orchestration files (REQUIRED)
│   ├── {command}.md      # One file per command
│   └── ...
├── agents/                # Agent-specific workflow files (OPTIONAL)
│   ├── {role}.md         # One file per agent role
│   └── ...
├── templates/             # Document generation templates (OPTIONAL)
│   ├── {template}.md     # One file per template
│   └── ...
├── references/            # Reference documents for workflows (OPTIONAL)
│   ├── {reference}.md    # Shared knowledge for scenario
│   └── ...
└── README.md              # Scenario documentation (OPTIONAL)
```

### Directory Purpose

**`manifest.json`** (REQUIRED)
- Scenario metadata: name, version, description, GSD version compatibility
- Command registration: maps command names to workflow files
- Agent registration: maps agent roles to workflow files
- Template registration: maps template names to template files
- Reference registration: maps reference names to reference files
- See MANIFEST-SPEC.md for complete schema

**`workflows/`** (REQUIRED)
- Contains workflow orchestration markdown files
- Each file defines the execution flow for a command
- Workflows use Task() mechanism to spawn agents
- Workflows reference templates and references by name
- At least one workflow file must exist and be referenced in manifest

**`agents/`** (OPTIONAL)
- Contains agent-specific workflow files
- Each file defines the behavior of one agent role
- Agents are spawned by workflows using Task() mechanism
- Only needed if scenario defines specialized agent workflows
- Not needed if scenario reuses generic agents from core

**`templates/`** (OPTIONAL)
- Contains markdown templates for document generation
- Templates use variables like `{project_name}`, `{phase}`
- Generated documents: PROJECT.md, PLAN.md, SUMMARY.md, etc.
- Only needed if scenario generates domain-specific documents

**`references/`** (OPTIONAL)
- Contains reference documents providing shared knowledge
- Referenced in workflows using `@reference:{name}` syntax
- Examples: best practices, patterns, troubleshooting guides
- Only needed if scenario has reusable knowledge documents

**`README.md`** (OPTIONAL)
- Human-readable documentation for the scenario
- Explains what the scenario does, when to use it, how to get started
- Installation instructions (if any dependencies)
- Usage examples and best practices

## File Naming Conventions

### Scenario Directory
- **Format:** Lowercase with hyphens, no spaces or underscores
- **Pattern:** `^[a-z][a-z0-9-]*[a-z0-9]$`
- **Examples:** `software-eng`, `agent-creator`, `data-analysis`
- **Invalid:** `Software-Eng` (uppercase), `agent_creator` (underscore), `123-scenario` (starts with number)

### Workflow Files
- **Format:** Match command name from manifest.json
- **Pattern:** `{command-name}.md`
- **Examples:** `new-project.md`, `plan-phase.md`, `execute-phase.md`
- **Convention:** Use descriptive hyphenated names that reflect command purpose

### Agent Files
- **Format:** Match agent role from manifest.json
- **Pattern:** `{role-name}.md`
- **Examples:** `gsd-planner.md`, `gsd-executor.md`, `agent-designer.md`
- **Convention:** Prefix with scenario namespace to avoid collisions (e.g., `gsd-planner`, not just `planner`)

### Template Files
- **Format:** Semantic names reflecting document type
- **Pattern:** `{template-name}.md`
- **Examples:** `project.md`, `plan.md`, `summary.md`, `requirements.md`
- **Convention:** Use singular nouns for document types

### Reference Files
- **Format:** Topic-based descriptive names
- **Pattern:** `{topic-name}.md`
- **Examples:** `questioning.md`, `tdd.md`, `git-integration.md`, `checkpoints.md`
- **Convention:** Use nouns or noun phrases that describe the content

## Required Files

**Minimum viable scenario package:**

1. `manifest.json` — Must exist and validate against MANIFEST-SPEC.md schema
2. At least one file in `workflows/` — Referenced in manifest `commands` array
3. All files referenced in manifest.json must exist (workflows, agents, templates, references)

**Validation failures if:**
- `manifest.json` missing or invalid JSON
- `workflows/` directory missing
- No workflow files referenced in manifest
- Any referenced file (workflow/agent/template/reference) does not exist

## Optional Directories

### When to include `agents/`
- Scenario defines specialized agent behaviors (not generic)
- Agents have domain-specific logic (e.g., code review agent, data validation agent)
- Agents need scenario-specific context or constraints

**Skip if:** Scenario uses only generic GSD agents (planner, executor, verifier) without customization

### When to include `templates/`
- Scenario generates structured documents (PROJECT.md, PLAN.md, etc.)
- Documents have scenario-specific fields or formats
- Templates reduce duplication and ensure consistency

**Skip if:** Scenario doesn't generate documents OR uses generic templates from core

### When to include `references/`
- Scenario has reusable knowledge documents (best practices, patterns)
- Workflows need to reference shared context (e.g., questioning strategies, verification checklists)
- Multiple workflows reference the same content

**Skip if:** Workflows are self-contained without shared references

### When to include `README.md`
- Scenario is complex and needs user documentation
- Scenario has special setup or configuration requirements
- Scenario is intended for sharing (community scenarios)

**Skip if:** Scenario is simple and self-explanatory from manifest

## Path Resolution

**All paths in manifest.json are relative to scenario root:**

```
scenarios/software-eng/
    ├── manifest.json
    └── workflows/
        └── new-project.md
```

In `manifest.json`:
```json
{
  "commands": [
    { "name": "new-project", "namespace": "gsd", "workflow": "workflows/new-project.md" }
  ]
}
```

**Core engine resolves absolute paths:**
- Manifest path: `workflows/new-project.md`
- Resolved to: `.claude/get-shit-done/scenarios/software-eng/workflows/new-project.md`

**Workflows can reference scenario files using relative paths:**
- From `workflows/new-project.md`: Reference `@reference:questioning`
- Core resolves: `.claude/get-shit-done/scenarios/software-eng/references/questioning.md`

**Path validation rules:**
- Paths must not escape scenario directory (no `../../../` outside root)
- Paths must use forward slashes (cross-platform compatibility)
- Absolute paths are not allowed in manifest

## Example: software-eng Scenario Structure

```
scenarios/software-eng/
├── manifest.json
├── workflows/
│   ├── new-project.md
│   ├── plan-phase.md
│   ├── execute-phase.md
│   ├── verify-phase.md
│   ├── research-phase.md
│   ├── map-codebase.md
│   ├── progress.md
│   ├── health.md
│   ├── cleanup.md
│   ├── add-phase.md
│   ├── insert-phase.md
│   ├── remove-phase.md
│   ├── complete-milestone.md
│   ├── new-milestone.md
│   ├── settings.md
│   └── ... (30+ workflow files)
├── agents/
│   ├── gsd-planner.md
│   ├── gsd-executor.md
│   ├── gsd-verifier.md
│   ├── gsd-researcher.md
│   ├── gsd-synthesizer.md
│   ├── gsd-roadmapper.md
│   ├── phase-planner.md
│   ├── plan-executor.md
│   ├── verification-agent.md
│   ├── requirement-synthesizer.md
│   └── ... (15 agent files)
├── templates/
│   ├── project.md
│   ├── plan.md
│   ├── summary.md
│   ├── requirements.md
│   ├── roadmap.md
│   ├── research.md
│   ├── context.md
│   ├── verification.md
│   └── ... (10 template files)
├── references/
│   ├── questioning.md
│   ├── git-integration.md
│   ├── tdd.md
│   ├── checkpoints.md
│   ├── deviations.md
│   ├── autonomous-execution.md
│   ├── nyquist-validation.md
│   ├── plan-structure.md
│   ├── verification-criteria.md
│   ├── testing-patterns.md
│   └── ... (12 reference files)
└── README.md
```

**File counts:**
- Total: ~70 files
- Workflows: ~30 (command entry points)
- Agents: ~15 (specialized agent workflows)
- Templates: ~10 (document generators)
- References: ~12 (shared knowledge)

**Manifest size:**
- Commands array: ~30 entries
- Agents array: ~15 entries
- Templates array: ~10 entries
- References array: ~12 entries

## Validation on Load

**Executed by core/loader.cjs during scenario loading:**

### 1. Structure Validation
- ✓ Check `manifest.json` exists
- ✓ Check `manifest.json` parses as valid JSON
- ✓ Check `workflows/` directory exists
- ✓ Check at least one workflow file exists

### 2. Manifest Validation
- ✓ Verify all required fields present (name, version, description, gsd_version)
- ✓ Verify at least one command defined
- ✓ Verify GSD version compatibility

### 3. File Existence Validation
- ✓ For each command: verify workflow path exists
- ✓ For each agent: verify workflow path exists
- ✓ For each template: verify path exists
- ✓ For each reference: verify path exists

### 4. Warnings (non-blocking)
- ⚠ `agents/` directory exists but no agents defined in manifest
- ⚠ `templates/` directory exists but no templates defined in manifest
- ⚠ `references/` directory exists but no references defined in manifest
- ⚠ Files exist in `workflows/` but not referenced in manifest commands

### Error Messages

**Missing manifest:**
```
Error loading scenario 'my-scenario':
  manifest.json not found in scenarios/my-scenario/
```

**Invalid JSON:**
```
Error parsing manifest.json in scenario 'my-scenario':
  Unexpected token } in JSON at position 123
```

**Missing workflow file:**
```
Error validating scenario 'my-scenario':
  Workflow file not found: workflows/missing-command.md
  Referenced in manifest commands[0]
```

**Missing workflows directory:**
```
Error loading scenario 'my-scenario':
  Required directory 'workflows/' not found in scenarios/my-scenario/
```

## Best Practices

### Organize by Command Type
- Group related workflows: `new-*.md`, `plan-*.md`, `execute-*.md`
- Separate user-facing commands from internal workflows
- Keep utility commands in subdirectories (e.g., `workflows/utils/`)

### Document Agent Responsibilities
- Each agent file should include `<purpose>` block explaining its role
- Document agent inputs, outputs, and constraints
- Provide examples of when to use each agent

### Version Templates Carefully
- Templates should be backward compatible within major versions
- Add new fields at the end to avoid breaking existing consumers
- Document template variables in comments

### Keep References Focused
- Each reference should cover one topic thoroughly
- Cross-reference related documents explicitly
- Update references when underlying practices change

### Test Scenario Packages
- Validate manifest with a test loader before committing
- Test at least one command from each workflow
- Verify all referenced files load without errors

---

**Implementation:** This structure is enforced by core/loader.cjs during scenario loading. See Plan 04 for loader implementation details.
