# Phase 2 Research: Agent Creator Scenario

**Research Date:** 2026-03-17
**Scope:** AI agent specification formats, testing practices, and cross-platform compatibility
**Purpose:** Inform design of GSD Studio's Agent Creator scenario

---

## Executive Summary

**Key Finding**: The AI agent ecosystem has rapidly standardized in 2025-2026, with three major developments:

1. **NIST AI Agent Standards Initiative** (Feb 2026) - Government-led interoperability standards
2. **MCP (Model Context Protocol)** - Linux Foundation standard for agent-tool communication
3. **Universal agent definition formats** - Convergence across Claude Code, OpenClaw, Cursor

**Impact on Phase 2 Design:**
- ✅ Use MCP-compatible tool definitions in AGENT-SPEC.md
- ✅ Support cross-platform export (Claude Code AGENTS.md ↔ OpenClaw AGENTS.md ↔ Cursor .cursorrules)
- ✅ Include agent testing validation as core workflow step
- ✅ Adopt NIST agent identity framework (unique identifiers + capability declarations)

---

## 1. Agent Specification Standards (2026)

### 1.1 NIST AI Agent Standards Initiative

**Announced:** February 2026
**Organization:** NIST Center for AI Standards and Innovation (CAISI)

**Core Principles:**
- **Interoperability**: Agents must work across platforms
- **Security**: Standardized security considerations
- **Trust**: Transparent governance and capability declarations
- **Identity**: Machine-readable identifiers and capability specs

**Agent Identity Framework:**
```json
{
  "agent_id": "uuid-v7-compliant-identifier",
  "capabilities": ["reasoning", "code-generation", "tool-use"],
  "security_profile": "nist-ai-agent-v1",
  "interop_version": "1.0"
}
```

**Relevance to GSD Studio:**
- AGENT-SPEC.md should include NIST-compliant identity section
- Capability declarations should be machine-readable
- Generated agents should be auditable and portable

### 1.2 Communication Protocols

Three major protocols emerged as standards:

**MCP (Model Context Protocol)** - *Dominant*
- JSON-RPC 2.0 based
- Governed by Linux Foundation
- Supported by OpenAI, Google, Microsoft, AWS, Anthropic
- Current spec: Nov 2025 (updated March 2026 roadmap)
- **2026 focus**: Agent-to-Agent communication, enterprise features

**A2A (Agent2Agent)** - *Google-led*
- Peer-to-peer coordination
- Uses "Agent Cards" for capability declaration
- 50+ partner companies

**ACP (Agent Communication Protocol)** - *IBM*
- Lightweight REST-based
- No SDK required
- Focus: simplicity

**Decision for Phase 2:**
→ Prioritize MCP compatibility. Agent Creator should generate MCP-compliant tool definitions.

---

## 2. Claude Code Agent Best Practices (2026)

### 2.1 Agent Architecture Patterns

**Multi-Agent Coordination:**
- **Agent Teams**: Automated task delegation with shared messaging
- **Subagents**: Isolated contexts with specialized tool access
- **Writer/Reviewer Pattern**: One agent writes, another validates

**Context Management:**
- Manual `/compact` at 50% context usage
- `/clear` when switching tasks (fresh context = better code review)
- Use `.claude/agents/` for specialized assistants

**Project Structure:**
- `CLAUDE.md` - Project-specific instructions and conventions
- `AGENTS.md` - Agent operating instructions and memory
- `TOOLS.md` - User-maintained tool documentation
- Universal `SKILL.md` format for skills (cross-compatible with Cursor, Gemini, Codex, Antigravity)

### 2.2 Agent Definition Format

**Claude Code AGENTS.md Format (2026):**
```markdown
# Agent Name

**Role:** [Primary responsibility]

**Capabilities:**
- [List of what agent can do]

**Tools:**
- Read, Write, Edit, Bash, Grep, Glob
- [Custom MCP tools]

**Constraints:**
- [What agent should NOT do]

**Context Requirements:**
- [Files/docs agent needs to read first]

**Success Criteria:**
- [How to verify agent completed task correctly]
```

**Automation Features (New in 2026):**
- `/loop` command for recurring tasks
- Cron scheduling
- Hooks for custom event triggers
- MCP integration for PRD automation

**Relevance to Agent Creator:**
- Generated agents should follow this structure
- Support for hooks and automation should be configurable
- Context requirements should be auto-generated based on agent role

