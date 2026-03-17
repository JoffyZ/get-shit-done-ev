# 代码库关注事项

**分析日期：** 2026-03-16

## 技术债务

### 1. 大型单体模块缺乏功能分离

**问题：** 核心模块超过 700 行代码，复杂度高
- `get-shit-done/bin/lib/phase.cjs` - 908 行
- `get-shit-done/bin/lib/verify.cjs` - 826 行
- `get-shit-done/bin/lib/state.cjs` - 721 行
- `get-shit-done/bin/lib/init.cjs` - 710 行
- `get-shit-done/bin/lib/commands.cjs` - 666 行

**文件：** `get-shit-done/bin/lib/phase.cjs`, `get-shit-done/bin/lib/verify.cjs`, `get-shit-done/bin/lib/state.cjs`

**影响：**
- 维护成本高，修改一个功能可能影响多个不相关的操作
- 测试覆盖困难，需要复杂的 mock 设置
- 新开发者上手困难

**修复方案：**
- 将 `phase.cjs` 拆分为：`phase-crud.cjs`（创建、列出、查找）、`phase-lifecycle.cjs`（完成、删除、重编号）
- 将 `state.cjs` 拆分为：`state-io.cjs`（读写）、`state-parser.cjs`（字段提取）、`state-engine.cjs`（进度管理）
- 提取通用的 markdown 操作到 `markdown-utils.cjs`

### 2. 异常处理普遍忽略错误信息

**问题：** 47 处 `} catch {}` 空白 catch 块，没有任何错误处理
- `get-shit-done/bin/lib/phase.cjs` 第 402, 539 行
- `get-shit-done/bin/lib/state.cjs` 第 29, 105, 116, 149, 177, 577, 612 行
- `get-shit-done/bin/lib/commands.cjs` 第 73, 75, 122, 180, 414, 569, 584, 594 行
- `get-shit-done/bin/lib/verify.cjs` 多处

**文件：** `get-shit-done/bin/lib/phase.cjs`, `get-shit-done/bin/lib/state.cjs`, `get-shit-done/bin/lib/commands.cjs`, `get-shit-done/bin/lib/verify.cjs`

**影响：**
- 调试困难，错误条件下行为不可预测
- 用户无法知道什么时候失败了以及为什么
- 日志中看不到真正的问题，只看到静默的失败

**修复方案：**
- 对于预期的错误（文件不存在等），明确记录或返回结构化的错误响应
- 对于意外的异常，至少输出到 stderr 或添加到调试日志
- 使用结构化的错误对象：`{ error: true, code: 'E001', message: '...' }`

### 3. 缺乏统一的日志记录机制

**问题：** 没有日志框架，调试需要追踪代码执行路径
- `get-shit-done/bin/lib/core.cjs` 第 56-59 行：只有 `error()` 函数，没有 debug/info/warn 等级
- 没有中央日志汇聚点

**文件：** `get-shit-done/bin/lib/core.cjs`, `get-shit-done/bin/lib/commands.cjs`

**影响：**
- 用户报告问题时难以收集足够的上下文信息
- 开发者无法追踪执行流程，特别是在 hook 和背景服务中
- 无法区分不同严重级别的问题

**修复方案：**
- 实现轻量级日志抽象：`logger.debug()`, `logger.info()`, `logger.warn()`, `logger.error()`
- 添加可配置的日志级别（开发/生产）
- 当 `GSD_DEBUG=1` 时输出详细日志到 `.planning/.gsd-debug.log`

### 4. 正则表达式依赖人工转义

**问题：** 多处正则表达式使用用户输入或数据，需要手动调用 `escapeRegex()`
- `get-shit-done/bin/lib/phase.cjs` 第 606 行：`const targetEscaped = escapeRegex(targetPhase)`
- `get-shit-done/bin/lib/phase.cjs` 第 382-384 行：多个动态正则表达式构建
- `get-shit-done/bin/lib/state.cjs` 第 128, 131 行

**文件：** `get-shit-done/bin/lib/phase.cjs`, `get-shit-done/bin/lib/state.cjs`, `get-shit-done/bin/lib/verify.cjs`

