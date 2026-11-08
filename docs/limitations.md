# 限制与边界

这些限制来自 DSH Desktop 0.2.2-rc.1 的现有实现和 Chat 站点本身，不是插件可以绕过的配置项。

## 插件不能自建 webview

DSH Desktop 的主窗口只给 primary window 开启 `webviewTag`，主进程的 `will-attach-webview` 只放行内置 Browser 注册过租约的 guest，其他 attach 请求直接 `preventDefault()`。因此：

- 插件不能创建自己的 `<webview>` 去加载 chat.deepseek.com。
- 插件不能把内置 Browser 的 webview 节点搬到自己的浮窗里。
- 用 iframe 嵌入 Chat 站点会被 CSP 或 X-Frame-Options 拒绝，也读不到 DOM。

可行的路径只有内置 Browser 标签。插件打开它，再调用侧栏公开的 `float` 把标签放进原生浮动面板。控制台是插件自绘的第二个小浮窗，不是 Chat 页面本身。

## 登录态不跨应用重启

内置 Browser 的分区按工作目录在进程内共享，cookies 和 Web Storage 不会跨应用重启保留。结果是：

- 每次重启 DSH 后，chat.deepseek.com、ChatGPT、Claude 都需要重新登录。
- 插件不读取、不保存账号 token 或 cookie。
- 插件的设置和浮窗位置会保留，但登录不会。

如果登录态是硬需求，需要 DSH 提供持久的 Browser profile，或者改用模型 API 的 Chat 后端。这不属于本插件的范围。

## 页面结构会变化

抓取依赖站点的 DOM。站点改版、A/B 实验、账号差异都可能让选择器失效。插件的兜底顺序是：

1. 适配器选择器。
2. 当前选区。
3. 页面正文尾部（仅自定义站点的通用兜底）。

仍为空时，用户只能手动选中并复制。插件不会尝试注入点击、模拟输入或绕过站点保护。

## ChatGPT 和 Claude 是实验能力

两个适配器已注册，但默认关闭。它们可能遇到：

- Cloudflare 或其他反自动化检查。
- 登录需要 WebAuthn、设备验证或短信验证码。
- Electron 内嵌浏览器被站点识别并拒绝。
- 选择器与真实账号页面不一致。

如果页面无法使用，退回系统浏览器手动复制；插件不提供绕过手段。

## 不自动发送消息

v0.1 只做读取和交接。插件不会：

- 代替用户在 Chat 页面输入或提交。
- 自动点“发送”、自动续写或多轮代理。
- 把 DSH 的会话内容自动注入 Chat 页面。

这些行为涉及站点条款、账号安全和脆弱的页面自动化，暂不实现。

## 浮窗不是 OS 级窗口

控制台是 `shell.overlay` 里的 React 浮层，浮动 Chat 页面是 DSH 内置侧栏的浮动面板。两者都只存在于 DSH 窗口内：

- 不能在其他应用上方置顶。
- 不能拖到 DSH 窗口外。
- 关闭 DSH 后不存在。

独立于应用的系统级悬浮窗需要桌面壳提供新的窗口能力，不是插件可以实现的。

## 依赖右侧栏和会话

- 右侧栏 Browser 必须在当前 profile 启用；Web profile 默认不启用。
- 打开 Browser 标签需要当前有一个会话；Hero 页面没有会话绑定。
- 没有会话时控制台仍可打开和设置，但打开 Chat 会失败并给出提示。
- 侧栏收起、标签被关闭或页面被导航走时，镜像会变成“还没有打开页面”。

## 浮动可能失败

浮动依赖 `ctx.sidebarRight.float`。插件在打开后延迟尝试，并检查当前激活标签对应的 Chat 页面是否可见，避免浮错标签。以下情况可能不会自动浮起：

- 侧栏控制器版本不支持 `float`。
- 打开动作还没完成，`active()` 还没指向新标签。
- 当前标签被用户切换走。

失败时控制台提示手动拖动标签，打开本身不受影响。浮动面板是否支持多标签共处由 DSH 的 dockkit 决定；插件只提供“浮动当前标签”和打开其它侧栏页面的入口，不重排布局。

## 插入依赖 composer bridge

根作用域的 `shell.overlay` 拿不到 composer 的 `inputActions`。插件通过 `conversation.input.dock` 的零高条目发布它们。以下情况插入会退回复制：

- 没有会话。
- composer 未挂载或被锁定。
- `inputActions.insertText` 拒绝写入，或光标 span 连续失效。
- 插件刚加载，bridge 还没挂载。

复制成功后状态行会说明已经改为复制，不会静默丢内容。

## 多窗口与刷新

- 设置和浮窗位置存在 `localStorage`，同一 origin 的多个窗口共享。最后写入的窗口获胜。
- 刷新页面后设置和位置恢复；正在抓取的回复不会持久化。
- 客户端 bundle 更新后需要刷新页面才会加载新代码。

## 版本兼容

插件按 DSH 0.2.2-rc.1 的公开接口开发：

- `shell.overlay`
- `conversation.session.header.actions`
- `sidebar.footer.action`
- `conversation.input.dock`
- `ctx.sidebarRight.openTab` / `float` / `active`
- `webview[data-sidebar-browser-frame]` 与 `executeJavaScript`

DSH 升级可能重命名槽位、改变 `sidebarRight` 控制器或调整 webview 属性。所有 DOM 和 service 访问都做了防御式判断，但接口被移除时相应功能会退化。`package.json` 的 `engines.dsh` 只声明最低版本，不保证未来版本。

## 合规

插件不做登录绕过、验证码绕过、反自动化对抗或内容抓取上传。Chat 页面的使用受各站点自己的服务条款约束；用户需要自己确认账号和地区允许在 Electron 内嵌浏览器中使用。