---

## 3. Agent Testing Practices (2026)

### 3.1 Testing Frameworks

**Top Frameworks:**
1. **LangGraph** - Complex multi-step reasoning workflows
2. **CrewAI** - Team-based collaboration testing
3. **AG2 (AutoGen)** - Multi-agent conversation testing
4. **TestSprite** - Fastest test generation (93% pass rate vs 42% for raw LLM)
5. **AgentBench** - Purpose-built agent assessment

**Testing vs Traditional Software:**
- Traditional LLM metrics (perplexity, BLEU) don't work for agents
- Single-turn accuracy doesn't capture planning/recovery/context retention
- Need specialized: behavioral validation, decision-making testing, multi-step reasoning patterns

### 3.2 Five Pillars of Agent Testing

From production readiness research:

1. **Intelligence & Accuracy**
   - Automated scoring of agent outputs
   - Tracing decision paths
   - Tool usage verification

2. **Performance & Efficiency**
   - Latency benchmarks
   - Cost per task tracking
   - Resource utilization

3. **Reliability & Resilience**
   - Stress testing (high load)
   - Fault injection (handle failures)
   - Long-term context maintenance

4. **Responsibility & Governance**
   - Red teaming (adversarial inputs)
   - Safety constraint validation
   - Audit trail completeness

5. **User Experience**
   - Human review of agent interactions
   - Task completion rates
   - User satisfaction metrics

### 3.3 Practical Testing Approach for Agent Creator

**Proposed Testing Workflow:**

**Phase 1: Unit Testing**
- Test agent with sample inputs (known good/bad cases)
- Verify tool usage patterns
- Check constraint adherence

**Phase 2: Integration Testing**
- Agent interacts with real tools/APIs
- End-to-end task completion
- Multi-turn conversation flows

**Phase 3: Behavioral Testing**
- Edge cases and error recovery
- Adversarial inputs
- Long-running tasks

**Test Artifacts to Generate:**
```
scenarios/agent-creator/templates/
  ├── TEST-PLAN.md          # Test strategy for agent
  ├── TEST-CASES.md         # Specific test scenarios
  └── TEST-RESULTS.md       # Execution results
```

**Decision for Phase 2:**
→ Agent Creator should generate test cases based on agent capabilities
→ Use "sample inputs" approach for quick validation
→ Defer full behavioral testing framework to Phase 3

---

## 4. Cross-Platform Agent Formats

### 4.1 OpenClaw Format

**Configuration File:** `openclaw.json`

**Agent Definition Structure (2026):**
```json
{
  "agent": {
    "workspace": "~/.openclaw/workspace",
    "model": {
      "primary": "anthropic/claude-sonnet-4-5"
    },
    "elevated": { "enabled": true },
    "heartbeat": { "every": "30m", "target": "last" }
  }
}
```

**Multi-Agent Support:**
```json
{
  "agents": {
    "defaults": { /* default config */ },
    "list": [
      { "id": "agent-1", "workspace": "...", /* config */ },
      { "id": "agent-2", "workspace": "...", /* config */ }
    ]
  }
}
```

**Workspace Files:**
- `AGENTS.md` - Operating instructions and memory
- `TOOLS.md` - Tool documentation
- `BOOTSTRAP.md` - First-run initialization
- `USER.md` - User profile
- Skills in `SKILL.md` format (same as Claude Code)

**Key Difference from Claude Code:**
- OpenClaw uses JSON config + workspace files
- Claude Code uses `.claude/agents/` directory structure
- Both support universal `SKILL.md` format

### 4.2 Cursor Format

**Configuration File:** `.cursorrules` or `.cursor/rules/`

**Legacy Format (.cursorrules):**
```markdown
# Project Rules

## Tech Stack
- [List technologies]

## Code Style
- [Conventions]

## Architecture
- [Key patterns]

## Constraints
- [Important limitations]
```

**MDC Format (.cursor/rules/):**
- More fine-grained control
- Separate rules for different contexts
- Newer and more powerful (2026 standard)

**How It Works:**
- Injected into every AI request as persistent context
- Functions as permanent system prompt
- Runs before every conversation, autocomplete, code generation

**Key Difference:**
- Cursor doesn't have "agents" per se - it has "rules" that shape Claude's behavior
- More about context injection than agent definition
- Focus on coding conventions rather than task orchestration