**影响：**
- 忘记转义会导致 ReDoS（正则表达式拒绝服务）攻击风险
- 阶段名称包含特殊字符时操作失败
- 难以维护，容易引入 bug

**修复方案：**
- 创建 `regexUtils.cjs` 模块：
  - `safeRegExp(pattern, input, flags)` - 自动转义用户输入
  - `escapeAll(inputs)` - 批量转义
- 使用字符串匹配代替正则表达式，当可能时
- 添加单元测试，验证特殊字符的处理

### 5. 配置合并逻辑复杂且脆弱

**问题：** `get-shit-done/bin/lib/core.cjs` 第 71-133 行的 `loadConfig()` 函数
- 支持多种配置格式（顶层、嵌套、已弃用的 `depth` 字段）
- 回退到默认值的逻辑分散
- 迁移代码（第 92-98 行）在加载时自动重写配置文件

**文件：** `get-shit-done/bin/lib/core.cjs`

**影响：**
- 配置不一致性难以调试
- 自动迁移可能破坏用户的自定义设置
- 新增配置字段需要更新多个位置的默认值和回退逻辑

**修复方案：**
- 创建 `config-schema.json`，定义所有有效字段、类型和默认值
- 实现严格的配置验证：`validateConfig(parsed) -> { valid: bool, errors: string[] }`
- 将迁移从加载时移到显式的迁移命令：`/gsd:migrate-config`
- 配置版本化，跟踪每个配置的模式版本

## 已知 Bug

### 1. 非 ASCII 阶段名称处理不当

**症状：** 中文或特殊字符的阶段名称导致目录创建失败或文件操作失败
- 文件名可能包含无效的文件系统字符
- 正则表达式匹配失败

**文件：** `get-shit-done/bin/lib/phase.cjs` 第 406 行 (`dirName = ${decimalPhase}-${slug}`)

**触发方式：** 创建名称为"功能设计"或"集成测试"的阶段

**解决方案：**
- 在生成目录名前，对阶段名称进行规范化：`normalizeForFilesystem(name)`
- 验证生成的目录名称对所有平台（Windows/Mac/Linux）有效
- 添加集成测试，测试多语言阶段名称

### 2. 空目录与 .gitkeep 问题

**症状：** 新建阶段后，git 不追踪空目录，导致克隆后 `.planning/phases/NN-name/` 丢失
- 阶段目录创建时添加 `.gitkeep` （第 340, 411 行）
- 但删除阶段时可能忘记删除 `.gitkeep` 或其他隐藏文件
- 如果用户手动删除 `.gitkeep`，则目录会从 git 中消失

**文件：** `get-shit-done/bin/lib/phase.cjs` 第 338-341 行

**触发方式：** 创建空阶段，提交到 git，克隆到新机器，阶段目录消失

**解决方案：**
- 改用 `.gitkeep` 符号文件，但在删除阶段时确保删除
- 或使用 `.gitignore` 条目来强制 git 追踪空目录
- 添加验证：`verify-phase-directories` 检查所有定义的阶段在磁盘上存在

### 3. STATE.md 与 ROADMAP.md 同步问题

**症状：** `phase-complete` 命令更新 STATE.md 和 ROADMAP.md，但两者之间的数据可能不一致
- 文件：`get-shit-done/bin/lib/phase.cjs` 第 701-896 行
- 如果 ROADMAP.md 有正在规划但未执行的阶段，STATE.md 可能指向不存在的下一阶段

**触发方式：**
1. 在 ROADMAP.md 中添加第 05 阶段定义，但不创建目录
2. 执行第 04 阶段到完成
3. `phase-complete 04` 查询 ROADMAP.md 找下一阶段
4. STATE.md 指向第 05 阶段，但 `.planning/phases/05-*/` 不存在

**解决方案：**
- 实现双向同步验证：`validate-roadmap-state-sync`
- 当更新任一文件时，验证另一个文件的一致性
- 在 `phase-complete` 中检查下一阶段是否在磁盘上
- 添加修复命令：`/gsd:repair-phase-sync`

## 安全考虑

### 1. execSync 调用的命令注入风险

