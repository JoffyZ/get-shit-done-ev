# GSD Studio

## 这是什么

GSD Studio 是一个多场景工作流框架，让 GSD 的系统化编排能力适配不同工作场景。它保留了 GSD 的核心价值（自动化流程、状态管理、阶段拆解、Agent 质量），但允许用户为不同领域（软件开发、数据分析、Agent 创造等）定制工作流，并在不同工具（Claude Code、OpenClaw）间复用。

## 核心价值

让有想法和意识的创作者，无需从零实现系统化的执行框架，就能将 GSD 的高效体验带到任何工作场景。

## 需求

### 已验证（Validated）

现有 GSD 框架已提供：

- ✓ 元提示编排引擎 — 自动化的 questioning → research → roadmap → execute → verify 流程
- ✓ 状态管理系统 — STATE.md、ROADMAP.md、检查点机制
- ✓ Agent 生态系统 — 15 个专门的 AI 代理（planner、executor、verifier 等）
- ✓ 原子提交机制 — Git 集成、自动化文档提交
- ✓ 多阶段拆解 — 复杂项目的阶段化管理
- ✓ 多运行时支持 — Claude Code、OpenCode、Gemini CLI 等

### 当前目标（Active）

v1.0 要实现的能力：

- [ ] **核心引擎提取** — 将编排逻辑从软件工程场景中解耦
- [ ] **场景包机制** — 支持可插拔的场景定义（workflows、agents、templates）
- [ ] **场景元数据规范** — manifest.json 定义场景的入口命令、核心概念、Agent 映射
- [ ] **首个新场景：Agent 创造** — 设计 → 编码 → 测试 → 部署的工作流
- [ ] **场景创造器** — /gsd:new-scenario 命令，用 GSD 创建新场景包
- [ ] **跨工具适配器** — 同一场景包可导出到 Claude Code、OpenClaw
- [ ] **上游同步策略** — 三分支 Git 管理（upstream-sync → stable → studio-dev）

### 范围外（Out of Scope）

- 改动现有 GSD 软件工程场景的核心逻辑 — 保持向后兼容
- 支持非 AI Agent 工具 — v1 专注于 Claude Code、OpenClaw
- 场景包市场/分享机制 — v2 功能
- 可视化场景编辑器 — v2 功能

## 上下文

### 项目背景

- 这是 get-shit-done 的 fork，保持与上游同步
- 用户在使用 GSD 构建软件项目时体验到了极高效率（半天完成项目）
- 用户有多个工作场景需求（软件开发、数据分析、Agent 创造）
- 用户在 Cursor 使用 .mdc 手动管理 Agent 时效率不高，需要系统化框架

### 技术环境

- 基于现有 GSD 架构：核心库层（core.cjs、state.cjs、phase.cjs 等）
- 当前运行时：Claude Code
- Git 仓库结构：fork from anthropics/get-shit-done-cc

### 用户需求模式

用户的实际工作流比标准 GSD 更轻量：
- 调研 → PRD 撰写 → 开发（一次性） → 迁移部署 → 迭代循环
- 不需要 phase1 → phase2 → phase3 的重度拆解
- 更关注快速原型和迭代

## 约束

- **技术栈**：保持与上游 GSD 一致（Node.js、CommonJS、Markdown orchestration）
- **向后兼容**：现有 GSD 软件工程场景必须继续工作，不受影响
- **上游同步**：必须支持手动审查并选择性合并上游更新
- **时间线**：6周完成 v1.0（M1: 场景扩展 2周 + M2: 创造器 2周 + M3: 跨工具适配 2周）
- **Git 策略**：三分支管理
  - `upstream-sync` — 纯净追踪上游
  - `stable` — 稳定快照版本
  - `studio-dev` — GSD Studio 开发分支

## 关键决策

| 决策 | 理由 | 结果 |
|------|------|------|
| 项目命名为 GSD Studio | 强调创作平台定位，而非工厂或多元宇宙 | — Pending |
| v1 范围包含 M1+M2+M3 | 用户有决心和时间投入，希望完整体验 | — Pending |
| 首个场景选择 Agent 创造 | 递归美感：用 GSD 创建 Agent 创造场景，再用它创造更多场景 | — Pending |
| Agent 创造采用设计驱动流程 | 设计规格 → 编写代码 → 测试验证 → 部署，符合工程最佳实践 | — Pending |
| 上游同步使用三分支策略 | 平衡自动化和可控性，避免被上游破坏性更新影响 | — Pending |
| 成功标准：能用+好用+可分享+可扩展 | 不仅自己用，还要能分享给社区，30分钟创建新场景 | — Pending |

---
*Last updated: 2026-03-16 after project initialization*
