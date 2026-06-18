# 共享项目记忆（cross-rein）

写 reins 协作时沉淀下来的"非显然但易忘"的发现。新增条目请注明日期。

## 2026-06-18（bootstrap）

- **项目类型**：纯前端 React + TS + Vite SPA，零后端 / 零网络请求，所有逻辑在浏览器跑
- **包管理器**：pnpm（注意 `pnpm-workspace.yaml` 里 `allowBuilds.esbuild: true` 是为了 esbuild 在 macOS 上能编译，新人别删）
- **测试框架**：仓库当前未引入 Vitest / Playwright；新加测试需走编排者评估（`tester` 目前只跑 check/lint/build + 手测冒烟）
- **化学逻辑契约**：颜色优先级 `pH<6.5` 永远覆盖体积逻辑；改阈值必须同步 `engine/` + `tailwind.config.js` + `需求.md`
- **半滴精度契约**：Stage 1 终点 `[19.95, 20.5)` 是 0.05 mL 步长落点的范围，不要随手改
- **Trae 角标**：`vite-plugin-trae-solo-badge` 在生产构建右下角加 Trae 角标（prodOnly），不需要时改 `vite.config.ts`
- **Git 状态**：仓库**未初始化 git**，首次 commit 由作者触发，agent 工作流不要自动 commit

## 2026-06-18（作者身份 + 长期目标）

- **作者**：楼楼大王本人；项目目标是帮朋友复盘真实实验里踩过的坑、做教学训练，不是单纯 demo
- **长期工作模式**：作者明确要求**持续调研**——化学背景知识、实验操作规范、教学设计方法都要定期补；不只是"修 bug"，而是要主动找能帮朋友理解得更好的内容加进来
- **研究方向（待作者选择首批 thread）**：候选——(a) EDTA 络合滴定 / 铬黑T 指示剂的化学背景深化；(b) 常见学生操作错误清单与教学引导；(c) 真实实验操作规范（半滴控制、滴定管读数、终点判断）；(d) 计算公式的逐步推导与教学化呈现
- **下次改进前先问作者**：要往哪个方向推进，避免一次性铺开

## 2026-06-18（Thread A 完成 — 化学背景验证与深化）

- **交付物**：`.harness/docs/chem-background.md`（完整研究文档）
- **结论**：
  1. Stage 2"缓冲液失效→越滴越粉"机制真实——pH<6.3 时铬黑 T 游离态本身变紫红，端点不可见；模拟器 6.5 阈值偏保守
  2. pH 公式 `max(3.5, 7 - log10(v*10+1)*2.5)` 是教学曲线，真实化学到 v=20mL 时 pH ≈ 1.3（钳在 3.5 是视觉可读性优先）
  3. 🚨 **Stage 2 重大发现**：EDTA 不能直接滴定 SO₄²⁻。真实方法是先用 BaCl₂ 沉淀、再 EDTA 反滴过量 Ba²⁺（SL 85-1994 国标）。模拟器做了重大简化
  4. 模拟器训练目标（缓冲失效、数据继承、过量滴定）三件套已完整覆盖；其它学生错误（指示剂封闭、视差、未润洗等）可作 Thread B 素材
- **待作者决策**：Stage 2 文字要不要改？三选一——A 加说明；B 改成"ZnSO₄ 中 Zn²⁺"（化学正确）；C 维持现状
- **下次推进**：等作者对 §6.4 做选择，再决定 Thread B/C/D 哪个先做

## 2026-06-18（选项 B 落地 + Thread B 完成）

- **代码改动**：
  - `需求.md`：Stage 2 描述改为"ZnSO₄ 试样中 Zn²⁺ 含量测定"（含修订说明，引用 chem-background.md §6）
  - `src/pages/Simulator.tsx`：锥瓶标签 "硫酸钠" → "ZnSO₄ 溶液"
  - `src/components/modals/Stage2InputModal.tsx`：Na₂SO₄ 142.04 → ZnSO₄ 161.47
  - `src/components/OnboardingBanner.tsx`：Stage 2 banner 更新
  - `src/engine/stages.ts`：注释清理，明确校验策略
  - `AGENTS.md`：化学场景说明追加
- **验证**：`pnpm check` 通过；`pnpm build` 通过；`pnpm lint` 仅 1 个 PHChart.tsx pre-existing `any` 错误（不在本 task 范围）
- **Thread B 交付物**：`.harness/docs/student-errors.md`
- **Thread B 落地建议**（**待作者决策**）：
  - A 方案（推荐）：Stage 1 入口加"操作规范 onboarding 卡片"（润洗 / 平视 / 半滴 / 摇瓶）
  - B 方案（推荐）：通关 ResultModal 加"避坑清单"区块
  - C 方案（不做）：Stage 3"操作挑战赛"——复杂度高，性价比低
- **下次推进**：等作者对 A/B 方案拍板，UI 改动属于 ui-expert rein 的活

## 2026-06-18（Thread B A+B 实施完毕）

- **新增文件**：
  - `src/components/OperationGuideCard.tsx`：Stage 1 入口操作规范卡片，默认折叠，4 条规则（润洗 / 平视 / 半滴 / 摇瓶）
- **修改文件**：
  - `src/pages/Simulator.tsx`：挂载 OperationGuideCard（在 OnboardingBanner 下方）
  - `src/components/modals/ResultModal.tsx`：在"做对了什么"区块下方追加"避坑清单"区块，7 条常见错误对照（润洗、误润洗、半滴、视差、缓冲液、Fe³⁺ 封闭、用错浓度）
- **验证**：`pnpm check` ✅ / `pnpm build` ✅ / `pnpm lint` 仅 PHChart.tsx pre-existing 1 个错（未触碰）
- **设计哲学落地**：教学工具不是"找茬游戏"，每条错误都给"原因 + 后果"三件套；用户能记住为什么不能犯