# 代码库结构

**分析日期：** 2026-03-16

## 目录布局

```
get-shit-done-ev/
├── bin/                           # 安装脚本和运行时整合
├── get-shit-done/                 # 核心 GSD 工具包（npm 发布）
│   ├── bin/
│   │   ├── gsd-tools.cjs         # 库函数的 Node.js 命令行入口
│   │   └── lib/                  # CommonJS 库模块
│   │       ├── core.cjs          # 共享实用程序（路径、配置、Git、模型）
│   │       ├── state.cjs         # STATE.md 操作和进展引擎
│   │       ├── phase.cjs         # 阶段 CRUD 和生命周期
│   │       ├── commands.cjs      # 独立命令（提交、Slug、时间戳）
│   │       ├── init.cjs          # 工作流启动的复合初始化
│   │       ├── verify.cjs        # 验证报告处理
│   │       ├── roadmap.cjs       # ROADMAP.md 操作
│   │       ├── milestone.cjs     # 里程碑 CRUD
│   │       ├── frontmatter.cjs   # Markdown frontmatter 解析
│   │       ├── template.cjs      # 模板渲染和脚手架
│   │       └── config.cjs        # 配置文件操作
│   ├── references/               # 代理和命令参考文档
│   ├── templates/                # 项目脚手架模板
│   │   ├── codebase/            # 代码库项目模板
│   │   └── research-project/     # 研究项目模板
│   └── workflows/                # 高级工作流定义
│
├── commands/gsd/                  # GSD 命令定义（38 个自定义命令）
│   ├── add-phase.md              # 添加阶段到路线图
│   ├── plan-phase.md             # 为阶段创建计划
│   ├── execute-phase.md          # 执行计划
│   ├── new-project.md            # 初始化新项目
│   ├── map-codebase.md           # 分析代码库架构
│   ├── autonomous.md             # 自主工作模式
│   ├── debug.md                  # 调试工作流
│   └── ... （34 个更多命令）
│
├── agents/                        # GSD 代理定义（15 个）
│   ├── gsd-planner.md            # 计划创建
│   ├── gsd-executor.md           # 阶段执行
│   ├── gsd-verifier.md           # 验收验证
│   ├── gsd-project-researcher.md # 项目研究
│   ├── gsd-phase-researcher.md   # 阶段特定研究
│   ├── gsd-codebase-mapper.md    # 代码库分析
│   ├── gsd-debugger.md           # 工作流调试
│   ├── gsd-plan-checker.md       # 计划验证（只读）
│   ├── gsd-integration-checker.md # 集成验证（只读）
│   └── ... （6 个更多代理）
│
├── hooks/                         # Git 钩子和运行时钩子
│   ├── gsd-check-update.js       # 检查 npm 更新的 postcommit 钩子
│   ├── gsd-statusline.js         # 显示状态行信息的 postcommit 钩子
│   └── gsd-context-monitor.js    # 监视上下文使用的钩子
│
├── scripts/                       # 构建和维护脚本
│   ├── build-hooks.js            # 编译 Hook 的 esbuild
│   └── run-tests.cjs             # 测试运行程序
│
├── tests/                         # 单元测试和集成测试
│
├── docs/                          # 文档和用户指南
│   └── USER-GUIDE.md             # 完整的端到端用户指南
│
├── .claude/                       # Claude Code 本地安装目录（开发）
│   ├── commands/gsd/             # 本地命令副本
│   ├── agents/                   # 本地代理副本
│   └── package.json              # 本地 CLI 入口点
│
├── .planning/                     # 项目工作流状态（示例）
│   ├── codebase/                 # 代码库分析文档
│   │   ├── ARCHITECTURE.md       # 架构分析
│   │   ├── STRUCTURE.md          # 目录结构
│   │   ├── STACK.md              # 技术栈
│   │   ├── INTEGRATIONS.md       # 外部集成
│   │   ├── CONVENTIONS.md        # 编码约定
│   │   ├── TESTING.md            # 测试模式
│   │   └── CONCERNS.md           # 技术债务
│   ├── config.json               # 项目配置（模型、分支策略）
│   ├── STATE.md                  # 当前项目状态
│   ├── ROADMAP.md                # 全局计划（阶段定义）
│   └── phases/                   # 按阶段组织的工作
│       ├── 1-core-setup/
│       │   ├── PLAN.md           # 可执行计划（任务和验收标准）
│       │   ├── CONTEXT.md        # 用户决策（锁定、延迟、酌情）
│       │   ├── SUMMARY.md        # 完成摘要
│       │   ├── DISCOVERY.md      # 研究笔记和发现
│       │   └── VALIDATION.md     # 验证报告（如果有问题）
│       ├── 2-auth/
│       └── ...
│
├── package.json                   # npm 元数据和脚本
├── README.md                      # 英文主要文档
├── README.zh-CN.md                # 简体中文主要文档
├── CHANGELOG.md                   # 版本历史
└── LICENSE                        # MIT 许可证
```

