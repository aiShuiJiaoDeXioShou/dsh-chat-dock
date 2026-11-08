# Security

## 设计边界

`dsh-chat-dock` 是一个纯客户端 UI 插件：

- 不读取、不保存账号 token、cookie 或密码。
- 不发起后台网络请求；Chat 页面由 DSH 内置 Browser 加载。
- 抓取内容只留在当前页面内存，用于控制台镜像、复制和插入。
- 不注册模型工具，不写会话事件，不上传页面内容。
- 自定义站点的 `latestReply` 是用户提供的代码，只在当前 guest 页面执行；插件不校验其安全性。

## 报告漏洞

请通过 GitHub Security Advisories 私下报告：

https://github.com/aiShuiJiaoDeXioShou/dsh-chat-dock/security/advisories/new

报告里请包含：

- 受影响的版本和 DSH 版本。
- 复现步骤或最小页面。
- 影响范围，例如是否能读到其他会话、是否能执行任意页面代码、是否能绕过权限。

不要在公开 issue 里贴账号凭据、cookie 或完整的页面内容。

## 不在范围内

- Chat 站点自身的登录、风控或账号安全问题。
- 用户自行填写的自定义抓取脚本造成的后果。
- DSH 内置 Browser 的租约策略或 Electron 安全模型。
- 站点服务条款允许范围之外的自动化使用。
