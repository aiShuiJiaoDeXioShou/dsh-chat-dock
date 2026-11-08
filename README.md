# dsh-chat-dock · Chat 浮窗

在 DeepSeek Harness 里打开 DeepSeek Chat（后续 ChatGPT / Claude），把它放进可浮动的右侧栏 Browser 标签，并用一个全局悬浮控制台镜像最新回复、复制或插入当前会话输入框。

MIT · TypeScript · DSH Desktop ≥ 0.2.2-rc.1

## 它是什么

- **Chat 标签**：在右侧栏 Browser 标签打开 `chat.deepseek.com`，和普通侧栏页面一样使用。
- **一键浮动**：把 Chat 标签交给 DSH 原生侧栏的浮动面板，聊天时仍可继续使用 Files、Canvas 等侧栏 UI。
- **悬浮控制台**：插件自绘的全局浮窗，显示当前站点、页面状态和最新回复，提供抓取、复制、插入。
- **站点适配器**：v0.1 默认启用 DeepSeek；ChatGPT 和 Claude 的适配器已注册但默认关闭，属于实验能力。
- **轻量客户端插件**：不注册模型工具，不写会话事件，不保存账号凭据，不发起后台网络请求。

## 为什么 Chat 页面放在 Browser 标签里

DSH 的右侧栏 Browser 使用 Electron 的租约 `<webview>`；主进程的 `will-attach-webview` 只放行 Browser 自己创建的 guest，插件自建 webview 会被拦截。用 iframe 嵌入 chat.deepseek.com 也会被站点的 CSP 或 X-Frame-Options 拒绝，而且读不到 DOM。

所以插件不重造 Chat UI，也不做反向代理。它打开内置 Browser 标签，再调用侧栏公开的浮动 API；插件自己只负责控制台和抓取。这个边界决定了产品形态，细节见 [docs/limitations.md](docs/limitations.md)。

## 功能

| 能力 | 说明 |
|---|---|
| 打开 Chat | 在右侧栏 Browser 标签打开站点；同一地址的标签会被聚焦，不重复打开 |
| 浮动 | 打开后调用 `sidebarRight.float`；若没有生效，可手动把标签拖出侧栏 |
| 全局控制台 | 可拖动、缩放、收起成胶囊；位置和设置保存在 `localStorage` |
| 最新回复镜像 | 在控制台展开时按间隔抓取 guest 页面里的最新回复 |
| 抓取 | 适配器选择器优先，失败时回退到当前选区或页面正文尾部 |
| 复制 | 写入剪贴板，带编辑框回退 |
| 插入输入框 | 通过 composer 的 `inputActions` 在光标处插入；输入框不可用时改用复制 |
| 侧栏 UI 快捷入口 | 控制台可打开 Files、Terminal、Browser 标签，或浮动当前标签 |
| 自定义站点 | 在设置里用 JSON 添加站点、URL、hosts 和页面内抓取脚本 |
| 中英文与主题 | 文案走 locale，样式只依赖 `--dsw-alias-*` token |

快捷键：`Alt+Shift+C` 显示或隐藏控制台。

## 安装

要求：

- DSH Desktop ≥ 0.2.2-rc.1，且当前 profile 启用右侧栏 Browser。
- Node.js ≥ 20，npm ≥ 9。

```sh
git clone https://github.com/aiShuiJiaoDeXioShou/dsh-chat-dock.git
cd dsh-chat-dock
npm ci
npm run build
```

在 DSH 里安装本地 bundle：

```text
plugin_manager action=install_bundle target=/absolute/path/to/dsh-chat-dock
```

安装后刷新 Harness 页面，或完全重启应用。也可以从 **Settings → Plugins** 选择本地目录或 tgz 安装。

`client/client.js` 是构建产物并随仓库提交；修改源码后运行 `npm run build`，刷新页面即可加载新的客户端 bundle。

## 使用

1. 打开一个会话。
2. 点会话头部的 Chat 图标，或侧栏底部、Settings 旁边的 Chat 浮窗图标。
3. 第一次使用时，在打开的 Browser 标签里登录 chat.deepseek.com。
4. 在控制台里确认站点和页面状态；展开后会自动镜像最新回复。
5. 需要完整交互时点 **浮动**，或把 Chat 标签拖出右侧栏。
6. 抓到回复后点 **复制** 或 **插入**。插入会写到当前会话输入框的光标处。
7. 设置里可以切换默认站点、打开方式、抓取间隔，或添加自定义站点。

会话头部按钮打开默认站点；控制台里的站点下拉框可以在已启用站点之间切换。

## 站点与自定义站点

v0.1 默认只启用 DeepSeek。ChatGPT 和 Claude 的适配器在设置里可以打开，但它们是实验能力：某些账号、地区或站点风控可能阻止内嵌浏览器，页面结构变化也可能让抓取失效。

