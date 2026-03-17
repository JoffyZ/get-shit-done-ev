# 编码约定

**分析日期:** 2026-03-16

## 命名模式

**文件:**
- CommonJS 模块: `.cjs` 后缀（用于 Node.js >= 16.7.0）
- 测试文件: `*.test.cjs` 格式（例如 `core.test.cjs`）
- 辅助文件: 描述性名称，如 `helpers.cjs` 用于测试工具函数

**函数:**
- 命令函数: `cmd` 前缀，后跟驼峰式描述，例如 `cmdGenerateSlug`, `cmdStateLoad`, `cmdVerifySummary`
- 内部函数: `Internal` 后缀用于仅导出和非公开的实现，例如 `generateSlugInternal`, `findPhaseInternal`, `getRoadmapPhaseInternal`
- 工具函数: 使用动词开头，例如 `extractFrontmatter`, `normalizePhaseName`, `comparePhaseNum`

**变量:**
- 常量: 全大写带下划线，例如 `MODEL_PROFILES`, `TOOLS_PATH`, `FRONTMATTER_SCHEMAS`
- 本地变量: 驼峰式，例如 `tmpDir`, `configPath`, `mentionedFiles`
- 私有/内部变量: 驼峰式，例如 `tmpPath`, `currentCwd`, `sanitizedValue`

**类型:**
- 对象/映射: 使用标准驼峰式，例如 `modelProfile`, `commitDocs`, `phaseNum`

## 代码风格

**格式化:**
- 无自动格式化工具配置文件（`.prettierrc` 不存在）
- 缩进: 2 个空格（从代码示例观察）
- 行长: 无严格限制，但代码避免过长行

**代码检查:**
- 无 ESLint 配置文件（`.eslintrc*` 不存在）
- 依赖手动代码审查和测试

## 模块导入组织

**导入顺序:**
1. Node.js 核心模块（`fs`, `path`, `child_process`）
2. 本项目库模块（`require('./core.cjs')` 等）
3. 无外部 npm 依赖

**示例模式:**
```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { safeReadFile, loadConfig, output, error } = require('./core.cjs');
const { extractFrontmatter } = require('./frontmatter.cjs');
```

**路径别名:**
- 未使用路径别名，所有导入使用相对路径

**导出模式:**
每个模块在文件末尾使用 `module.exports` 导出多个函数，例如：
```javascript
module.exports = {
  extractFrontmatter,
  reconstructFrontmatter,
  spliceFrontmatter,
  parseMustHavesBlock,
  FRONTMATTER_SCHEMAS,
};
```

## 错误处理

**模式:**
- 使用 `error()` 函数报告致命错误和用户错误，立即调用 `process.exit(1)`
- 使用 `try...catch` 处理预期的操作失败（文件读取、JSON 解析、Git 命令）
- 捕获块通常是空的或记录忽略错误，例如 `catch {}` 或 `catch (err) { /* skip */ }`

**示例:**
```javascript
// 致命错误
function error(message) {
  process.stderr.write('Error: ' + message + '\n');
  process.exit(1);
}

// 预期失败的优雅处理
try {
  return fs.readFileSync(filePath, 'utf-8');
} catch {
  return null;
}

// 可选操作的忽略错误
try {
  fs.writeFileSync(configPath, JSON.stringify(parsed, null, 2), 'utf-8');
} catch {}
```

**验证:**
- 必填参数通过 `if (!param)` 检查后调用 `error()` 函数
- 文件存在性通过 `fs.existsSync()` 检查
- JSON 有效性通过 try...catch `JSON.parse()` 验证

## 日志记录

**框架:** `console` 对象（无日志库）

**模式:**
- 输出函数 `output(result, raw, rawValue)` 处理所有成功的命令输出
- 使用 `process.stdout.write()` 处理原始文本输出
- 使用 `process.stderr.write()` 处理错误消息

**何时记录:**
- 成功结果: 通过 `output()` 函数返回 JSON
- 错误: 通过 `error()` 函数写入 stderr
- 无调试/详细日志对应的日志记录

## 注释

**何时添加注释:**
- 复杂的解析逻辑需要行内注释解释算法
- 已知的限制/bug 用 `REG-##` 格式标记（例如 `REG-04: quoted comma inline array edge case`）
- 分隔符注释用于组织代码块，例如 `// ─── helpers ──────────────────`

**JSDoc/TSDoc:**
- 部分函数有 JSDoc 注释，例如 `getMilestonePhaseFilter` 有描述性注释
- 并非所有函数都有 JSDoc，风格不一致
- 示例:
```javascript
/**
 * Returns a filter function that checks whether a phase directory belongs
 * to the current milestone based on ROADMAP.md phase headings.
 * If no ROADMAP exists or no phases are listed, returns a pass-all filter.
 */
function getMilestonePhaseFilter(cwd) { ... }
```

## 函数设计

**大小:**
- 范围从 10 行（简单工具）到 150+ 行（复杂命令处理器如 `cmdVerifySummary`）
- 无严格的行数限制

**参数:**
- 大多数命令函数接收 `(cwd, ...args, raw)` 模式
- `cwd` 为工作目录，`raw` 为布尔标志控制输出格式（JSON vs 原始文本）
- 可选参数无默认值，在函数体中检查

**返回值:**
- 命令函数不返回值，而是调用 `output()` 或 `error()` 并退出
- 纯工具函数返回值（例如 `extractFrontmatter` 返回对象）
- 异步操作: 未使用 async/await，仅使用同步 API（`execSync`）

## 模块设计

**导出:**
- 导出公共命令处理函数和工具函数
- 内部实现函数带 `Internal` 后缀，仍在模块导出中
- 单一责任: 每个模块处理一个主要功能域（`core.cjs`, `state.cjs`, `verify.cjs`）

**桶文件:**
- 未使用索引/桶文件（`index.cjs`），所有导入都是精确的

## 文件结构模式

**库文件位置:** `get-shit-done/bin/lib/*.cjs`
- `core.cjs` — 共享工具、常量、内部帮助函数（495 行）
- `commands.cjs` — 独立实用程序命令（666 行）
- `state.cjs` — STATE.md 操作（721 行）
- `verify.cjs` — 验证套件和一致性检查（826 行）
- `phase.cjs` — 阶段命令和进度引擎（908 行）
- `init.cjs` — 初始化和设置（710 行）
- `frontmatter.cjs` — YAML 前置处理解析和序列化（299 行）

**条件跳过:**
- 宽松的错误处理允许链式命令继续运行，即使单个操作失败

---

*约定分析: 2026-03-16*