**风险：** 使用 `execSync()` 运行 git 和 find 命令，不当的参数清理会导致命令注入
- `get-shit-done/bin/lib/core.cjs` 第 152-157 行（git check-ignore）
- `get-shit-done/bin/lib/core.cjs` 第 156-169 行（execGit）
- `get-shit-done/bin/lib/init.cjs` 中的 find 命令（第 581 行左右）

**文件：** `get-shit-done/bin/lib/core.cjs`, `get-shit-done/bin/lib/init.cjs`

**当前防御：** 基础的参数清理（`replace(/[^a-zA-Z0-9._\-/]/g, '')` 在 `isGitIgnored` 中）

**不充分原因：**
- 清理规则太宽松，允许某些特殊字符
- 不是所有的 execSync 调用都有清理
- 白名单方法（只允许特定字符）总是优于黑名单

**修复方案：**
- 对所有 execSync 调用使用数组形式而非字符串（当 node 版本允许时）
- 实现严格的输入验证：`validateGitArg(arg)` 只允许 alphanumeric + `-._/`
- 不使用 execSync，改用 Node.js 原生 API（`simpleGit` 库）
- 添加集成测试，尝试注入恶意命令

### 2. 文件路径遍历漏洞

**风险：** 从 frontmatter 或用户输入中读取的文件路径可能包含 `../`，导致读取项目外的文件

**文件：**
- `get-shit-done/bin/lib/verify.cjs` 第 215-257 行（`cmdVerifyReferences`）
- `get-shit-done/bin/lib/state.cjs` 第 113-118 行（`readTextArgOrFile`）

**当前防御：** 基础的路径解析（`path.join()` 和 `path.isAbsolute()`）

**不充分原因：**
- `path.join(cwd, userInput)` 仍然允许 `../../../etc/passwd`
- 没有验证最终路径在 `cwd` 内

**修复方案：**
- 创建 `validatePath(userPath, allowedRoot)` 函数：
  ```javascript
  function validatePath(userPath, allowedRoot) {
    const resolved = path.resolve(allowedRoot, userPath);
    if (!resolved.startsWith(path.resolve(allowedRoot))) {
      throw new Error('Path traversal detected');
    }
    return resolved;
  }
  ```
- 对所有用户提供的路径应用此检查
- 单元测试：尝试 `../../../etc/passwd`, `/..//..//etc/passwd` 等

### 3. JSON 解析错误处理不当

**风险：** `JSON.parse()` 在无效 JSON 上抛出异常，某些 catch 块为空

**文件：**
- `get-shit-done/bin/lib/core.cjs` 第 88-90 行
- `get-shit-done/bin/lib/config.cjs` 第 106-108 行
- `get-shit-done/bin/lib/verify.cjs` 第 606-618 行

**当前行为：** 返回默认值或无声失败

**风险：**
- 破损的 config.json 导致不可预测的行为
- 用户无法被告知配置文件有问题
- 安全相关的配置被忽略

**修复方案：**
- 对 JSON.parse 使用 try-catch，并记录具体错误
- 实现 `safeJsonParse(text, fallback)` 函数
- 针对 config.json 的 JSON 解析错误，输出明确的错误消息
- 验证 JSON 结构：`validateConfigJson(parsed)`

## 性能瓶颈

### 1. 阶段列表操作的二次方复杂度

**问题：** `cmdPhasesList` 和相关命令对每个阶段目录进行多次扫描
- `get-shit-done/bin/lib/phase.cjs` 第 26-49 行
- 逐个加载阶段信息，执行多个 IO 操作

**文件：** `get-shit-done/bin/lib/phase.cjs`

**症状：**
- 100+ 个阶段的项目中，列表操作明显延迟
- 每个 IO 操作阻塞主线程

**改进方案：**
- 实现缓存：`phase-cache.json` 存储阶段元数据
- 使用 `fs.promises` 并行读取多个目录
- 添加 `--use-cache` 标志，跳过 ROADMAP 验证以加快速度
- 分页：`--limit N --offset N`

### 2. 大型 ROADMAP.md 文件的正则表达式处理

