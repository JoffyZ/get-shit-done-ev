# Roadmap: GSD Studio

## Overview

GSD Studio transforms GSD from a single-purpose software engineering framework into a multi-scenario workflow platform. The journey moves from extracting the core orchestration engine (Phase 1), to proving the concept with an Agent Creator scenario (Phase 2), enabling users to create their own scenarios (Phase 3), making scenarios portable across tools (Phase 4), and establishing project infrastructure for long-term maintenance (Phase 5).

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Extract core engine and establish scenario system
- [ ] **Phase 2: Agent Creator** - First scenario demonstrating the system works
- [ ] **Phase 3: Scenario Generator** - Meta-capability to create new scenarios
- [ ] **Phase 4: Cross-tool Support** - Adapter system for portability
- [ ] **Phase 5: Project Infrastructure** - Git strategy, docs, and examples

## Phase Details

### Phase 1: Foundation
**Goal**: Core orchestration engine is extracted and scenario system is operational
**Depends on**: Nothing (first phase)
**Requirements**: CORE-01, CORE-02, CORE-03, CORE-04, SCEN-01, SCEN-02, SCEN-03, SCEN-04, SCEN-05
**Success Criteria** (what must be TRUE):
  1. User can run existing GSD software engineering workflows without any breaking changes
  2. Core engine (questioning, research, roadmap, execute, verify) loads independently of any specific scenario
  3. Existing software engineering logic is packaged as scenarios/software-eng/ and registers its commands
  4. User can see available scenarios and their commands via inspection or help
  5. Scenario packages define their structure via manifest.json (workflows/, agents/, templates/)
**Plans**: 4 plans

Plans:
- [ ] 01-01-PLAN.md — Design architecture and scenario system interfaces
- [ ] 01-02-PLAN.md — Extract core engine modules (engine, state, scheduler)
- [ ] 01-03-PLAN.md — Package software-eng workflows as first scenario
- [ ] 01-04-PLAN.md — Implement scenario loader and hot-switching

### Phase 2: Agent Creator
**Goal**: Users can design, code, test, and deploy AI agents using a structured workflow
**Depends on**: Phase 1
**Requirements**: AGENT-01, AGENT-02, AGENT-03, AGENT-04, AGENT-05, AGENT-06, AGENT-07
**Success Criteria** (what must be TRUE):
  1. User can run /gsd:new-agent and be guided through defining agent requirements
  2. Agent specification document (AGENT-SPEC.md) is generated with role, capabilities, and constraints
  3. Agent code is generated based on the specification and follows GSD agent patterns
  4. Agent can be tested in isolation with sample inputs
  5. User can see Agent Creator as a complete scenario package in scenarios/agent-creator/
**Plans**: TBD

Plans:
- TBD

### Phase 3: Scenario Generator
**Goal**: Users can create new scenario packages by describing their workflow
**Depends on**: Phase 2
**Requirements**: GEN-01, GEN-02, GEN-03, GEN-04, GEN-05, GEN-06
**Success Criteria** (what must be TRUE):
  1. User can run /gsd:new-scenario and describe their desired workflow in natural language
  2. System maps user's workflow description to GSD concepts (phases, agents, verification)
  3. System identifies what agent roles are needed from the workflow description
  4. Generated scenario package includes manifest.json, workflow files, agent stubs, and templates
  5. User can install and use the generated scenario immediately after generation
**Plans**: TBD

Plans:
- TBD

### Phase 4: Cross-tool Support
**Goal**: Scenario packages can be installed to different AI agent tools (Claude Code, OpenClaw)
**Depends on**: Phase 3
**Requirements**: ADPT-01, ADPT-02, ADPT-03, ADPT-04, ADPT-05
**Success Criteria** (what must be TRUE):
  1. User can run /gsd:install-scenario and select target platform (Claude Code or OpenClaw)
  2. Claude Code adapter generates .claude/commands/ structure from scenario manifest
  3. OpenClaw adapter generates claw.config.json from scenario manifest
  4. User can verify same scenario works in both Claude Code and OpenClaw
  5. Adapter interface is documented so others can create adapters for new platforms
**Plans**: TBD

Plans:
- TBD

### Phase 5: Project Infrastructure
**Goal**: Project has sustainable upstream sync strategy, complete documentation, and working examples
**Depends on**: Phase 4
**Requirements**: PROJ-01, PROJ-02, PROJ-03, PROJ-04, PROJ-05
**Success Criteria** (what must be TRUE):
  1. Three-branch Git strategy is operational (upstream-sync, stable, studio-dev)
  2. Upstream changes can be reviewed and selectively merged without breaking GSD Studio features
  3. README explains what GSD Studio is and how it differs from base GSD
  4. Scenario package development guide exists with step-by-step instructions
  5. Example project demonstrates using Agent Creator scenario to build a custom agent
**Plans**: TBD

Plans:
- TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/4 | Ready to execute | - |
| 2. Agent Creator | 0/TBD | Not started | - |
| 3. Scenario Generator | 0/TBD | Not started | - |
| 4. Cross-tool Support | 0/TBD | Not started | - |
| 5. Project Infrastructure | 0/TBD | Not started | - |
