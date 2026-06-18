# AGENTS.md

滴定系统遥测与失效模拟器 (Titration System Failure Simulator) — 教学向单页应用，作者楼楼大王，目标用户是想真正搞懂 EDTA 络合滴定、复盘自己真实实验踩坑经历的学习者。包含两关：Stage 1 (0.05 mol/L EDTA 标定) 与 Stage 2 (硫酸钠质量分数测定，要求玩家把 Stage 1 标定出的真实浓度带过来)。**这是长期教学项目，不是单次 demo**——作者会持续要求补充化学背景、实验规范、教学设计方面的内容。

## 项目目标与边界

- **核心受众**：化学初学者（朋友），目的是让他们**真的学到东西**，不是看个乐
- **两关卡隐含的训练目标**（来自 `需求.md` 末尾"系统工程思考"）：
  1. 感受"手抖多加一滴"导致 Stage 1 数据报废
  2. 感受"忘了加缓冲液"导致 Stage 2 越滴越粉
  3. 感受"算错数据源"导致最终成绩清零
- **化学场景（2026-06-18 修订）**：Stage 2 改为测定 **0.5000 g 含 ZnSO₄ 的未知固体试样中 Zn²⁺ 含量**（原 PRD 写的"硫酸根"在真实化学里不成立，EDTA 不直接滴定 SO₄²⁻）。详细论证见 `.harness/docs/chem-background.md` §6
- **教学方向扩展**（待作者选首批 thread）：化学背景深化 / 学生常见错误 / 真实实验操作规范 / 公式推导教学化——沉淀到 `.harness/docs/`

## Setup commands

- 安装依赖: `pnpm install`
- 启动开发: `pnpm dev` （Vite + HMR，默认 5173）
- 生产构建: `pnpm build` （`tsc -b` 先类型检查，再 `vite build`）
- 类型检查: `pnpm check` （仅 `tsc -b --noEmit`，比 build 更快）
- Lint:     `pnpm lint` （ESLint flat config）
- 预览构建产物: `pnpm preview`
- 包管理器: **pnpm**（仓库含 `pnpm-lock.yaml` 与 `pnpm-workspace.yaml`；改依赖时不要顺手用 npm/yarn 装，会污染锁文件）

## Project layout

- `src/engine/` — 纯函数物理引擎与校验逻辑（无 React 依赖）
  - `physics.ts` pH / 颜色 / 状态判定
  - `stages.ts` 两关的输入校验
  - `random.ts` Stage 1 隐藏浓度的随机生成
- `src/store/simStore.ts` — Zustand 全局 store，所有派生量（pH / color / status / history）通过 `recalc()` 同步
- `src/components/` — UI 组件（`ControlPanel` / `FlaskVisual` / `PHChart` / `TelemetryCards` / `StatusText` / `OnboardingBanner` / `StageProgress` / `ToggleSwitch`）
- `src/components/modals/` — Stage 1 输入 / Stage 2 输入 / 最终结果三个模态框
- `src/pages/Simulator.tsx` — 单页面主页（顶栏 + 三栏布局 + 底栏 + 弹层）
- `src/types/index.ts` — 全局类型 + 颜色常量（`WINE_RED` / `HOT_PINK` / `DEEP_BLUE` 等）
- `src/lib/utils.ts` — `cn()` className 合并
- `src/index.css` — Tailwind 入口 + CRT 扫描线等自定义样式
- `public/favicon.svg` — 自定义 favicon
- `tailwind.config.js` — 自定义调色板（`ink-*` / `led-*` / `indicator-*` / `textc-*`）和阴影/动画
- `vite.config.ts` — Vite 配置（含 `vite-plugin-trae-solo-badge`）
- `需求.md` — 原始 PRD（含"双关卡"补充需求），是所有逻辑的源头

## Code style

- TypeScript（`tsconfig.json` 已设 `@/*` → `src/*` 路径别名，使用 `vite-tsconfig-paths` 配合）
- React 18 + 函数组件 + Hooks
- Zustand 用于全局状态；组件内 `useMemo` / `useEffect` 仅做局部派生
- Tailwind 调色板统一用 `ink-*` / `led-*` / `indicator-*` 等语义类，不要硬编码 hex
- 颜色常量集中在 `src/types/index.ts`，新增色值先加常量再引用
- 物理/校验逻辑保持纯函数（`engine/` 下零 React 依赖），方便单测
- ESLint flat config 已配置 `react-hooks` 与 `react-refresh`；提交前跑 `pnpm lint`
- `tsconfig.json` 中 `strict: false`（项目当前未开启严格模式，新增公共 API 时**不要**顺手收紧）

## Testing instructions

- 当前仓库**没有单测/E2E 框架**（未引入 Vitest / Playwright）。新增纯函数（`engine/`）时建议手写 `*.test.ts` 并配 Vitest——若要引入，请走 `.harness/` 团队评估。
- 冒烟验证流程（PR 前必跑）：
  1. `pnpm install` （如有 lock 变更）
  2. `pnpm check` （类型零错误）
  3. `pnpm lint` （无新增 error；warning 可接受）
  4. `pnpm build` （生产构建通过）
  5. `pnpm dev` 后手工验证 Stage 1 / Stage 2 双关卡流程：
     - Stage 1：关闭缓冲开关无效（已隐藏），拖滑块过 20.5 mL 应触发"过量"提示并允许 Reset
     - Stage 1 终点：19.95 ~ 20.0 mL 区间显示纯蓝并弹输入框
     - Stage 2：默认缓冲关闭，pH 跌破 6.5 后锁死粉红
     - Stage 2：开启缓冲后顺利到达蓝色终点并弹输入框
     - 最终结果：弹"通关"模态框

## PR & commit conventions

- 当前仓库**未初始化 git**；首次 commit 由作者触发（不要在 agent 工作流里自动 `git commit`）
- 建议 commit 风格：`feat:` / `fix:` / `refactor:` / `docs:` / `chore:`（不强制 conventional commits）
- 改动范围控制：物理公式 / 阈值改动必须在 `engine/physics.ts` 与 `engine/stages.ts` 中成对更新，并同步 `需求.md` 里的公式说明
- 颜色 / 阈值常量改动要同时检查 `tailwind.config.js` 与 `src/types/index.ts` 是否一致

## Security

- `.env*` 与 `node_modules/` 已在 `.gitignore`，遵循即可
- `vite-plugin-trae-solo-badge` 会在生产构建右下角加 Trae 角标（已配 `prodOnly: true`），如需去除请编辑 `vite.config.ts`
- 不在代码中硬编码任何密钥或后端地址（当前为纯前端项目）

## Domain rules（化学逻辑改动必读）

- pH 公式权威定义在 `src/engine/physics.ts:computePH()`；改阈值（如 6.5 红线）必须同步：
  - `PHChart` 上的警示横线
  - `StatusText` 状态文案
  - `需求.md` 文档说明
- 颜色优先级锁死规则：`pH < 6.5`（无缓冲）→ HOT_PINK 强制覆盖一切，不允许被体积逻辑绕过
- Stage 1 过量阈值 `volume >= 20.5`、终点区间 `19.95 <= v < 20.5` 是半滴（0.05 mL）精度的契约，不要随手改
- 隐藏浓度范围 `[0.0450, 0.0650]` 由 `engine/random.ts` 生成；Stage 2 的"陷阱"（用户用 0.05 代入）在 `engine/stages.ts:validateStage2Input()` 的 `usedTheoretical` 分支
- 任何新增校验都要先在 `engine/stages.ts` 写成纯函数，再在 `store/simStore.ts` 接入 store action