### 4.3 Cross-Platform Compatibility Matrix

| Feature | Claude Code | OpenClaw | Cursor |
|---------|-------------|----------|--------|
| Agent Definition | AGENTS.md | AGENTS.md + openclaw.json | .cursorrules |
| Skill Format | SKILL.md ✅ | SKILL.md ✅ | Custom rules |
| Multi-Agent | Subagents + Teams | agents.list | Single context |
| Tool Integration | MCP ✅ | MCP ✅ | Limited |
| Automation | Hooks, /loop ✅ | Heartbeat, elevated | Rules only |
| Context Management | /compact, /clear | Workspace-based | Auto-managed |

**Decision for Phase 2:**
→ Primary target: Claude Code (AGENTS.md + SKILL.md)
→ Secondary target: OpenClaw (generate openclaw.json adapter)
→ Tertiary: Cursor (generate .cursorrules from agent constraints)
→ Defer full adapter system to Phase 4

---

## 5. Implications for Agent Creator Design

### 5.1 AGENT-SPEC.md Template Structure

Based on research, the template should include:

```markdown
# Agent Specification: [Agent Name]

## Identity (NIST Compliant)
- **Agent ID**: [UUID v7]
- **Version**: [Semantic version]
- **Capabilities**: [reasoning, code-generation, tool-use, etc.]
- **Security Profile**: nist-ai-agent-v1

## Role & Purpose
- **Primary Responsibility**: [What agent does]
- **Success Criteria**: [How to verify completion]

## Capabilities & Tools
- **Core Capabilities**: [High-level abilities]
- **Tools**: [MCP-compliant tool list]
- **Constraints**: [What agent should NOT do]

## Context Requirements
- **Required Files**: [Files agent must read first]
- **Required Knowledge**: [Domain knowledge needed]
- **Project Skills**: [Skills agent should check]

## Testing Strategy
- **Unit Tests**: [Sample inputs/outputs]
- **Integration Tests**: [End-to-end flows]
- **Edge Cases**: [Known failure modes]

## Cross-Platform Export
- **Claude Code**: AGENTS.md format
- **OpenClaw**: openclaw.json + AGENTS.md
- **Cursor**: .cursorrules extraction

## Metadata
- **Created**: [Timestamp]
- **Generator**: GSD Studio Agent Creator v[version]
- **MCP Version**: 2025-11-25
```

### 5.2 Workflow Updates

**Agent Creator Workflow (Revised):**
1. **Design Phase**: `/gsd:new-agent` → questioning → AGENT-SPEC.md (with NIST identity)
2. **Code Phase**: Generate AGENTS.md (Claude Code format) + MCP tool definitions
3. **Test Phase**: Generate TEST-CASES.md → run sample inputs → validate
4. **Export Phase**: Generate OpenClaw adapter (optional, Phase 4)

### 5.3 Key Design Decisions

**Adopt Now:**
1. ✅ MCP-compliant tool definitions
2. ✅ NIST agent identity framework
3. ✅ Universal SKILL.md format
4. ✅ Sample input testing approach

**Defer to Later Phases:**
1. ⏭️ Full behavioral testing framework (Phase 3)
2. ⏭️ OpenClaw/Cursor adapters (Phase 4)
3. ⏭️ Agent-to-Agent communication (Phase 5)
4. ⏭️ Enterprise features (audit trails, SSO) (Phase 5)

---

## 6. References

### Standards & Protocols
- NIST AI Agent Standards Initiative: https://www.nist.gov/caisi/ai-agent-standards-initiative
- MCP Specification (2025-11-25): https://modelcontextprotocol.io/specification/2025-11-25
- MCP 2026 Roadmap: http://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/

### Platform Documentation
- Claude Code Best Practices (2026): https://code.claude.com/docs/en/best-practices
- OpenClaw Agent Runtime: https://docs.openclaw.ai/concepts/agent
- Cursor Rules Guide (2026): https://www.agentrulegen.com/guides/cursor-rules-guide

### Testing Resources
- AI Agent Testing Guide: https://galileo.ai/learn/test-ai-agents
- Top AI Agent Frameworks (2026): https://www.lindy.ai/blog/best-ai-agent-frameworks
- AgentBench: https://www.infoq.com/articles/evaluating-ai-agents-lessons-learned/

---

## Changelog

- **2026-03-17**: Initial research completed for Phase 2 design