## 目录用途

**`bin/`：**
- 目的：安装和运行时整合
- 包含：`install.js` - 检测运行时（Claude Code、OpenCode、Gemini、Codex、Copilot）并将文件复制到适当的目录
- 关键文件：`install.js` (33,576 行) - 大型多运行时处理程序

**`get-shit-done/`：**
- 目的：npm 包根目录（发布到 `get-shit-done-cc`）
- 包含的内容被安装到全局或本地运行时目录
- `bin/gsd-tools.cjs`：库函数的 Node.js CLI 入口点
- `bin/lib/*.cjs`：共享库（无依赖项，纯 Node.js 内置模块）
- `references/`：有关代理和命令的 Markdown 参考
- `templates/`：项目脚手架（代码库、研究项目）
- `workflows/`：高级工作流定义

**`commands/gsd/`：**
- 目的：38 个 GSD 自定义命令定义
- 格式：Markdown 文件（在 Claude Code 中注册为 `/gsd:command-name`）
- 角色：主要 orchestrator；收集用户输入，调用代理和库函数
- 关键命令：
  - `new-project.md`：初始化新项目
  - `plan-phase.md`：为阶段创建计划
  - `execute-phase.md`：执行计划
  - `map-codebase.md`：运行代码库分析

**`agents/`：**
- 目的：15 个专门的 AI 代理定义
- 格式：Markdown 文件（带 frontmatter 和 XML 角色）
- 加载方式：由 orchestrator 命令通过 XML 提示格式显式调用
- 工具：每个代理有特定的工具集（Read、Write、Bash、Grep 等）
- 职责分工：
  - 规划代理：`gsd-planner`、`gsd-roadmapper`
  - 研究代理：`gsd-project-researcher`、`gsd-phase-researcher`、`gsd-research-synthesizer`
  - 执行代理：`gsd-executor`
  - 验证代理：`gsd-verifier`、`gsd-plan-checker`、`gsd-integration-checker`

**`hooks/`：**
- 目的：Git 和运行时钩子
- 文件：
  - `gsd-check-update.js`：检查 npm 更新后提交
  - `gsd-statusline.js`：显示项目状态信息
  - `gsd-context-monitor.js`：监视 Claude Code 上下文使用情况
- 编译：通过 `scripts/build-hooks.js` 用 esbuild 编译为 `hooks/dist/`

**`.planning/` 工作流存储：**
- 目的：项目工作流的真实单一源
- 结构：
  - `config.json`：项目范围配置（模型配置文件、分支策略）
  - `STATE.md`：当前进度（活动里程碑、活动阶段、时间戳）
  - `ROADMAP.md`：全局计划（所有阶段定义、需求、验收标准）
  - `phases/{phase-num}/`：按阶段组织
    - `PLAN.md`：可执行计划（2-3 个任务、验收标准）
    - `CONTEXT.md`：用户决策（锁定、延迟、酌情权）
    - `SUMMARY.md`：完成摘要
    - `DISCOVERY.md`：研究笔记
    - `VALIDATION.md`：验证报告（如果需要修复）
  - `codebase/`：代码库分析文档
    - `ARCHITECTURE.md`、`STRUCTURE.md`、`STACK.md`、`INTEGRATIONS.md`、`CONVENTIONS.md`、`TESTING.md`、`CONCERNS.md`

## 关键文件位置

**入口点：**
- `bin/install.js`：用户运行 `npx get-shit-done-cc@latest` 时的主入口
- `get-shit-done/bin/gsd-tools.cjs`：库函数的 Node.js 命令行访问
- `commands/gsd/*.md`：用户命令（`/gsd:command-name`）

**配置：**
- `get-shit-done/bin/lib/core.cjs`：配置加载（`loadConfig()` 函数）
- `.planning/config.json`：运行时项目配置
- `package.json`：npm 元数据

**核心逻辑：**
- `get-shit-done/bin/lib/state.cjs`：STATE.md 操作和进展引擎
- `get-shit-done/bin/lib/phase.cjs`：阶段 CRUD 和生命周期（908 行，最大）
- `get-shit-done/bin/lib/init.cjs`：工作流启动初始化（710 行）
- `get-shit-done/bin/lib/verify.cjs`：验证报告处理（826 行）

