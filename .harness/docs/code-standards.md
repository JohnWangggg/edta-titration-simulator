# 项目代码规范（仅 .harness/ 内 reins 查阅）

AGENTS.md 是给所有 AI agent 看的通用说明。本文件是 reins 协作时的内部约定，只在 `.harness/` 范围内生效。

## 改动前的"30 秒检视"

1. **找主控文件**：
   - 物理/校验 → `src/engine/`
   - 状态机 → `src/store/simStore.ts`
   - 视觉 → `src/components/` + `tailwind.config.js` + `src/index.css`
2. **看邻近文件**：
   - 不要凭空发明命名 / 文件路径
   - 复制同名邻近文件的 import 风格、export 风格
3. **看 `需求.md`**：
   - 改阈值 / 公式必须对应条款
   - 没有条款就先讨论，不要自己拍

## 改动中的边界规则

### Chemistry Expert

- `src/engine/**` 必须零 React / 零 DOM / 零副作用
- 每个导出函数顶部用 JSDoc 写明"输入 → 输出 → 边界"
- 阈值常量（19.5 / 19.95 / 20.0 / 20.5 / 6.5）集中在 `physics.ts` 顶部命名导出，未来要改阈值时只动一处

### Developer

- 组件文件不要超过 300 行；超了就拆
- Zustand action：派生量（pH/color/status/history）必须通过 `recalc()` 统一走，不要在多个 action 里各算一遍
- 引入新依赖前先看 `package.json`；确认没装的就报给编排者，不要私自 `pnpm add`

### UI Expert

- 新色值先在 `tailwind.config.js` 配，再在 `src/types/index.ts` 加常量，最后在组件里引用
- 不要在 JSX 里写内联 style `color: '#xxx'`——除非是动态 SVG 渐变 / 滤镜
- 动画曲线优先复用 `tailwind.config.js` 里已配的 keyframes，新动画先配再引

### Tester

- 独立跑命令，不信 producer 的 PASS
- 报告里给具体 stdout/stderr 摘要，不只写"PASS"
- 失败时直接给"复现步骤 / 文件路径 / 建议修复"

## 改动后的最小自检（每个 rein 都跑）

```bash
pnpm check        # TS 类型
pnpm lint         # ESLint
pnpm build        # 生产构建（如果改了构建配置或 import 路径）
```

不通过不许发"完成"。

## 协作交接

- `chemistry-expert` 改完 `engine/` → 在 deliverable 里说"developer 应在 store.ts 的 action 里如何接入"
- `ui-expert` 改完组件 → 在 deliverable 里说"是否需要 `chemistry-expert` 复核颜色常量"
- `developer` 接入新逻辑 → 在 deliverable 里说"是否需要 `tester` 跑冒烟"
- `tester` 出报告 → PASS 才算闭环；FAIL 要附"复现 + 建议"，回到 producer 重做

## 文件所有权速查

| 路径 | Owner |
|------|-------|
| `src/engine/**` | chemistry-expert |
| `src/types/index.ts`（颜色常量） | chemistry-expert |
| `src/store/**` | developer |
| `src/pages/**` | developer |
| `src/components/**`（非 modals） | ui-expert |
| `src/components/modals/**` | ui-expert |
| `src/lib/utils.ts` | developer |
| `src/main.tsx` / `src/App.tsx` | developer |
| `tailwind.config.js` / `src/index.css` | ui-expert |
| `vite.config.ts` / `eslint.config.js` | developer |
| `index.html` / `public/**` | developer |
| `AGENTS.md` | 编排者（harness） |
| `.harness/docs/**` | 编排者（harness） |