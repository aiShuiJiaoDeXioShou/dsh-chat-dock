# Contributing

## Setup

```sh
npm ci
npm run check
```

`npm run check` 会依次执行 typecheck、构建 `client/client.js` 和测试。提交前必须通过。

## 代码约定

- TypeScript strict；客户端和测试使用不同的 tsconfig。
- 不 import 任何 `@deepseek-ai/dsh-client-*` 包。宿主组件用仓库内的实现或原生元素。
- 样式只使用 `--dsw-alias-*` theme token，类名统一 `dsh-chat-dock-` 前缀。
- 新增用户可见文案必须同时加 `src/client/locale.ts` 的 `zh` 和 `en` 字典；插件元数据加 `locale/*.json`。
- 访问 DOM、`ctx.get`、`sidebarRight` 和 webview 时必须做防御式判断。slot 组件不能因为宿主升级而抛异常。
- 抓取结果按纯文本处理，不使用 `dangerouslySetInnerHTML`。
- 不在浏览器里发起后台网络请求。

## 增加站点适配器

见 [docs/adapters.md](docs/adapters.md)。至少包含：

- `src/shared/sites.ts` 的自包含页面函数和注册表条目。
- `tests/sites.test.ts` 的 DOM 假节点测试。
- 内置适配器表格和 README 的站点说明。

## 测试

- 纯逻辑放 `src/shared/`，用 `node:test` 覆盖边界。
- DOM 依赖用伪造的 `document`、`window` 或本地假对象，不启动真实浏览器。
- React 组件用 `react-dom/server` 做静态渲染测试；交互需要手动按 [docs/verification.md](docs/verification.md) 验收。
- 新增失败路径时同时测成功路径和失败路径。

## 提交前自查

- [ ] `npm run check` 通过。
- [ ] 新增文案有中英文。
- [ ] 卸载插件后没有残留定时器、全局样式或 DOM。
- [ ] 没有把账号 token、cookie 或页面内容写进日志、配置或测试 fixture。
- [ ] 文档里的行为与代码一致，未验证的能力明确标注。

## 报告问题

请说明 DSH 版本、操作系统、右侧栏 Browser 是否启用、站点和页面语言。抓取失败时附上页面结构截图或选择器，不要附账号凭据。
