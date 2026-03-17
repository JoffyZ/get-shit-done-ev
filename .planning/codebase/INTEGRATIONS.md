# 外部集成

**分析日期:** 2026-03-16

## API 和外部服务

**网络搜索:**
- Brave Search - 用于 Web 搜索功能
  - SDK/客户端: 原生 `fetch()` API
  - 端点: `https://api.search.brave.com/res/v1/web/search`
  - 认证: `BRAVE_API_KEY` 环境变量（通过 X-Subscription-Token 头）
  - 实现文件: `get-shit-done/bin/lib/commands.cjs` (cmdWebsearch 函数)
  - 配置: `brave_search` 标志在 `.planning/config.json`

**NPM 包管理:**
- npm registry - 用于版本检查
  - 命令: `npm view get-shit-done-cc version`
  - 目的: 检查更新可用性
  - 实现: `hooks/gsd-check-update.js`

**GitHub:**
- 仓库: `https://github.com/glittercowboy/get-shit-done.git`
  - 用途: 源代码托管和 Issue 跟踪
  - CI/CD: GitHub Actions (见下文)

## 数据存储

**数据库:**
- 无传统数据库（MongoDB、PostgreSQL、MySQL 等）
- 所有状态存储在本地文件系统中

**文件存储:**
- 仅限本地文件系统
  - `.planning/` 目录 - 项目规划、配置、状态存储
  - `~/.gsd/` 目录 - 用户级配置和缓存
  - 临时文件: `/tmp` 目录（用于大型 JSON 输出: `gsd-{timestamp}.json`）

**缓存:**
- 位置: `~/.claude/cache/` (或对应运行时)
- 缓存文件: `gsd-update-check.json` - 版本检查缓存
- 策略: 后台进程更新（非阻塞）

## 认证和身份

**认证提供者:**
- 无用户认证系统 - GSD 是开发人员本地工具
- AI 运行时认证由宿主应用处理（Claude Code、OpenCode 等）

**API 密钥:**
- Brave Search API: `BRAVE_API_KEY`
  - 来源: 环境变量或 `~/.gsd/brave_api_key` 文件
  - 使用: Web 搜索功能（可选）

**运行时配置:**
- Claude Code/OpenCode/Gemini/Codex 凭证在宿主应用中管理
- GSD 不处理或存储 AI 模型 API 密钥

## 监控和可观测性

**错误跟踪:**
- 无错误跟踪服务集成
- 错误通过 stderr 输出到本地开发环境

**日志:**
- 方式: 标准输出 (stdout) 和标准错误 (stderr)
- 格式: JSON 或纯文本（取决于命令）
- 大型负载处理: 超过 50KB 的输出写入临时文件，路径前缀为 `@file:`

**上下文监控:**
- 钩子: `hooks/gsd-context-monitor.js`
- 触发: PostToolUse 钩子（Gemini 使用 AfterTool）
- 目的: 跟踪 AI 运行时中的上下文使用情况

**更新检查:**
- 实现: `hooks/gsd-check-update.js`
- 计划: SessionStart 钩子
- 方式: 后台进程（非阻塞，Windows 隐藏）
- 缓存: `~/.gsd/cache/gsd-update-check.json`

## CI/CD 和部署

**托管:**
- NPM 包注册表 - `npm install -g get-shit-done-cc`
- GitHub Releases

**CI 管道:**
- GitHub Actions
- 工作流: `.github/workflows/test.yml`
- 触发: push 到 main、PR、手动触发
- 测试矩阵:
  - 操作系统: Ubuntu (latest), macOS (latest), Windows (latest)
  - Node.js 版本: 18, 20, 22
  - 覆盖率检查: Node 20+ （c8 需要）
  - 并发: 同一工作流/PR 的新运行取消旧运行

**自动标签:**
- 工作流: `.github/workflows/auto-label-issues.yml`
- 目的: 自动标记新 Issue

**发布过程:**
- 命令: `npm publish`
- 预发布钩子: `prepublishOnly` 触发 `build:hooks`
- 分发物品: bin, commands, get-shit-done, agents, hooks/dist, scripts

## 环境配置

**必需的环境变量:**
- 无强制要求的环境变量
- GSD 可在无额外配置的情况下运行

**可选的环境变量:**
- `BRAVE_API_KEY` - 启用 Brave Search（如果设置）
- `CLAUDE_CONFIG_DIR` - 覆盖运行时配置目录
- `NODE_V8_COVERAGE` - 为 c8 启用代码覆盖率

**密钥位置:**
- Brave API 密钥: 环境变量 `BRAVE_API_KEY` 或文件 `~/.gsd/brave_api_key`
- 用户默认值: `~/.gsd/defaults.json`
- 项目配置: `.planning/config.json`（非秘密）

**运行时检测:**
- 自动检测 Claude Code、OpenCode、Gemini、Codex 配置目录
- WSL 检测: Windows 上的 WSL 环境识别
- 多账户支持: 通过 `CLAUDE_CONFIG_DIR` 覆盖

## Webhooks 和回调

**传入 Webhooks:**
- 无传入 Webhook 端点

**传出 Webhooks:**
- 无传出 Webhook（GSD 为本地开发工具）

**Git 集成:**
- 执行 Git 命令进行版本控制
- Git 钩子支持（通过运行时的 `.claude/settings.json` 等）
- 自动提交 `.planning/` 文档（如果 `commit_docs` 启用）

## 第三方工具集成

**编辑器和 IDE:**
- Claude Code - 主要目标运行时
- OpenCode - 支持的运行时
- Gemini CLI - 支持的运行时
- Microsoft Codex - 支持的运行时
- GitHub Copilot - 支持的运行时（技能转换）

**工具映射:**
- Claude Code 工具 → Copilot 工具（自动转换）
- 映射: Read→read, Write/Edit→edit, Bash→execute, Grep/Glob→search, Task→agent, WebSearch/WebFetch→web, TodoWrite→todo

**版本检查:**
- 检查源: NPM 注册表
- 缓存: `~/.gsd/cache/gsd-update-check.json`
- 更新检查文件位置: `get-shit-done/VERSION`

---

*集成审计: 2026-03-16*
