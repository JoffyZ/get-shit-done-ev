# 技术栈

**分析日期:** 2026-03-16

## 语言

**主要:**
- JavaScript (Node.js) - CLI 工具、命令行界面
- CommonJS (.cjs) - 核心库和测试

**配置和标记:**
- Markdown - 文档、命令定义、配置存储
- YAML - GitHub Actions 工作流
- JSON - 配置文件、package.json

## 运行时

**环境:**
- Node.js >= 16.7.0
- 跨平台支持 (Windows, macOS, Linux)

**包管理器:**
- npm - 版本由 package.json 指定
- 锁文件: package-lock.json (推断，项目使用 npm ci)

## 框架和核心依赖

**零外部依赖的设计:**
- 不依赖任何第三方 npm 包 - 仅使用 Node.js 内置模块
- 依赖的内置模块: `fs`, `path`, `os`, `readline`, `crypto`, `child_process`, `http`, `https`, `events`

**开发和构建:**
- `esbuild` ^0.24.0 - 提前保留供未来使用（当前未在构建中使用）
- `c8` ^11.0.0 - 代码覆盖率测试工具（仅限 Node 20+）

**测试框架:**
- Node.js 内置 `test` 模块 - 使用 `--test` 标志运行测试
- 不依赖 Jest、Vitest 或其他外部测试框架

## 关键依赖

**没有运行时依赖:**
- 项目设计为零依赖，使用 Node.js 标准库实现所有功能
- 所有第三方集成（如 Brave Search）通过原生 `fetch()` 和 `execSync()` 处理

**仅开发依赖:**
- `esbuild` - 用于潜在的钩子打包（当前仅复制）
- `c8` - 用于代码覆盖率报告

## 配置

**环境变量:**
- `BRAVE_API_KEY` - 用于 Brave Search API 集成（可选）
- `NODE_V8_COVERAGE` - c8 代码覆盖率配置
- `CLAUDE_CONFIG_DIR` - 自定义配置目录覆盖（支持多账户设置）
- `HOME` - 用户主目录（路径解析）
- `WSL_DISTRO_NAME` - WSL 检测

**用户级默认值:**
- 位置: `~/.gsd/defaults.json`
- 支持的字段: `model_profile`, `granularity`, `brave_search`, `workflow.*`, `parallelization`
- Brave API 密钥备选存储: `~/.gsd/brave_api_key`

**项目配置:**
- 位置: `.planning/config.json`
- 默认值在首次初始化时生成
- 支持配置字段: `model_profile`, `commit_docs`, `search_gitignored`, `brave_search`, 工作流选项、并行化设置、Git 分支模板
- 弃用的字段自动迁移: `depth` -> `granularity` (映射: quick->coarse, standard->standard, comprehensive->fine)

**构建配置:**
- 无 Webpack、Rollup 或其他捆绑工具
- 钩子通过简单的文件复制分发 (见 `scripts/build-hooks.js`)
- TypeScript/JSDoc: 仅用于文档，无编译步骤

## 平台要求

**开发:**
- Node.js 16.7.0 或更高版本
- npm（用于依赖管理）
- Git（用于版本控制和执行集成）
- Bash/sh（某些系统操作）

**生产部署:**
- Node.js >= 16.7.0
- 对文件系统的访问（项目内本地存储）
- 网络访问（Brave Search 可选）
- Git 可执行文件（`.planning` 状态管理）

**支持的运行时:**
- Claude Code（主要）
- OpenCode
- Gemini CLI
- Codex（Microsoft IDE）
- GitHub Copilot

## 模块系统

**主入口点:**
- `bin/install.js` - 安装程序脚本
- `get-shit-done/bin/gsd-tools.cjs` - 工具命令分发

**核心库:**
- `get-shit-done/bin/lib/core.cjs` - 共享工具、常量、模型配置
- `get-shit-done/bin/lib/commands.cjs` - 独立实用命令
- `get-shit-done/bin/lib/config.cjs` - 配置管理
- `get-shit-done/bin/lib/init.cjs` - 初始化逻辑
- `get-shit-done/bin/lib/frontmatter.cjs` - Frontmatter 解析
- `get-shit-done/bin/lib/phase.cjs` - 阶段管理
- `get-shit-done/bin/lib/milestone.cjs` - 里程碑管理
- `get-shit-done/bin/lib/verify.cjs` - 验证和修复
- `get-shit-done/bin/lib/state.cjs` - 状态管理
- `get-shit-done/bin/lib/template.cjs` - 模板处理

**钩子:**
- `hooks/gsd-check-update.js` - SessionStart 钩子，检查 npm 更新
- `hooks/gsd-context-monitor.js` - PostToolUse 钩子，监控上下文使用
- `hooks/gsd-statusline.js` - 状态行命令，显示工作流状态

## 分发和安装

**NPM 包:**
- 包名: `get-shit-done-cc`
- 发布流程: `prepublishOnly` 钩子触发 `npm run build:hooks`
- 包含的文件 (package.json "files"): bin, commands, get-shit-done, agents, hooks/dist, scripts

**安装目标:**
- 全局: `~/.claude/get-shit-done/`, `~/.opencode/get-shit-done/`, `~/.gemini/get-shit-done/`, `~/.codex/get-shit-done/`
- 本地: `.claude/get-shit-done/`, `.opencode/get-shit-done/`, `.gemini/get-shit-done/`, `.codex/get-shit-done/`

---

*栈分析: 2026-03-16*
