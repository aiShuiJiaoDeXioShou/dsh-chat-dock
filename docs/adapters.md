# 站点适配器

一个站点适配器是一组纯数据加一个页面内抓取函数。插件用 `pageScript()` 把函数序列化成 IIFE，再交给 `webview.executeJavaScript`。

## 接口

```ts
interface WebChatSite {
  id: string
  label: { en: string; zh: string }
  url: string
  hosts: string[]
  loginHint?: { en: string; zh: string }
  extraction: {
    latestReply: string
    conversation?: string
    loggedIn?: string
  }
  enabledByDefault: boolean
  experimental?: boolean
}
```

约束：

- `latestReply` 必须返回字符串。返回值会经过 `normalizeCapture`，去掉零宽字符、统一换行、截断到 200000 字符。
- 页面函数只能引用浏览器全局对象。它不能引用模块 import、闭包变量、TypeScript helper 或其他源文件。
- 函数内部不要使用 `instanceof HTMLElement` 这类依赖全局构造器的判断；用 `innerText ?? textContent` 的结构判断，序列化后更稳。
- `hosts` 支持子域匹配：`chat.deepseek.com` 会匹配 `sub.chat.deepseek.com`，不会匹配 `evilchat.deepseek.com`。

## 内置适配器

| id | 地址 | 默认 | 说明 |
|---|---|---|---|
| `deepseek` | `https://chat.deepseek.com/` | 启用 | 取最后一个可见的 `.ds-markdown`；类名变化时依次尝试 `[class*="ds-markdown"]`、`[class*="markdown"]` |
| `chatgpt` | `https://chatgpt.com/` | 关闭 | 取最后一个 `[data-message-author-role="assistant"]`；实验 |
| `claude` | `https://claude.ai/` | 关闭 | 尝试 `.font-claude-message` 和 `[data-testid*="message"]`；实验 |

DeepSeek 的抓取顺序：

1. 收集 `.ds-markdown`、`[class*="ds-markdown"]`、`[class*="markdown"]` 中可见的节点。
2. 去掉被其他候选节点包含的节点，取最后一个。
3. 读 `innerText`。
4. 没有候选时读当前选区。
5. 选区也为空时返回空字符串，控制台显示“没有找到可抓取的回复”。

ChatGPT 和 Claude 的适配器使用同样的“最后一条可见回复加选区兜底”思路，但选择器没有在真实账号上验证，默认关闭。

## 自定义站点

控制台设置里的 **自定义站点（JSON）** 接受一个数组。校验是严格的：任何一项非法都会拒绝整个数组，避免一次笔误悄悄删掉站点。

```json
[
  {
    "id": "team-chat",
    "label": "Team Chat",
    "url": "https://chat.example.com/",
    "hosts": ["chat.example.com"],
    "latestReply": "(() => { const nodes = document.querySelectorAll('[data-role=\"assistant\"]'); const last = nodes[nodes.length - 1]; return last ? (last.innerText || last.textContent || '') : '' })()",
    "enabled": true
  }
]
```

字段：

| 字段 | 类型 | 必填 | 默认 |
|---|---|---|---|
| `id` | string | 是 | 无，1 到 48 个字符 |
| `label` | string | 是 | 无，最多 64 个字符 |
| `url` | string | 是 | 无，必须 http(s) |
| `hosts` | string[] | 否 | 从 `url` 推导 |
| `latestReply` | string | 否 | 正文尾部兜底 |
| `enabled` | boolean | 否 | `true` |

内置站点 id 会被保留；自定义站点 id 会加上 `custom:` 前缀，例如 `custom:team-chat`。不要在自定义站点里重复内置 id，重复项会被忽略。

`latestReply` 会在 Chat 页面的上下文里执行。只填写你信任的脚本。

## 新增内置适配器

1. 在 `src/shared/sites.ts` 新增一个自包含函数，例如 `extractExampleLatest`。
2. 在 `DEFAULT_SITES` 里加一条记录，`extraction.latestReply` 用 `pageScript(extractExampleLatest)`。
3. 在 `tests/sites.test.ts` 增加 DOM 假节点测试，至少覆盖“最后一条可见回复”和“选区兜底”。
4. 如果默认启用，把 `enabledByDefault` 设为 `true`；否则保持 `false` 并标记 `experimental`。
5. 在 `docs/adapters.md` 的内置适配器表格里补一行。

页面函数在测试里可以直接调用。把伪造的 `document` 和 `window` 挂到 `globalThis`，再调用导出的函数即可；`pageScript` 的序列化结果不参与单测，但必须保证函数本身只依赖全局对象。

## 调试抓取

- 在控制台点 **抓取**，看镜像区域和状态行。
- 抓取为空时，先在 Chat 页面里选中一段回复，再点抓取，验证选区兜底是否工作。
- 仍为空时，检查 Browser 标签的地址是否和站点 `hosts` 匹配。
- 需要临时覆盖时，在设置里修改自定义站点的 `latestReply`；内置站点的覆盖字段已经存在于设置类型里，但 v0.1 没有为内置站点提供脚本编辑 UI。
- 不要用 `console.log` 作为唯一诊断手段：guest 页面的日志不在 DSH 主控制台里。

## 已知边界

- 页面是动态渲染的，选择器会随站点改版失效。
- 抓取只读当前可见 DOM；虚拟滚动列表可能拿不到更早的消息。
- 跨域 iframe 里的聊天内容读不到。
- 页面未登录、被风控拦截或加载失败时，抓取返回空；插件不会尝试绕过。
