# v0.1 技术架构

```mermaid
flowchart LR
    A["CLI: init / generate / validate / doctor"] --> B["Spec Loader"]
    B --> C["Spec Validator"]
    C --> D["Operation Normalizer"]
    D --> E["Generation Planner"]
    E --> F["Template Renderer"]
    F --> G["Generated MCP Repository"]

    subgraph Generated Repository
      G --> H["src/server.ts"]
      G --> I["src/client.ts"]
      G --> J["src/tools.ts"]
      G --> K["tests/*"]
      G --> L["Dockerfile"]
      G --> M[".github/workflows/ci.yml"]
      G --> N["README.md"]
    end
```

## 包职责

- `packages/cli`：命令入口、参数解析、用户输出
- `packages/generator`：spec 加载、校验、标准化、文件生成
- `packages/runtime`：环境检查与共享运行时工具

## 当前实现策略

仓库内部先使用零依赖 Node.js 实现，降低冷启动成本。生成出的用户项目保持 TypeScript 方向，便于后续正式发布到 npm 时平滑升级。