**测试：**
- `tests/`：单元和集成测试
- 运行：`npm test` 或 `npm run test:coverage`
- 脚本：`scripts/run-tests.cjs`

## 命名约定

**文件：**
- 命令定义：`{command-name}.md` (kebab-case)
  - 示例：`plan-phase.md`、`add-phase.md`、`map-codebase.md`
- 代理定义：`gsd-{agent-name}.md` (kebab-case，带 gsd- 前缀)
  - 示例：`gsd-planner.md`、`gsd-executor.md`、`gsd-verifier.md`
- 库模块：`{module-name}.cjs` (kebab-case)
  - 示例：`core.cjs`、`phase.cjs`、`state.cjs`
- 工作流文档：`{DOCUMENT_NAME}.md` (大写，带下划线)
  - 示例：`STATE.md`、`ROADMAP.md`、`PLAN.md`、`CONTEXT.md`
- 分析文档：`{ANALYSIS_NAME}.md` (大写)
  - 示例：`ARCHITECTURE.md`、`STRUCTURE.md`、`STACK.md`

**目录：**
- 组件目录：`{lowercase}` 或 `{kebab-case}`
  - 示例：`bin`、`agents`、`commands`、`get-shit-done`
- 阶段目录：`{phase-num}-{slug}`
  - 示例：`1-core-setup`、`2.1-auth-system`、`3-frontend`

**函数：**
- 命令函数：`cmd{CommandName}()`
  - 示例：`cmdInitExecutePhase()`、`cmdPhasesList()`、`cmdStateLoad()`
- 内部函数：`{actionName}Internal()` 或 `{actionName}()`
  - 示例：`findPhaseInternal()`、`loadConfig()`、`toPosixPath()`
- 导出：`module.exports = { cmd1, cmd2, ... }`

**变量和常量：**
- 路径：camelCase
  - 示例：`phasesDir`、`planningDir`、`configPath`
- 配置对象：camelCase
  - 示例：`config`、`options`、`result`
- 常量：UPPER_SNAKE_CASE
  - 示例：`GSD_CODEX_MARKER`、`MODEL_PROFILES`

## 添加新代码的位置

**新命令：**
- 位置：`commands/gsd/{command-name}.md`
- 格式：Markdown，带 frontmatter（名称、描述、工具）和 XML 角色
- 职责：解析输入，调用代理或库函数，管理工作流
- 示例：`commands/gsd/plan-phase.md`

**新代理：**
- 位置：`agents/gsd-{agent-name}.md`
- 格式：Markdown，带 frontmatter（名称、描述、工具、颜色）和 XML 角色
- 职责：特定工作流步骤的深度执行
- 示例：`agents/gsd-planner.md`

**新库函数：**
- 位置：`get-shit-done/bin/lib/{module-name}.cjs`（或现有模块）
- 格式：CommonJS（`module.exports = { fn1, fn2, ... }`)
- 依赖：仅限 Node.js 内置模块（fs、path、child_process、crypto、readline）
- 命名：`cmd{FunctionName}()` 用于暴露的命令，内部函数用 `functionName()`
- 调用：通过 `gsd-tools.cjs` CLI 或来自其他 .cjs 模块

**新工作流文档类型：**
- 位置：`.planning/{type}.md` 或 `.planning/phases/{phase-num}/{type}.md`
- 格式：Markdown，带或不带 frontmatter（基于文档类型）
- 示例：
  - 全局：`STATE.md`、`ROADMAP.md`、`config.json`
  - 阶段特定：`PLAN.md`、`CONTEXT.md`、`SUMMARY.md`、`DISCOVERY.md`、`VALIDATION.md`

## 特殊目录

**`.planning/` 工作流存储：**
- 目的：项目工作流的真实单一源
- 生成：由 `gsd-project-researcher` 初始化，由代理更新
- 提交：由配置的 `commit_docs` 标志控制
- `.gitignore` 覆盖：`.planning/config.json` 被追踪，秘密不被追踪

**`hooks/dist/`：**
- 目的：编译的 Git 和运行时钩子
- 生成：通过 `npm run build:hooks`（esbuild 编译 `hooks/` 中的 .js 文件）
- 已提交：是（npm 发布需要预编译文件）
- 用途：由 `install.js` 在运行时配置中安装

**`.claude/` 本地安装目录：**
- 目的：开发期间的本地 GSD 副本
- 结构：镜像全局 `~/.claude/` 目录
- 使用：`node bin/install.js --claude --local` 用于开发测试
- 已提交：是（用于开发和贡献）

---

*结构分析：2026-03-16*
