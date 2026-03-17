# 测试模式

**分析日期:** 2026-03-16

## 测试框架

**运行器:**
- Node.js 内置 `test` 模块（`node:test`）
- 版本需求: Node.js >= 16.7.0
- 配置文件: 无（使用 Node.js 默认配置）

**断言库:**
- Node.js 内置 `assert` 模块（`node:assert`）

**运行命令:**
```bash
npm test              # 运行所有测试（通过 scripts/run-tests.cjs）
npm run test:coverage # 运行带覆盖率检查（目标 70% 行覆盖）
```

## 测试文件组织

**位置:**
- 所有测试集中在 `tests/` 目录中
- 与源代码分离（非共置）

**命名:**
- 模式: `*.test.cjs`
- 示例: `core.test.cjs`, `phase.test.cjs`, `state.test.cjs`

**目录结构:**
```
tests/
├── helpers.cjs             # 共享测试工具函数
├── core.test.cjs          # 核心库函数测试 (804 行)
├── phase.test.cjs         # 阶段命令测试 (1711 行)
├── state.test.cjs         # 状态管理测试 (1378 行)
├── verify.test.cjs        # 验证命令测试 (1013 行)
├── config.test.cjs        # 配置命令测试 (374 行)
├── commands.test.cjs      # 独立命令测试 (1292 行)
├── dispatcher.test.cjs    # 路由和错误路径测试 (277 行)
├── init.test.cjs          # 初始化测试 (870 行)
├── milestone.test.cjs     # 里程碑测试 (611 行)
├── roadmap.test.cjs       # 路线图测试 (764 行)
├── verify-health.test.cjs # 健康检查测试 (663 行)
├── frontmatter.test.cjs   # YAML 前置处理测试 (353 行)
├── agent-frontmatter.test.cjs       # 智能体前置处理 (169 行)
├── copilot-install.test.cjs         # Copilot 安装测试 (1362 行)
├── codex-config.test.cjs            # Codex 配置测试 (494 行)
├── gemini-config.test.cjs           # Gemini 配置测试 (47 行)
└── frontmatter-cli.test.cjs         # 前置处理 CLI 测试 (271 行)

总计: 17 个测试文件，12,453 行测试代码
```

## 测试结构

**套件组织:**
```javascript
const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');

describe('loadConfig', () => {
  let tmpDir;
  let originalCwd;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsd-core-test-'));
    fs.mkdirSync(path.join(tmpDir, '.planning'), { recursive: true });
    originalCwd = process.cwd();
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('returns defaults when config.json is missing', () => {
    const config = loadConfig(tmpDir);
    assert.strictEqual(config.model_profile, 'balanced');
  });
});
```

**模式:**
- 使用 `describe()` 分组相关测试
- `beforeEach()` 创建临时目录和保存状态
- `afterEach()` 恢复工作目录并清理临时文件
- 每个测试单独设置/清理独立环境

## 断言模式

**常用断言:**
```javascript
// 相等性
assert.strictEqual(config.model_profile, 'balanced');
assert.strictEqual(typeof config.commit_docs, 'boolean');

// 深度相等性（用于对象/数组）
assert.deepStrictEqual(config.model_overrides, { 'gsd-executor': 'opus' });
assert.deepStrictEqual(output.directories, ['01-foundation', '02-api', '10-final']);

// 真值检查
assert.ok(result.success, `Command failed: ${result.error}`);
assert.ok(fs.existsSync(fullPath), 'file should exist');
assert.ok(Array.isArray(result.key), 'should produce an array');

// 包含检查
assert.ok(result.error.includes('STATE.md not found'), 'should report missing file');
assert.ok(error.includes('Unknown command'), `Expected "Unknown command" in stderr`);
```

## 模拟

**框架:** 无模拟库（不使用 sinon、jest.mock 等）

**模式:**
- 测试创建真实的临时文件系统结构
- 使用 `fs.mkdtempSync()` 创建隔离的测试目录
- 测试 CLI 工具通过 `runGsdTools()` 辅助函数执行实际命令

**模拟工具:**
```javascript
// helpers.cjs 提供的模拟工具函数
function runGsdTools(args, cwd = process.cwd()) {
  try {
    let result;
    if (Array.isArray(args)) {
      // 使用 execFileSync (安全，绕过 shell)
      result = execFileSync(process.execPath, [TOOLS_PATH, ...args], {
        cwd,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } else {
      // 使用 execSync (shell 解释的命令字符串)
      result = execSync(`node "${TOOLS_PATH}" ${args}`, {
        cwd,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    }
    return { success: true, output: result.trim() };
  } catch (err) {
    return {
      success: false,
      output: err.stdout?.toString().trim() || '',
      error: err.stderr?.toString().trim() || err.message,
    };
  }
}

function createTempProject() {
  const tmpDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'gsd-test-'));
  fs.mkdirSync(path.join(tmpDir, '.planning', 'phases'), { recursive: true });
  return tmpDir;
}

function createTempGitProject() {
  const tmpDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'gsd-test-'));
  fs.mkdirSync(path.join(tmpDir, '.planning', 'phases'), { recursive: true });
  execSync('git init', { cwd: tmpDir, stdio: 'pipe' });
  execSync('git config user.email "test@test.com"', { cwd: tmpDir, stdio: 'pipe' });
  execSync('git config user.name "Test"', { cwd: tmpDir, stdio: 'pipe' });
  // ... 创建初始提交
  return tmpDir;
}
```