自定义站点在控制台设置的 **自定义站点（JSON）** 中填写：

```json
[
  {
    "id": "my-chat",
    "label": "My Chat",
    "url": "https://example.com/chat",
    "hosts": ["example.com"],
    "latestReply": "(() => { const nodes = document.querySelectorAll('.answer'); const last = nodes[nodes.length - 1]; return last ? last.innerText : '' })()"
  }
]
```

字段：

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | 是 | 1 到 48 个字符，不能和内置站点 id 相同 |
| `label` | 是 | 控制台和设置里显示的名字 |
| `url` | 是 | 必须是 http(s) 地址 |
| `hosts` | 否 | 用于匹配 Browser 标签的域名；省略时从 `url` 推导 |
| `latestReply` | 否 | 在 guest 页面里执行的 JS，返回字符串；省略时使用正文尾部兜底 |
| `enabled` | 否 | 默认 `true` |

`latestReply` 是在 Chat 页面里执行的代码，只应填写你自己信任的脚本。

## 限制

- **登录态不跨应用重启**：DSH 的 Browser 分区是进程内的，cookies 和 Web Storage 不会跨重启保存。重启后需要重新登录。插件不读取、不保存账号 token。
- **依赖内置 Browser**：插件不自建 webview；Browser 未启用、右侧栏不可用，或当前没有会话时，Chat 页面无法打开。
- **依赖页面结构**：DeepSeek 的页面类名可能变化。插件有选区和正文兜底，也可以在设置里覆盖抓取脚本。
- **不自动发送消息**：v0.1 只读取页面，不代替用户在 Chat 页面里输入或提交。
- **不是 OS 级置顶窗口**：浮窗是 DSH 内部的浮动面板与控制台，不是独立于应用的系统窗口。
- **没有验证的交互**：仓库内的自动化测试覆盖纯逻辑和 React 渲染；当前环境无法进行屏幕截图或辅助功能点击，因此真实点击、浮动和登录后的抓取需要按 [docs/verification.md](docs/verification.md) 手动验收。

完整说明见 [docs/limitations.md](docs/limitations.md)。

## 开发

```sh
npm ci
npm run typecheck   # client + tests
npm run build       # src/client -> client/client.js
npm test            # tsx --test
npm run check       # typecheck + build + test
```

目录：

| 路径 | 作用 |
|---|---|
| `index.js` | Host 入口；v0.1 为空实现，保持 bundle 可安装 |
| `src/shared/` | 站点注册表、抓取规范化、几何、设置，纯函数，可单测 |
| `src/client/` | 控制台、入口按钮、composer bridge、抓取、浮动逻辑 |
| `src/client/console.tsx` | 全局悬浮控制台 |
| `src/client/capture.ts` | 找到 Sidebar Browser 的 webview 并执行抓取脚本 |
| `src/client/floating.ts` | 打开 Browser 标签、浮动标签、打开侧栏 UI |
| `src/client/bridge.ts` | 把 composer 的 `inputActions` 暴露给根作用域控制台 |
| `tests/` | 逻辑测试和 React 静态渲染测试 |
| `docs/` | 架构、适配器、限制、验证 |

更多设计说明见 [docs/architecture.md](docs/architecture.md)，新增站点见 [docs/adapters.md](docs/adapters.md)。

## 隐私

- 插件不发起后台网络请求。页面访问由内置 Browser 完成。
- 抓取内容只留在当前页面内存里，用于镜像、复制、插入。
- 插件不读取、不保存 cookies 或账号 token。
- 自定义站点的 `latestReply` 是用户提供的页面内代码；插件只把它交给当前 guest 页面执行。

## License

MIT，见 [LICENSE](LICENSE)。

---

## English

A floating web-chat dock for DeepSeek Harness. It opens DeepSeek Chat in the built-in right-Sidebar Browser tab, floats that tab through the sidebar's public API, and adds a plugin-rendered console that mirrors the latest reply and can copy or insert it into the current composer. ChatGPT and Claude adapters are registered but disabled by default in v0.1.

The Chat page must live in the built-in Browser tab: the desktop main process only admits Browser-leased webviews, and iframes are rejected by the chat sites. The console itself is a `shell.overlay` entry.

Requirements: DSH Desktop ≥ 0.2.2-rc.1 with the right-Sidebar Browser enabled, Node.js ≥ 20.

```sh
git clone https://github.com/aiShuiJiaoDeXioShou/dsh-chat-dock.git
cd dsh-chat-dock
npm ci && npm run build
# then: plugin_manager action=install_bundle target=/absolute/path/to/dsh-chat-dock
```

Known limits: web login state does not survive an app restart, page selectors can change, no automatic message sending, and the floating window is inside DSH rather than an OS-level always-on-top window. See [docs/limitations.md](docs/limitations.md) for detail.
