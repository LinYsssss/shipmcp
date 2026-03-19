# CLI UX

## 命令

```bash
shipmcp init <spec>
shipmcp generate <spec>
shipmcp validate <spec>
shipmcp doctor
shipmcp dev
```

## 设计原则

- `init` 面向第一次使用的人
- `generate` 面向脚本化和 CI
- `validate` 面向排错
- `doctor` 面向环境检查
- `dev` 留给生成项目本地调试

## 当前支持的过滤参数

```bash
--include-tags pets,admin
--exclude-tags internal
--include-methods get,post
--exclude-methods delete
```

这些过滤器的作用是先裁剪 OpenAPI operation，再生成 MCP tools。对大 spec 很关键，否则会一次性吐出过多 tools，导致 README、测试和使用体验都变差。

## 关键体验要求

- 所有失败都要给出可执行的下一步
- 所有成功都要打印下一条命令
- 默认输出简洁，不铺陈
- 错误信息采用 `发生了什么 / 为什么 / 怎么修`
