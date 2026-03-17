# 架构

**分析日期：** 2026-03-16

## 模式概览

**整体模式：** 元提示编排 + 指挥官-代理系统

**关键特征：**
- 命令驱动的编排层：`.planning/` 中的 Markdown 文件作为工作流状态和执行环境
- 多代理体系：15 个专门的 AI 代理，每个有特定职责和指挥官协调
- 无状态库层：`get-shit-done/bin/lib/` 中的 CommonJS 模块处理核心逻辑
- 运行时无关安装：支持 Claude Code、OpenCode、Gemini CLI、Codex、GitHub Copilot
- 工作流分层：初始化 → 规划 → 研究 → 执行 → 验证的序列化管道

## 层次

**指挥层（Orchestration）：**
- 位置：`/commands/gsd/` （Markdown 文件，充当 Claude Code 自定义命令）
- 包含：38 个 GSD 命令定义（`add-phase.md`、`plan-phase.md` 等）
- 依赖：`get-shit-done/bin/lib/` 中的核心工具
- 用途：响应用户输入，调用适当的代理或库函数，管理工作流转换

**代理层（Agent）：**
- 位置：`/agents/` （Markdown 文件）
- 包含：15 个专门代理：
  - 规划：`gsd-planner.md`、`gsd-roadmapper.md`
  - 研究：`gsd-project-researcher.md`、`gsd-phase-researcher.md`、`gsd-research-synthesizer.md`
  - 执行：`gsd-executor.md`
  - 验证：`gsd-verifier.md`、`gsd-plan-checker.md`、`gsd-integration-checker.md`
  - UI：`gsd-ui-auditor.md`、`gsd-ui-researcher.md`、`gsd-ui-checker.md`
  - 其他：`gsd-codebase-mapper.md`、`gsd-debugger.md`、`gsd-nyquist-auditor.md`
- 工具：Read、Write、Bash、Grep、Glob、WebFetch 等
- 责任：特定工作流步骤的深度执行
- 接口：通过 `<files_to_read>` 块接收上下文，直接写入 `.planning/` 文件

**核心库层（Core Library）：**
- 位置：`get-shit-done/bin/lib/*.cjs`
- 模块：
  - `core.cjs` (495 行)：路径、配置、Git、模型配置的共享实用程序
  - `state.cjs` (721 行)：STATE.md 操作和进展引擎
  - `phase.cjs` (908 行)：阶段 CRUD、查询、生命周期操作
  - `commands.cjs` (666 行)：独立实用命令（时间戳、Slug、提交等）
  - `init.cjs` (710 行)：工作流启动的复合初始化命令
  - `verify.cjs` (826 行)：验证报告处理和完成检查
  - `roadmap.cjs` (305 行)：ROADMAP.md 操作
  - `milestone.cjs` (241 行)：里程碑 CRUD 和查询
  - `frontmatter.cjs` (299 行)：Markdown frontmatter 解析和序列化
  - `template.cjs` (222 行)：模板渲染和脚手架
  - `config.cjs` (198 行)：配置文件操作
- 依赖：Node.js 内置模块（fs、path、child_process、crypto）
- 调用者：安装脚本、命令 orchestrator、代理初始化

**工作流存储层（Workflow State Storage）：**
- 位置：`.planning/` 目录树
- 结构：
  - `config.json`：项目范围配置（模型配置、分支策略、工具使用标志）
  - `STATE.md`：当前项目状态（活动里程碑、阶段进度、关键字段）
  - `ROADMAP.md`：全局阶段定义（标题、描述、需求、验收标准）
  - `phases/{phase-num}/`：按阶段组织
    - `PLAN.md`：可执行的阶段计划（2-3 个任务）
    - `SUMMARY.md`：完成摘要
    - `CONTEXT.md`：用户决策（锁定决策、延迟想法、Claude 酌情权)
    - `*.md`：草稿、研究笔记
  - `codebase/`：分析文档
    - `ARCHITECTURE.md`（此文件）
    - `STRUCTURE.md`：目录布局
    - `STACK.md`：技术栈
    - `INTEGRATIONS.md`：外部服务
    - `CONVENTIONS.md`：编码约定
    - `TESTING.md`：测试模式
    - `CONCERNS.md`：技术债务

