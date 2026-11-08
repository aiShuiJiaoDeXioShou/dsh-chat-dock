# 验证记录

本文记录这次交付实际做过的验证和没有做的验证。不要把“安装成功”或“槽位已注册”当成真实交互已经验证。

## 已验证

环境：macOS，DSH Desktop 0.2.2-rc.1，desktop profile。

### 自动化检查

```sh
npm run typecheck
npm run build
npm test
npm run check
```

结果：

- client 和 tests 两份 tsconfig 的 `--noEmit` 通过。
- esbuild 生成 `client/client.js`；bundle 不含 `require("@deepseek-ai/...")`。
- `tsx --test` 共 40 个测试全部通过，覆盖：站点匹配与启用、抓取规范化、几何 clamp、设置迁移与持久化、自定义站点解析、webview 选择与抓取超时、浮动调用、插入文本格式，以及控制台/设置页/入口按钮的 React 静态渲染。

React 静态渲染测试使用 `react-dom/server`，只证明组件树在默认、收起、隐藏和设置状态下可以渲染，不证明浏览器里的布局、动画或事件。

### 安装

```text
plugin_manager action=install_bundle target=/absolute/path/to/dsh-chat-dock
```

返回 `application: applied`，bundle `dsh-chat-dock`，安装记录版本 `0.1.0`。随后发布的 `0.1.1` 修复了自定义站点 `enabled: false` 被忽略的问题；本地 profile 使用链接安装，重新构建后的 `client/client.js` 已是 `0.1.1`，插件管理器里的安装记录要重新安装才会更新。profile 的 `package.json` 增加了链接依赖，bundle 已启用。

### 槽位注册

安装后通过 `cordis_inspect_query` 的 Client `Slots.listSubTree` 读取实时拓扑，确认以下条目为 `active: true`：

| 槽位 | id | order |
|---|---|---|
| `shell.overlay` | `chat-dock-console` | 60 |
| `conversation.session.header.actions` | `chat-dock-open` | 45 |
| `sidebar.footer.action` | `chat-dock-toggle` | 30 |
| `conversation.input.dock` | `chat-dock-bridge` | 4 |

Host `Config.listConfigs` 以 `name=dsh-chat-dock` 查询到条目 `include:chat-dock`，状态为 `absent`，表示插件没有声明 Config schema；这不等同于插件未启用。

这些结果证明客户端 bundle 被加载、四个槽位完成注册，并且与既有插件条目共存。它们不证明组件在页面里没有渲染错误，也不证明按钮可点击。

## 未验证

当前会话没有屏幕录制或辅助功能权限：`screencapture` 无法从显示器取图，`osascript` 调 System Events 被拒绝（-1719/-1728）。DSH Web GUI 需要启动时打印的认证 token，当前进程参数里没有暴露；环境里也没有 Playwright。因此以下项目没有做真实交互验证：

- 控制台胶囊和面板的实际渲染、拖动、缩放、收起、隐藏。
- 会话头部 Chat 按钮与侧栏底部按钮的实际点击。
- `openTab('browser', { params: { url } })` 打开 chat.deepseek.com 的效果。
- `float(tabId)` 是否在当前 DSH 构建上成功浮起，以及浮动面板能否共处多个标签。
- 登录 DeepSeek 后的最新回复抓取、复制、插入输入框。
- ChatGPT / Claude 适配器在真实账号上的表现。
- 中英文切换和明暗主题下的视觉检查。

## 手动验收清单

在安装并刷新页面后按顺序执行：

1. 打开一个会话，确认侧栏底部出现 Chat 浮窗图标，右下角出现控制台胶囊（如果上次隐藏过，用 `Alt+Shift+C` 或侧栏底部按钮显示）。
2. 点击会话头部 Chat 图标，确认右侧栏出现 chat.deepseek.com 的 Browser 标签。
3. 点击控制台 **浮动**，确认标签进入浮动面板；如果没浮起，确认控制台提示了手动拖动，并且拖动可以完成。
4. 在 Browser 标签里登录，发一条能产生较长回复的消息。
5. 展开控制台，确认镜像区域出现最新回复；切换站点下拉框应只显示已启用的站点。
6. 点 **抓取**，确认状态行显示“已抓取”；清空页面选区后再抓取，确认仍然是最后一条回复。
7. 点 **复制**，粘贴到任意编辑器，确认内容完整。
8. 在会话输入框里放一些文字，把光标放在中间，点 **插入**，确认计划文本插入到光标处且没有覆盖已有内容。
9. 在设置里关闭镜像，确认轮询停止；重新打开，确认恢复。
10. 刷新页面，确认控制台位置、大小、设置保留；重启应用后确认需要重新登录 Chat。
11. 打开设置里的 ChatGPT / Claude 开关，确认站点出现在下拉框，并记录页面是否被站点拦截。
12. 卸载插件，确认四个槽位条目消失、样式和定时器清理。

## 复现自动化验证

```sh
git clone https://github.com/aiShuiJiaoDeXioShou/dsh-chat-dock.git
cd dsh-chat-dock
npm ci
npm run check
```

CI 使用同一个命令。安装步骤和插件管理器的具体输出见 [README](../README.md)。
