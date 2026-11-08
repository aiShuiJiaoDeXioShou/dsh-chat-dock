# Changelog

## 0.1.1

### 修复

- 自定义站点设置 `"enabled": false` 时不再出现在站点列表里。

### 验证

- 新增该场景的回归测试，自动化测试总数为 40。

## 0.1.0

首个版本。

### 新增

- 右侧栏 Browser 标签打开 DeepSeek Chat，并可通过 `sidebarRight.float` 浮起。
- 全局悬浮控制台：站点选择、打开/浮动、最新回复镜像、抓取、复制、插入当前会话输入框。
- 会话头部打开入口、侧栏底部显示/隐藏入口、`Alt+Shift+C` 快捷键。
- 拖拽移动、缩放、收起胶囊、隐藏；位置与设置持久化。
- 站点适配器注册表：DeepSeek 默认启用；ChatGPT 和 Claude 注册为实验能力，默认关闭。
- 自定义站点 JSON：URL、hosts、页面内抓取脚本。
- 中英文文案，`--dsw-alias-*` 主题样式。
- 39 个自动化测试，覆盖共享逻辑、webview 选择、浮动调用和 React 静态渲染。

### 已知限制

- Browser 的登录态不跨应用重启，重启后需要重新登录。
- 插件不能自建 webview，Chat 页面只能放在内置 Browser 标签里。
- v0.1 不自动向 Chat 页面发送消息。
- ChatGPT / Claude 适配器未在真实账号上验证。
- 浮窗是 DSH 内部面板，不是 OS 级置顶窗口。
- 真实点击、浮动和登录后抓取尚未在本机完成交互验收，见 `docs/verification.md`。
