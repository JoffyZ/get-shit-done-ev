# 需求：GSD Studio

**定义时间：** 2026-03-16
**核心价值：** 让有想法和意识的创作者，无需从零实现系统化的执行框架，就能将 GSD 的高效体验带到任何工作场景

## v1 需求

### 核心引擎（Core Engine）

- [ ] **CORE-01**: 提取编排引擎到独立模块（questioning → research → roadmap → execute → verify）
- [ ] **CORE-02**: 提取状态管理系统（STATE.md、ROADMAP.md、检查点机制）
- [ ] **CORE-03**: 提取 Agent 调度系统（Task() 机制、Agent 生命周期管理）
- [ ] **CORE-04**: 核心引擎与场景包解耦（通过 manifest.json 接口）

### 场景包系统（Scenario System）

- [ ] **SCEN-01**: 定义场景包目录结构（workflows/、agents/、templates/）
- [ ] **SCEN-02**: 定义 manifest.json 规范（入口命令、核心概念、Agent 映射）
- [ ] **SCEN-03**: 实现场景包加载机制（读取 manifest、注册命令）
- [ ] **SCEN-04**: 将现有软件工程逻辑包装为 scenarios/software-eng/
- [ ] **SCEN-05**: 场景包热切换支持（不需要重启工具）

### Agent 创造场景（Agent Creator）

- [ ] **AGENT-01**: 设计 Agent 创造的核心流程（设计 → 编码 → 测试 → 部署）
- [ ] **AGENT-02**: 创建 /gsd:new-agent 命令（questioning 收集 Agent 需求）
- [ ] **AGENT-03**: 实现 agent-designer Agent（生成 Agent 规格文档）
- [ ] **AGENT-04**: 实现 agent-coder Agent（根据规格生成 Agent 代码）
- [ ] **AGENT-05**: 实现 agent-tester Agent（测试 Agent 功能）
- [ ] **AGENT-06**: 创建 AGENT-SPEC.md 模板（Agent 规格文档）
- [ ] **AGENT-07**: 创建 AGENT-ROADMAP.md 模板（Agent 开发路线图）

### 场景创造器（Scenario Generator）

- [ ] **GEN-01**: 设计场景创造流程（questioning → 流程映射 → 生成代码）
- [ ] **GEN-02**: 创建 /gsd:new-scenario 命令（引导用户定义场景）
- [ ] **GEN-03**: 实现流程映射逻辑（用户描述 → GSD 概念映射）
- [ ] **GEN-04**: 实现 Agent 识别机制（从流程推断需要的 Agent 角色）
- [ ] **GEN-05**: 实现代码生成器（生成 manifest.json、workflows、agents、templates）
- [ ] **GEN-06**: 创建场景包模板库（供生成器参考的最佳实践）

### 跨工具适配（Cross-tool Adapter）

- [ ] **ADPT-01**: 定义适配器接口规范（install()、export()、transform()）
- [ ] **ADPT-02**: 实现 Claude Code 适配器（生成 .claude/commands/）
- [ ] **ADPT-03**: 实现 OpenClaw 适配器（生成 claw.config.json）
- [ ] **ADPT-04**: 在 manifest.json 中配置适配器映射
- [ ] **ADPT-05**: 实现 /gsd:install-scenario 命令（安装场景包到目标平台）

### 项目管理（Project Management）

- [ ] **PROJ-01**: 建立 Git 三分支策略（upstream-sync、stable、studio-dev）
- [ ] **PROJ-02**: 配置上游同步自动化（定期检查上游更新）
- [ ] **PROJ-03**: 创建上游变更审查流程（手动 cherry-pick）
- [ ] **PROJ-04**: 编写完整文档（README、场景包开发指南、适配器开发指南）
- [ ] **PROJ-05**: 创建示例项目（使用 Agent 创造场景的演示）

## v2 需求（延后）

### 场景包生态

- **ECO-01**: 场景包市场/仓库（社区贡献场景包）
- **ECO-02**: 场景包版本管理（依赖、兼容性）
- **ECO-03**: 场景包测试框架（自动化测试场景包质量）

### 可视化工具

- **VIS-01**: 场景编辑器 UI（拖拽式创建场景）
- **VIS-02**: 工作流可视化（流程图展示）
- **VIS-03**: Agent 协作图（展示 Agent 间的调用关系）

### 高级适配

- **ADPT-06**: Cursor 适配器（生成 .cursorrules）
- **ADPT-07**: Aider 适配器（生成 aider 配置）
- **ADPT-08**: 自定义工具适配器开发框架

## 范围外（Out of Scope）

| 功能 | 原因 |
|------|------|
| 改动现有 GSD 软件工程场景的核心逻辑 | 保持向后兼容，不影响现有用户 |
| 支持非 AI Agent 工具 | v1 专注于 AI Agent 生态，传统工具留待 v2 |
| 在线协作编辑 | 单用户场景优先，协作功能复杂度高 |
| 移动端支持 | 开发工作流主要在桌面环境 |
| 场景包加密/付费机制 | 开源优先，商业化留待未来考虑 |

## 可追溯性

待路线图创建后填充。

| 需求 | 阶段 | 状态 |
|------|------|------|
| ... | ... | 待定 |

**覆盖率：**
- v1 需求：32 total
- 已映射到阶段：0
- 未映射：32 ⚠️

---
*需求定义：2026-03-16*
*最后更新：2026-03-16 初始定义后*