**什么应该被模拟:**
- 通过 `runGsdTools()` 模拟 CLI 命令执行
- 通过 `fs.mkdtempSync()` + `fs.writeFileSync()` 模拟文件系统状态
- 通过 `execSync('git ...')` 模拟 Git 操作（在真实临时 repo 中）

**什么不应该被模拟:**
- 文件系统操作 — 使用真实的临时目录
- Git 操作 — 创建真实的 git 仓库
- JSON 解析 — 直接测试解析逻辑而无嘲笑

## 测试数据和工厂函数

**测试数据:**
位于 `tests/` 中作为辅助函数，例如 `verify.test.cjs` 中的 `validPlanContent()`:
```javascript
function validPlanContent({ wave = 1, dependsOn = '[]', autonomous = 'true', extraTasks = '' } = {}) {
  return [
    '---',
    'phase: 01-test',
    'plan: 01',
    'type: execute',
    `wave: ${wave}`,
    `depends_on: ${dependsOn}`,
    'files_modified: [some/file.ts]',
    `autonomous: ${autonomous}`,
    'must_haves:',
    '  truths:',
    '    - "something is true"',
    '---',
    '',
    '<tasks>',
    '<task type="auto">',
    '  <name>Task 1: Do something</name>',
    '  <files>some/file.ts</files>',
    '  <action>Do the thing</action>',
    '  <verify><automated>echo ok</automated></verify>',
    '  <done>Thing is done</done>',
    '</task>',
    extraTasks,
    '',
    '</tasks>',
  ].join('\n');
}
```

**位置:**
- 测试工具和工厂在 `tests/helpers.cjs` 中
- 单个测试文件内嵌数据生成函数

## 覆盖率

**要求:**
- 目标: 70% 行覆盖率
- 配置: `npm run test:coverage` 通过 `c8` 检查覆盖率
- 包含: `get-shit-done/bin/lib/*.cjs` 文件
- 排除: `tests/**` 目录

**查看覆盖率:**
```bash
npm run test:coverage
```

## 测试类型

**单元测试:**
- 范围: 测试纯函数（`extractFrontmatter`, `reconstructFrontmatter`, `comparePhaseNum`）
- 方法: 直接导入并调用函数，检查返回值
- 示例 (`frontmatter.test.cjs`):
```javascript
test('parses simple key-value pairs', () => {
  const content = '---\nname: foo\ntype: execute\n---\nbody';
  const result = extractFrontmatter(content);
  assert.strictEqual(result.name, 'foo');
  assert.strictEqual(result.type, 'execute');
});
```

**集成测试:**
- 范围: 测试完整命令通过 CLI 接口 (`runGsdTools`)
- 方法: 创建临时项目结构，执行命令，验证输出和文件系统状态
- 示例 (`phase.test.cjs`):
```javascript
test('lists phase directories sorted numerically', () => {
  fs.mkdirSync(path.join(tmpDir, '.planning', 'phases', '10-final'), { recursive: true });
  fs.mkdirSync(path.join(tmpDir, '.planning', 'phases', '02-api'), { recursive: true });
  fs.mkdirSync(path.join(tmpDir, '.planning', 'phases', '01-foundation'), { recursive: true });

  const result = runGsdTools('phases list', tmpDir);
  assert.ok(result.success);
  const output = JSON.parse(result.output);
  assert.deepStrictEqual(output.directories, ['01-foundation', '02-api', '10-final']);
});
```

**端到端测试:**
- 范围: 测试复杂的工作流（未显式标记，但 `init.test.cjs`, `copilot-install.test.cjs` 是完整场景）
- 方法: 设置完整的初始化项目，执行多个命令
- 示例 (`init.test.cjs`): 初始化配置，验证创建的文件和内容

## 常见模式

**异步测试:**
- 不使用 async/await（所有代码为同步）
- 使用 `execSync` 和 `execFileSync` 执行外部命令
- 等待完成通过同步阻塞实现

**错误测试:**
```javascript
test('missing STATE.md returns error', () => {
  const result = runGsdTools('state-snapshot', tmpDir);
  assert.ok(result.success); // 命令本身成功（不抛出异常）

  const output = JSON.parse(result.output);
  assert.strictEqual(output.error, 'STATE.md not found'); // 但输出指示错误
});

test('no-command invocation prints usage and exits non-zero', () => {
  const result = runGsdTools('', tmpDir);
  assert.strictEqual(result.success, false, 'Should exit non-zero');
  assert.ok(result.error.includes('Usage:'));
});
```

**回归测试:**
- 用 `REG-##` 标记已知 bug，例如 `REG-01: loadConfig model_overrides`
- 包含记录当前（有时是错误的）行为，文档说明预期修复
- 示例 (`frontmatter.test.cjs`):
```javascript
test('handles quoted commas in inline arrays — REG-04 known limitation', () => {
  const content = '---\nkey: ["a, b", c]\n---\n';
  const result = extractFrontmatter(content);
  // REG-04: 当前行为: 分割所有逗号 → ["a", "b", "c"]
  // 预期正确行为: ["a, b", "c"]
  // 此测试记录当前的有缺陷的行为
  assert.ok(result.key.length > 2, 'REG-04: 分割产生比预期更多的项目');
});
```

---

*测试分析: 2026-03-16*
