# Verdandi stage artwork

`source/` 保存可复现构建所需的 PNG 源文件，`generated/` 保存浏览器 bundle 使用的 WebP 版本。运行 `pnpm art:generate` 会更新 `src/client/stage-art.generated.ts`，使插件在运行时不依赖外部图片请求。

## 游戏内素材

项目维护者确认，以下素材直接取自《深空之眼》游戏内资源。它们及其裁切、缩放、透明度处理或 WebP 编码版本的权利归原权利人所有，不属于仓库 MIT License 的授权范围：

- `verdandi-barbecue-seated`: 左侧人物立绘与烤肉主题。
- `verdandi-white-knight`: 右侧白骑士人物立绘。
- `verdandi-library-day`、`verdandi-library-night`: 亮色与暗色工作区场景。
- `verdandi-bridal-cg-portrait`: 侧边栏下方婚纱 CG。
- `verdandi-vow-avatar-frame`、`verdandi-wedding-avatar`: 助手消息头像组合。
- `verdandi-vow-rings`: 输入区中央戒指装饰。
- `verdandi-ring-tag`、`verdandi-vow-namecard`: 会话与工作区选中态。
- `verdandi-sacred-tree-white`: 圣树水印。
- `verdandi-chibi-left`、`verdandi-chibi-right`: 新会话输入区 Q 版装饰。
- `verdandi-childhood-record`: 详情栏空状态彩蛋。
- `verdandi-sequence-sword`: 时序之剑主题元素。
- `verdandi-q-avatar`: 侧边栏 rail 模式头像。

## 项目原创通用装饰

以下素材由本项目自行绘制或生成，不包含第三方角色图像，按仓库 MIT License 提供：

- `verdandi-bridal-floral-corner`: 白百合、深红玫瑰、头纱与丝带角饰。
- `verdandi-bridal-veil-corner`: 白纱、蕾丝、珍珠与深红丝带角饰。
- `verdandi-vow-folder`: 象牙白邀请函文件夹图标。

完整的权利边界与非官方声明见仓库根目录 [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md)。
