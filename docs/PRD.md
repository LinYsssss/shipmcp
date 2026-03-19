# ShipMCP PRD

## 1. 产品定位

ShipMCP 是一个把 `OpenAPI` 文档转换为 **可运行、可测试、可发布的 MCP Server 仓库** 的开源脚手架。

一句话定义：

> 给我一个 OpenAPI 文档，返回一个你可以直接 ship 的 MCP 项目。

## 2. 目标用户

- API-first SaaS 团队
- 独立开发者
- 内部工具工程师
- DevRel / Solution Engineer

## 3. 核心痛点

现在很多团队已经有 REST/OpenAPI，但从 API 文档到 MCP Server 之间仍然存在重复劳动：

- tool 定义要手写
- auth 接入要手写
- 请求封装要手写
- 测试和 CI 还要再补
- demo 容易，交付难

ShipMCP 的目标不是替代工程判断，而是先把 80% 的重复搭建工作压缩掉。

## 4. 核心价值

- 输出的是仓库，不是一段临时代码
- 代码可读、可改、可提交
- 默认带 auth、Docker、测试、CI
- 适合做 demo，也适合继续工程化

## 5. v0.1 范围

### 必做

- 支持本地/远程 OpenAPI 3.x
- 生成 TypeScript MCP Server
- 支持 API Key / Bearer Token
- 生成 `.env.example`
- 生成 README
- 生成 Dockerfile
- 生成 GitHub Actions
- 生成基础测试
- 提供 3 个 examples

### 不做

- OAuth 浏览器登录
- GraphQL
- Web GUI
- 云托管
- 多语言生成

## 6. 成功指标

- 首次生成成功率 > 70%
- 中等 spec 生成时间 < 90 秒
- 新用户本地跑通时间 < 15 分钟
- 首月 Star > 300
- 首月外部 PR > 5

## 7. 产品原则

- 默认优于可配
- 稳定优于花哨
- 失败必须可诊断
- README 必须服务转化