**问题：** `phase-complete` 中的正则替换操作对大型文件性能差
- `get-shit-done/bin/lib/phase.cjs` 第 603-664 行：多个 `.replace()` 调用
- 每个 replace 都扫描整个文件内容

**文件：** `get-shit-done/bin/lib/phase.cjs`

**症状：** 完成阶段时命令延迟（如果 ROADMAP.md > 100KB）

**改进方案：**
- 将 ROADMAP.md 解析为 AST 而不是字符串操作
- 使用单次扫描更新多个字段
- 实现增量更新：只修改相关部分

### 3. 验证命令的重复文件 IO

**问题：** `cmdValidateHealth` 和 `cmdValidateConsistency` 多次读取相同的文件
- `get-shit-done/bin/lib/verify.cjs` 第 397-515 行

**文件：** `get-shit-done/bin/lib/verify.cjs`

**症状：** `/gsd:health` 命令在大型项目中运行缓慢

**改进方案：**
- 缓存文件内容：`{ filePath: content }` 映射
- 合并多个 IO 操作为单次扫描
- 将验证逻辑分解为可缓存的单元

## 脆弱区域

### 1. 阶段编号重命名逻辑

**文件：** `get-shit-done/bin/lib/phase.cjs` 第 487-600 行（`cmdPhaseRemove` 中的重编号）

**为什么脆弱：**
- 支持多种格式：整数、小数、带字母后缀 (`05A`, `05.1`, `05A.3`)
- 正则表达式复杂，分支众多
- 需要更新目录名和文件名中的所有前缀

**更改风险：**
- 修改重编号逻辑可能导致阶段混淆或丢失
- 需要在磁盘操作前充分验证

**安全修改：**
1. 添加 `--dry-run` 标志，显示将执行的操作
2. 创建备份：`mv .planning/phases .planning/phases.backup-{timestamp}`
3. 详细日志记录每个文件操作
4. 添加恢复命令：`/gsd:restore-phase-backup`
5. 编写全面的测试用例覆盖所有数字格式组合

### 2. 前端物质 (Frontmatter) 解析和生成

**文件：** `get-shit-done/bin/lib/frontmatter.cjs` （299 行）

**为什么脆弱：**
- 支持多种格式：YAML、JSON、自由形式
- 正则表达式用于提取字段（第 196-199 行的 `extractObjective`）
- 缺少 YAML 验证库，手写解析

**更改风险：**
- 生成的前端物质可能无效或丢失信息
- 提取逻辑可能遗漏某些字段或解析错误

**安全修改：**
1. 使用 YAML 库（如 `js-yaml`）而非手写正则表达式
2. 实现 frontmatter 验证：`validateFrontmatter(fm)` 检查必需字段
3. 添加测试，使用真实的计划文件进行往返测试
4. 在生成 frontmatter 时进行规范化和排序

### 3. 配置迁移机制

**文件：** `get-shit-done/bin/lib/core.cjs` 第 92-98 行

**为什么脆弱：**
- 自动修改用户的配置文件，没有备份
- 如果迁移逻辑有 bug，可能导致配置数据丢失
- 向后兼容性和向前兼容性都需要考虑

**更改风险：**
- 添加新的弃用字段迁移可能与现有逻辑冲突
- 如果多个版本之间都有迁移，链式迁移可能出错

**安全修改：**
1. 创建显式的迁移脚本而非自动迁移
2. 备份原始配置：`config.json.v{version}-backup`
3. 实现版本化的迁移：`migrations/v1-to-v2.js`
4. 测试升级路径：`v1 -> v2`, `v1 -> v3`（跳过 v2）等
5. 提供回滚命令：`/gsd:rollback-config`

## 测试覆盖缺口

### 1. 边界情况和错误条件

**未测试：**
- 空的 `.planning/phases/` 目录（有 `.gitkeep` 但无实际目录）
- 格式错误的阶段目录名（不符合 `NN-name` 模式）
- 损坏的 YAML frontmatter 在计划文件中
- 循环依赖：Phase 2 依赖 Phase 3，Phase 3 依赖 Phase 2

**文件：** `tests/` 目录中缺少上述场景