**安装 & 运行时层（Installation & Runtime）：**
- 位置：`bin/install.js`
- 责任：
  - 检测运行时（Claude Code 配置目录、OpenCode、Gemini、Codex、Copilot）
  - 将命令定义复制到适当的位置（`~/.claude/commands/gsd/` 等）
  - 将代理定义复制到适当的位置（`~/.claude/agents/` 等）
  - 将库文件复制到运行时特定的位置
  - 生成运行时特定的包装脚本

## 数据流

**初始化流程：**

1. 用户运行 `npx get-shit-done-cc`
2. `bin/install.js` 执行
   - 检测运行时（Claude Code、OpenCode、Gemini、Codex、Copilot）
   - 将 `.claude/` 中的文件复制到运行时配置目录
   - 安装钩子（检查更新、状态行、上下文监视）
3. 用户在 Claude Code 中运行 `/gsd:new-project`
4. `commands/gsd/new-project.md` orchestrator 加载
   - 调用 `gsd-project-researcher` 代理（深度研究现有项目）或初始化新项目
   - 调用 `init.cjs` 函数创建 `.planning/config.json` 和 `.planning/STATE.md`

**规划阶段流程：**

1. 用户运行 `/gsd:plan-phase [phase-id]`
2. `commands/gsd/plan-phase.md` orchestrator 加载
   - 读取 `.planning/config.json`（配置和模型选择）
   - 读取 `.planning/STATE.md`（当前状态）
   - 读取 `.planning/ROADMAP.md`（阶段定义）
   - 调用 `init.cjs::cmdInitExecutePhase()` 准备代理上下文
3. `gsd-planner.md` 代理执行
   - 接收 `<files_to_read>` 块中的 ROADMAP 阶段定义
   - 可选：调用 `gsd-phase-researcher.md` 以获取关键设计决策
   - 创建 `.planning/phases/{phase-num}/PLAN.md`
   - 创建 `.planning/phases/{phase-num}/CONTEXT.md`（用户决策）
   - 返回结构化结果到 orchestrator

**执行流程：**

1. 用户运行 `/gsd:execute-phase [phase-id]`
2. `commands/gsd/execute-phase.md` orchestrator 加载
   - 读取 PLAN.md（任务）
   - 调用 `init.cjs::cmdInitExecutePhase()` 准备代理上下文
3. `gsd-executor.md` 代理执行
   - 接收 PLAN.md 作为 `@file` 引用
   - 根据任务说明修改用户代码库
   - 运行测试和验证
   - 创建 `.planning/phases/{phase-num}/SUMMARY.md`
   - 提交更改（如果配置启用）

**验证流程：**

1. 执行完成后，用户可以运行 `/gsd:verify-work`
2. `commands/gsd/verify-work.md` orchestrator 加载
3. `gsd-verifier.md` 代理执行
   - 读取 PLAN.md 和 SUMMARY.md
   - 根据计划中指定的验收标准验证实现
   - 如果发现问题，创建 `verification-report.md`，提出改进任务
   - 用户可以运行 `/gsd:plan-phase --gaps` 填补差距

## 状态管理

**STATE.md 的角色：**

`STATE.md` 是项目的唯一真实源。它保留：
- 当前活动里程碑版本和名称
- 当前活动阶段编号和状态
- 最后更新的时间戳
- 关键配置覆盖
- 完成的里程碑数量

所有代理在启动时读取状态，在完成时更新状态。

**ROADMAP.md 的角色：**

`ROADMAP.md` 定义所有计划的工作。它包含：
- 全局里程碑结构（版本、名称、描述）
- 每个里程碑的阶段列表（编号、名称、描述）
- 每个阶段的需求（代号，例如"DB-001"）
- 每个阶段的验收标准
- 关键依赖关系和风险

## 关键抽象

