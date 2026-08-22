# 薇儿丹蒂 · 纯白圣誓

> 《深空之眼》薇儿丹蒂主题的 DeepSeek Harness Web UI 皮肤插件。

[English](#english) · [设计说明](docs/design/verdandi-white-vow.md) · [发布清单](RELEASING.md) · [素材与权利说明](THIRD_PARTY_NOTICES.md)

![亮色模式预览](preview/light.png)

## 主题特色

- 深红 `#8E2438` 承担导航、身份与会话选中态，婚纱白承担阅读和编辑区域，柔金用于骑士纹章与交互刻线。
- 覆盖侧边栏、会话顶栏、聊天记录、输入区、统计栏、轨迹页、右侧详情栏、设置弹窗和终端宿主。
- 使用誓约名片、婚纱头像、戒指、圣树、时序之剑、烤肉与 Q 版形象等角色元素。
- 亮色与暗色模式使用不同场景背景；人物舞台会随会话状态平滑缩放，并适配窄屏、侧栏收起与减少动态效果偏好。
- 纯呈现层：不注册服务，不读取或修改模型请求，不上传数据。

![暗色模式预览](preview/dark.png)

## 安装

### 从 npm 安装

```powershell
dsh plugin --profile web add @hjbztlbr/dsh-client-ui-skin-verdandi
```

### 从 GitHub 安装

```powershell
dsh plugin --profile web add github:hjbztlbr/dsh-client-ui-skin-verdandi
```

安装后在 DSH 的皮肤管理界面启用“薇儿丹蒂 · 纯白圣誓”，再按 `Ctrl+F5` 强制刷新页面。多个皮肤会同时修改相同界面区域，请一次只启用一个完整皮肤。

## 外观模式

在 DSH 的“设置 → 通用设置 → 外观”中选择亮色、暗色或跟随系统。若 DSH 已保存为固定模式，只切换浏览器或操作系统主题不会覆盖该设置。

## 更新与卸载

```powershell
# 更新
dsh plugin --profile web update @hjbztlbr/dsh-client-ui-skin-verdandi

# 卸载
dsh plugin --profile web remove @hjbztlbr/dsh-client-ui-skin-verdandi
```

## 兼容性

- 已在 DeepSeek Harness `0.1.1-rc.2` Web profile 上测试。
- 对 better-sidebar、AionUI、SSH、Cordis、`.xterm` 与设置 portal 使用定向样式，避免改写终端 ANSI 调色板或全局系统 token。
- 小尺寸窗口会隐藏装饰性头像和人物舞台，优先保证操作区域与文字可读。

![设置界面兼容性预览](preview/settings.png)

DSH 仍处于快速迭代阶段。升级后若出现选择器失效或布局异常，请提交 Issue，并附上 DSH 版本、浏览器版本、问题页面和截图。

## 常见问题

### 安装后没有变化

确认插件已启用、其他完整皮肤已禁用，然后按 `Ctrl+F5`。若仍无效，请检查浏览器控制台是否出现 `__ModuleLoader__` 或 client bundle 加载错误。

### 设置页按钮或文字对比度异常

先暂时禁用其他会修改全局主题 token 的插件进行排查。本皮肤只对已知 DSH 宿主区域做兼容处理；复现时请同时提供已启用插件列表。

### 暗色背景没有切换

请在 DSH 自身的外观设置中切换。浏览器的深色偏好只有在 DSH 选择“跟随系统”时才会生效。

## 本地开发

```powershell
pnpm install
pnpm build
pnpm test
pnpm typecheck
dsh plugin --profile web add link:C:/absolute/path/to/dsh-client-ui-skin-verdandi
```

插件遵循 DSH skin plugin 结构：`cordis.patch.yml` 注册 bundle row，`skin.json` 提供皮肤元数据，客户端实现保持可逆的 `apply()` / `dispose()` 契约。运行时样式位于 `body[data-dsh-verdandi]` 作用域。

## 许可证与素材

仓库中的代码、CSS、构建脚本和项目原创通用装饰按 [MIT License](LICENSE) 提供。来自《深空之眼》的角色、场景、图标及其处理版本不属于 MIT 授权范围，相关权利归原权利人所有。项目是免费、非商业、非官方的同人皮肤，与游戏开发商、发行商及 DeepSeek Harness 官方均无隶属或授权关系。

详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。如权利人认为内容需要调整或移除，请通过 GitHub Issues 联系。

---

# English

> An Aether Gazer Verdandi-themed skin plugin for the DeepSeek Harness Web UI.

[中文](#薇儿丹蒂--纯白圣誓) · [Design specification](docs/design/verdandi-white-vow.md) · [Release checklist](RELEASING.md) · [Asset and rights notice](THIRD_PARTY_NOTICES.md)

## Features

- Deep crimson `#8E2438` identifies navigation, identity, and selected conversations; bridal white keeps reading and editing areas clean; soft gold is reserved for knight crests and interaction details.
- Styles the sidebar, conversation header, chat history, composer, statistics dock, trace view, details pane, settings dialogs, and terminal hosts.
- Incorporates Verdandi motifs including the vow namecard, bridal portrait, rings, Sacred Tree, Sequence Sword, barbecue, and chibi artwork.
- Uses separate light and dark workspace scenes. The character stage scales smoothly with conversation state and adapts to narrow windows, collapsed sidebars, and reduced-motion preferences.
- Presentation only: the plugin registers no service, does not read or modify model requests, and uploads no data.

## Installation

### Install from npm

```powershell
dsh plugin --profile web add @hjbztlbr/dsh-client-ui-skin-verdandi
```

### Install from GitHub

```powershell
dsh plugin --profile web add github:hjbztlbr/dsh-client-ui-skin-verdandi
```

After installation, enable “Verdandi · White Vow” in the DSH skin manager and press `Ctrl+F5` to force-refresh the page. Full skins modify many of the same host surfaces, so keep only one enabled at a time.

## Appearance modes

Choose Light, Dark, or Follow System under “Settings → General → Appearance” in DSH. If DSH is set to a fixed appearance, changing only the browser or operating-system theme will not override it.

## Update and uninstall

```powershell
# Update
dsh plugin --profile web update @hjbztlbr/dsh-client-ui-skin-verdandi

# Uninstall
dsh plugin --profile web remove @hjbztlbr/dsh-client-ui-skin-verdandi
```

## Compatibility

- Tested with the DeepSeek Harness `0.1.1-rc.2` Web profile.
- Uses scoped compatibility styles for better-sidebar, AionUI, SSH, Cordis, `.xterm`, and settings portals without replacing terminal ANSI colors or broad system tokens.
- Decorative avatars and character artwork are hidden at smaller viewport sizes so controls and text remain usable.

DSH is evolving quickly. If an upgrade causes selector or layout regressions, open an Issue with the DSH version, browser version, affected page, enabled plugin list, and a screenshot.

## Troubleshooting

### The skin is installed but nothing changes

Confirm that the plugin is enabled and other full skins are disabled, then press `Ctrl+F5`. If the problem remains, check the browser console for `__ModuleLoader__` or client-bundle loading errors.

### Buttons or text have poor contrast in Settings

Temporarily disable other plugins that replace global theme tokens. This skin applies compatibility rules only to known DSH host surfaces; include the list of enabled plugins when reporting a reproducible conflict.

### The dark background does not switch

Change the appearance in DSH itself. Browser dark-mode preferences take effect only when DSH is set to Follow System.

## Local development

```powershell
pnpm install
pnpm build
pnpm test
pnpm typecheck
dsh plugin --profile web add link:C:/absolute/path/to/dsh-client-ui-skin-verdandi
```

The package follows the DSH skin-plugin structure: `cordis.patch.yml` registers the bundle row, `skin.json` provides skin metadata, and the client keeps a reversible `apply()` / `dispose()` contract. Runtime styles are scoped under `body[data-dsh-verdandi]`.

## License and assets

Repository code, CSS, build scripts, and original generic ornaments are available under the [MIT License](LICENSE). Character art, scenes, icons, and processed assets from Aether Gazer are excluded from the MIT grant and remain the property of their respective rights holders. This is a free, non-commercial, unofficial fan skin with no affiliation with or endorsement by the game's developers, publishers, operators, or the DeepSeek Harness project.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for the full asset boundary. Rights holders may request attribution corrections, replacement, or removal through GitHub Issues.