**修复方案：**
- 添加 `edge-cases.test.cjs`，测试畸形输入
- 添加 `error-recovery.test.cjs`，验证错误处理
- 使用 Fixtures 目录创建破损的项目结构进行测试

### 2. 跨平台兼容性（Windows）

**已知缺陷：**
- 路径分隔符处理（`\` vs `/`）
- 文件系统对大小写的处理差异
- 特殊字符在文件名中的限制

**文件：** 无专门的 Windows 测试

**修复方案：**
- 在 CI 中添加 Windows 测试矩阵（GitHub Actions 已有，但可增强）
- 使用 `path.sep` 和 `toPosixPath()` 一致性检查
- 创建 `windows-compat.test.cjs`

### 3. 集成测试

**缺陷：**
- 大多数测试是单元测试，模拟文件系统
- 没有真实的端到端测试（创建项目 -> 创建阶段 -> 规划 -> 执行 -> 完成）
- 没有多个里程碑的测试场景

**修复方案：**
- 添加 `integration.test.cjs`，使用真实的临时目录
- 测试完整的工作流：`new-project -> new-milestone -> plan-phase -> execute`
- 测试迁移场景：从旧 GSD 版本升级

## 依赖项风险

### 1. 没有依赖项

**优点：** 零依赖，易于安装和分发
**缺点：**
- 重新实现标准库功能（YAML 解析、正则表达式等）
- 无法从社区维护的库获得安全补丁
- 对 Node.js 版本的依赖（engines: ">=16.7.0"）

**文件：** `package.json`

**改进方案：**
- 评估小型但关键的依赖：
  - `js-yaml` （YAML 解析）- 1KB，广泛使用
  - `path-to-regexp` （路径验证）- 5KB
  - `debug` （日志记录）- 3KB
- 保持对少量精选依赖的警惕，定期审计

### 2. Node.js 版本支持

**当前：** `engines: ">=16.7.0"`（2021 年发布）

**风险：**
- Node 16  已过期，可能缺少安全补丁
- 一些新的 API 在 Node 18+ 中可用（`fs.promises` 完全支持等）

**改进方案：**
- 升级最低版本要求到 `18.0.0`（LTS，2022）
- 利用 `fs.promises` 的完整异步 API
- 移除对废弃 API 的依赖

## 特性缺陷

### 1. 里程碑切换时的研究重置问题

**问题：** `/gsd:new-milestone` 会重置 `workflow.research` 配置（已在 v1.22.4 中修复）

**文件：** `get-shit-done/bin/lib/config.cjs`

**状态：** 已知已修复，但过去的配置可能受到影响

**验证方案：**
- 添加 `/gsd:migrate-config` 检查用户配置中的孤立 `research` 字段
- 记录迁移操作以便审计

### 2. 计划检查器的跳过条件不清楚

**问题：** 某些阶段的 plan-check 可能被跳过，但用户不知道为什么

**文件：** `agents/gsd-plan-checker/...`（在 agents 目录中）

**症状：** 用户报告"计划检查没有运行"但没有错误消息

**改进方案：**
- 添加详细的跳过理由日志
- 在 STATE.md 中记录跳过的原因
- 添加命令 `/gsd:force-plan-check` 绕过跳过条件

## 可扩展性限制

### 1. 项目缩放限制

**已知限制：**
- 数百个阶段会导致目录列表和搜索变慢
- ROADMAP.md 文件超过 500KB 时，正则表达式操作延迟明显
- 搜索 gitignored 文件时，大型 node_modules 会导致超时

**文件：** 多个

**改进方案：**
1. 实现分片：将大型项目分解为多个里程碑
2. 缓存机制：`phase-index.json` 定期更新
3. 使用 ignore 库而非 git 命令处理 .gitignore
4. 添加 `--fast` 标志，跳过慢速验证

### 2. 并发执行限制

**问题：** 阶段的并行化仅在 `parallelization: true` 时启用，但没有细颗度控制

**文件：** `get-shit-done/bin/lib/core.cjs` 第 108-113 行

**改进方案：**
- 支持并发阶段数的配置：`parallelization: { max_concurrent: 3 }`
- 更好的错误处理和汇聚来自多个阶段的结果

---

*关注事项审计：2026-03-16*