**阶段（Phase）：**
- 目的：可执行的工作单位
- 示例：`1-core-setup`、`2.1-auth`
- 模式：编号.十进制-slug
- 操作：`phase.cjs` 中的 CRUD 函数（列表、创建、更新、查询）
- 存储：`.planning/phases/{phase-dir}/`

**里程碑（Milestone）：**
- 目的：分组相关阶段
- 结构：版本（"v1.0"、"v1.1"）和名称（"MVP"、"认证系统"）
- 操作：`milestone.cjs` 和 `state.cjs` 中的查询和更新
- 存储：`.planning/STATE.md` 和 `.planning/ROADMAP.md`

**计划（Plan）：**
- 目的：可执行的指令集合
- 文件：`.planning/phases/{phase-num}/PLAN.md`
- 结构：目标、上下文、2-3 个任务、成功标准
- 生成者：`gsd-planner` 代理
- 使用者：`gsd-executor` 代理

**配置（Config）：**
- 位置：`.planning/config.json`
- 内容：模型配置文件、分支策略、工具标志
- 使用：所有代理在启动时读取以配置行为
- 结构：`core.cjs::loadConfig()` 中定义的模式

## 入口点

**用户命令（Slash Commands）：**
- 位置：`/commands/gsd/`
- 格式：Markdown 文件（在 Claude Code 中作为自定义命令注册）
- 命名：`{command-name}.md`
- 示例：
  - `/gsd:new-project` → `commands/gsd/new-project.md`
  - `/gsd:plan-phase` → `commands/gsd/plan-phase.md`
  - `/gsd:execute-phase` → `commands/gsd/execute-phase.md`
- 职责：解析用户输入，调用代理或库函数，管理工作流

**代理触发点：**
- 由 orchestrator 命令通过 XML 提示格式显式调用
- 接收 `<files_to_read>` 块中的项目上下文
- 直接写入 `.planning/` 目录（不通过 orchestrator）
- 返回结构化结果给 orchestrator

**库函数调用：**
- 由 orchestrator 命令通过 bash 调用 `gsd-tools.cjs`
- 示例：
  ```bash
  node get-shit-done/bin/lib/gsd-tools.cjs \
    --phase-create 1 "Setup Core" --cwd /path
  ```
- 结果作为 JSON 返回到命令

## 错误处理

**策略：** 两层验证

1. **库层验证：** `core.cjs` 和特定模块验证输入、路径、Git 状态
   - 无效输入：返回错误消息到 stderr，退出代码 1
   - 文件不存在：返回空结果或 null

2. **代理层验证：** 代理检查计划的完成情况并生成验证报告
   - 验收标准失败：在 `verification-report.md` 中记录，提议改进阶段
   - 代码问题：标记为 `//fix-me` 评论，跟踪为后续工作

**模式：**
- `core.cjs` 中的 `error()` 函数：输出错误消息，退出 1
- `core.cjs` 中的 `output()` 函数：返回 JSON 或原始值，退出 0
- 超大 JSON 有效载荷（>50KB）：写入临时文件，返回 `@file:` URI

## 跨层关注点

**日志记录：**
- 策略：无中央日志
- 每个代理使用 `console.log` 对临时步骤进行日志记录
- 永久记录：`verification-report.md`、`SUMMARY.md`、`STATE.md`

**验证：**
- 策略：每阶段验证
- `gsd-plan-checker` 代理：在执行前验证计划的逻辑
- `gsd-verifier` 代理：在执行后对照验收标准验证完成
- `gsd-integration-checker` 代理：验证外部依赖的完整性

**认证：**
- 策略：无内置认证
- 所有操作假设用户已通过 Claude Code 认证
- 外部 API 认证：通过项目 `.env` 或 Claude Code 秘密存储

**开分支：**
- 策略：可选的 Git 分支（配置驱动）
- 配置：`config.json` 中的 `branching_strategy`（"无"、"阶段"、"里程碑"）
- 实现：`init.cjs::cmdInitExecutePhase()` 预计算分支名称
- 执行：`commands.cjs::cmdCommit()` 在创建提交时处理检出

---

*架构分析：2026-03-16*
