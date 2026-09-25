# 薇儿丹蒂 · 纯白圣誓

> 《深空之眼》薇儿丹蒂主题的 DeepSeek Harness Web UI 皮肤插件。

**语言 / Language：** [简体中文](README.md) | [English](README.en.md)

[设计说明](docs/design/verdandi-white-vow.md) · [发布清单](RELEASING.md) · [素材与权利说明](THIRD_PARTY_NOTICES.zh-CN.md)

![亮色模式预览](preview/light.png)

![新会话页面（亮色）](preview/hero-light.png)

## 主题特色

- 深红 `#8E2438` 承担导航、身份与会话选中态，婚纱白承担阅读和编辑区域，柔金用于骑士纹章与交互刻线。
- 覆盖侧边栏、会话顶栏、聊天记录、输入区、统计栏、轨迹页、右侧详情栏、设置弹窗和终端宿主。
- 使用誓约名片、婚纱头像、戒指、圣树、时序之剑、烤肉与 Q 版形象等角色元素。
- 亮色与暗色模式使用不同场景背景；人物舞台会随会话状态平滑缩放，并适配窄屏、侧边栏收起与减少动态效果偏好。
- 工作区保留完整插画舞台，同时用「可读性护栏」守住文字对比：一层只在有正文时落下的头纱纱幕，加上每条过程元数据行与新会话工作区 chip 自己的纸面承托（系统提示词、运行失败、过程控件、轮尾时间与操作、工作目录／预设／分支 chip）。两种主题下新墨色最坏情况均 ≥5.3:1。
- 纯呈现层：不注册服务，不读取或修改模型请求，不上传数据。

![新会话页面（暗色）](preview/hero-dark.png)

![暗色模式预览](preview/dark.png)

## 安装

薇儿丹蒂提供两种安装形态，按你的环境二选一即可。**两种形态不要同时启用**：它们是同一套视觉的两种加载方式，同时启用会叠加渲染。

### 方式一：皮肤市场安装（推荐）

适合已接入皮肤中心的 dsh `0.1.7-rc.2+` 环境。皮肤中心即 [`@linxin666/dsh-client-ui-skin-center`](https://github.com/zhu1090093659/dsh-skins)（源码仓库 [zhu1090093659/dsh-skins](https://github.com/zhu1090093659/dsh-skins)，随 dsh-web 全家桶提供），它把「皮肤列表 / 试穿 / 应用」做成设置里的一级分区，也是所有皮肤的唯一加载器：

1. 打开「设置 → 皮肤」，在皮肤列表中找到「薇儿丹蒂 · 纯白圣誓」；
2. 点击「试穿」即时预览（不落盘，退出即还原）；满意后点「应用」持久化，页面自动刷新生效；
3. 皮肤以纯资产目录形式安装到 DSH 主目录，**没有安装命令、无需重启**——重开皮肤卡片或刷新页面即收录。

皮肤市场的版本号（`1.0.x`）与 npm 插件版本号（`0.1.x`）相互独立，市场侧更新同样是在皮肤市场中重新下载。

### 方式二：独立插件安装

适合未使用皮肤中心（[`@linxin666/dsh-client-ui-skin-center`](https://github.com/zhu1090093659/dsh-skins)）的环境，或希望跟随 npm 版本管理、通过命令行更新的用户。

从 npm 安装：

```powershell
dsh plugin --profile web add @hjbztlbr/dsh-client-ui-skin-verdandi
```

或从 GitHub 安装：

```powershell
dsh plugin --profile web add github:Sddft97/dsh-client-ui-skin-verdandi
```

安装后在插件/皮肤管理界面启用「薇儿丹蒂 · 纯白圣誓」，再按 `Ctrl+F5` 强制刷新页面。

### 注意事项

- 启用其中一种形态后，请确认另一种处于禁用状态。
- 多个皮肤会同时修改相同界面区域，请一次只启用一个完整皮肤。

## 外观模式

在 DSH 的“设置 → 通用设置 → 外观”中选择亮色、暗色或跟随系统。若 DSH 已保存为固定模式，只切换浏览器或操作系统主题不会覆盖该设置。

## 更新与卸载

**皮肤市场安装**：更新在皮肤市场中重新下载覆盖；卸载在皮肤列表中操作，或直接删除 DSH 主目录下的 `skins/verdandi/`，刷新页面即生效。

**插件安装**：

```powershell
# 更新
dsh plugin --profile web update @hjbztlbr/dsh-client-ui-skin-verdandi

# 卸载
dsh plugin --profile web remove @hjbztlbr/dsh-client-ui-skin-verdandi
```

## 兼容性

- 已在 DeepSeek Harness `0.1.5-rc.1` 与 `0.1.7-rc.2` 的 Web profile 上测试，0.1.7 下同时验证了 skin-center `1.0.2` 的资产形态（hooks 受信）与插件形态：0.1.7 重构了会话头部（`conversation.header`）、触发行、用户时钟行、上下文提示行、工作步骤折叠与 turn-process 条带，全部适配；旧版渲染不受影响。
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

详见[中文素材与权利说明](THIRD_PARTY_NOTICES.zh-CN.md)，其英文规范文本见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。如权利人认为内容需要调整或移除，请通过 GitHub Issues 联系。
