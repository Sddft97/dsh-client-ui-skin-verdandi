# @hjbztlbr/dsh-client-ui-skin-verdandi

《深空之眼》薇儿丹蒂「纯白圣誓 / White Vow」主题的 DeepSeek Harness Web UI 皮肤插件。

## 视觉方向

- 深红 `#8E2438` 负责侧栏、身份和选中状态，不再大面积进入阅读区。
- 婚纱白负责誓约顶栏、聊天书页、输入框、设置与编辑界面。
- 柔金只用于骑士纹章、边线、选中态与 focus ring。
- 婚纱立绘、圣剑纹章、圣树水印与烤肉彩蛋分别承担角色、守护、生命与活泼贪吃的语义。

完整设计依据、区域规格、素材边界与验收矩阵见 [设计说明](docs/design/verdandi-white-vow.md)，静态布局稿见 [设计板](docs/design/verdandi-white-vow-board.svg)。

## 已覆盖区域

- 深红侧栏：Logo、HARNESS 铭牌、新会话邀请函、工作区/会话状态与底部区域。
- 会话冠带：象牙白头纱、玫瑰花束与丝带装饰，真实标题、Session log 和 tabs 始终位于装饰层之上。
- 场景工作区：昼夜书室背景不再铺中央白遮罩，聊天内容改为独立的誓约书页卡。
- 纯白誓约输入卡：双层红金边、蕾丝裙摆、中央戒指誓约书印章、瓷白工具按钮与深红发送按钮。
- 设置与系统弹窗：独立恢复 DSH 高对比 token，并修正侧栏 portal 的裁切层级。
- 详情/轨迹、SSH、Cordis、AionUI 与 `.xterm` 宿主兼容；不改写终端 ANSI 调色板。
- 亮色、暗色、侧栏 rail、窄屏与 `prefers-reduced-motion`。

## 运行约束

- 纯呈现层：不注册服务、不读取或修改模型请求。
- 所有样式均位于 `body[data-dsh-verdandi]` 作用域。
- `apply()` 只挂载可逆 DOM hook、主题资产变量和测量观察器；`dispose()` 完整清理。
- 人物舞台位于 `conversation` 内部，不使用全页 `position: fixed` 或超高 `z-index`。

## 本地开发

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
dsh plugin --profile web add link:/absolute/path/to/dsh-client-ui-skin-verdandi
```

插件包名为 `@hjbztlbr/dsh-client-ui-skin-verdandi`，bundle row 为 `ui-skin-verdandi`。皮肤之间应通过 DSH 的 skin switcher 互斥切换。

## 目录

```text
.
├── cordis.patch.yml
├── skin.json
├── docs/design/
│   ├── verdandi-white-vow.md
│   └── verdandi-white-vow-board.svg
├── preview/
├── src/
│   ├── index.ts
│   └── client/
│       ├── art.ts
│       ├── index.ts
│       └── verdandi.module.css
└── tests/apply.spec.ts
```

## 素材与发布边界

代码和原创 CSS/SVG 装饰按仓库许可证处理。当前内嵌栅格素材仅用于本地视觉验证，尚缺逐项来源与再分发授权记录；公开发布前必须补齐来源、作者、原始链接、处理方式和授权范围。未取得明确许可的二创不得进入发布包。
