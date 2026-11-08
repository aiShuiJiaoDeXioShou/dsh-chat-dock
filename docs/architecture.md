# 架构

`dsh-chat-dock` 是一个客户端插件。它不实现 Chat，也不代理模型请求：Chat 页面由 DSH 内置的右侧栏 Browser 承载，插件负责打开、浮动、读取和交接。

## 分层

| 层 | 位置 | 责任 |
|---|---|---|
| 共享逻辑 | `src/shared/` | 站点注册表、抓取规范化、几何、设置。纯函数，不碰 DOM，可单测 |
| 客户端 | `src/client/` | 控制台、入口按钮、webview 发现、抓取、浮动、composer bridge |
| Host | `index.js` | v0.1 为空 `apply()`；只为让 bundle 可安装 |

v0.1 没有 Host 路由、没有工具注册、没有会话事件。所有状态都在浏览器内存或 `localStorage`。

## 扩展点

| 能力 | 槽位 | 注册 id |
|---|---|---|
| 全局悬浮控制台 | `shell.overlay` | `chat-dock-console` |
| 会话头部打开入口 | `conversation.session.header.actions` | `chat-dock-open` |
| 侧栏底部显示/隐藏入口 | `sidebar.footer.action` | `chat-dock-toggle` |
| composer 动作桥 | `conversation.input.dock` | `chat-dock-bridge` |

四个槽位的注册都放在 `ctx.effect` 里，插件卸载时自动移除。入口按钮通过模块内的 `consoleEvents` 通信，不共享 React state。

## 数据流

```
控制台 / 头部按钮
  └─ openSite()
       ├─ sidebarRight.openTab('browser', { params: { url } })
       └─ sidebarRight.float(activeTabId)        # 可选

轮询 / 手动抓取
  ├─ document.querySelectorAll('webview[data-sidebar-browser-frame]')
  ├─ 按 getURL() 匹配站点 hosts
  ├─ webview.executeJavaScript(site.extraction.latestReply)
  └─ normalizeCapture() → 控制台镜像

插入
  ├─ conversation.input.dock 的 InputBridge 发布 inputActions
  ├─ insertIntoComposer() 调 insertText(text, caretSpan)
  └─ 失败 → copyText() 兜底
```

## 关键模块

### `capture.ts`

找到内置 Sidebar Browser 的 webview。它不创建 guest，只读取已经挂载的 `webview[data-sidebar-browser-frame]`。

- `viewsForSite(site)`：按 `getURL()` 和站点 `hosts` 过滤。
- `pickView(site)`：优先可见的页面，没有可见页面时取第一个。后台标签仍然可以被 `executeJavaScript` 读取。
- `captureLatest(site)`：执行适配器脚本，4 秒超时，结果交给 `normalizeCapture`。
- 失败原因：`no-page`、`empty`、`error`、`timeout`。

### `floating.ts`

使用侧栏公开控制器，不直接改布局：

- `openTab('browser', { params: { url } })` 打开或聚焦页面。
- `float(tabId)` 把标签放进原生浮动面板。
- 打开后立即尝试浮动；没有成功时按 180ms 到 840ms 的间隔重试 4 次。只有在当前激活标签对应的 Chat 页面可见时才调用 `float`，避免浮错标签。
- 浮动失败不会阻断打开；控制台提示用户手动拖动。
- `openSideUi(kind)` 用于打开 Files、Terminal、Browser 等内置页面。

### `console.tsx`

控制台的职责：

- 管理站点选择、镜像状态、抓取结果、操作状态。
- 拖动标题栏移动，拖右下角缩放；位置写入 `localStorage`。
- 展开时按 `intervalMs` 轮询；页面隐藏、控制台收起或关闭时不轮询。
- 只把抓取结果当纯文本渲染，不使用 `dangerouslySetInnerHTML`。
- 设置视图替换主体内容，头部保持可拖动。

### `bridge.ts`

根作用域的 `shell.overlay` 拿不到 composer 的 `inputActions`。一个零高的 `conversation.input.dock` 条目通过 `useEffect` 把 `{ sessionId, inputActions }` 放进模块级变量，控制台插入时再取用。

插入策略：

1. `captureInsertion()` 取光标位置。
2. `insertText(text, span)`。
3. 失败时重新取一次光标再试。
4. 仍失败则返回 `unavailable`，控制台改为复制。

没有会话、输入框锁定或 bridge 未挂载时都会走到复制兜底。

### `settings.ts`

本地持久化两个 key：

| key | 内容 |
|---|---|
| `dsh-chat-dock.v1.settings` | 默认站点、打开方式、镜像开关、间隔、站点 overrides、自定义站点 |
| `dsh-chat-dock.v1.console` | 面板位置、尺寸、是否收起、是否隐藏 |

`loadSettings` 和 `loadConsoleState` 都做版本化校验：坏 JSON、越界数值、非法 URL 会回退到默认值或被 clamp。`localStorage` 不可用时插件继续用内存里的默认值。

## 站点适配器

站点是纯数据，页面函数用 `pageScript()` 序列化成自包含的 IIFE，再交给 `executeJavaScript`。页面函数不能引用 import、闭包或 TypeScript helper。

适配器只负责“读”：URL、hosts、最新回复脚本，可选整段对话和登录判断脚本。它不负责发送、点击或登录。新增站点见 [adapters.md](adapters.md)。

## 失败模型

| 情况 | 行为 |
|---|---|
| `sidebarRight` 不存在 | 控制台提示右侧栏不可用；不抛异常 |
| 没有会话或 Browser 未启用 | `openTab` 抛错时提示；用户可切到系统浏览器 |
| 找不到 Chat webview | 镜像显示“还没有打开页面” |
| 抓取脚本超时或抛错 | 镜像显示错误，保留上一次抓取结果以外不阻塞操作 |
| 页面结构变化 | 选区兜底；仍为空时提示用户手动复制 |
| composer 不可用 | 复制兜底，并在状态行说明 |
| 插件卸载 | 四个槽位注册、样式、定时器随 effect 清理 |

## 兼容性

- 目标：DSH Desktop 0.2.2-rc.1，右侧栏 Browser 启用。
- 依赖的公开接口：`ctx.slots`、`ctx.locale`、`ctx.sidebarRight`、`ctx.get`、`shell.overlay`、`conversation.input.dock`。
- 不 import 任何 `@deepseek-ai/dsh-client-*` 包；样式只用 `--dsw-alias-*` token。
- 所有 DOM 查询是防御式的：找不到节点、guest 销毁、`getURL()` 抛错都返回空值而不是让组件崩溃。
