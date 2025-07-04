# 快速开始

本指南将帮助您快速设置并运行日历应用。

## 环境要求

- Node.js 18+
- npm 9+ 或 yarn 1.22+
- Git

## 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/yourusername/calendar-app.git
   cd calendar-app
   ```
2. **安装依赖**

```bash
npm install
# 或
yarn install
```

3. **配置环境变量**

在 `.env` 文件中添加以下环境变量：

```bash
VITE_API_BASE_URL=http://localhost:3001
```

4. **启动开发服务器**

```bash
npm run dev
```

5. **启动模拟服务器**

```bash
npm run mock-server
```

应用将在 http://localhost:5173 运行

测试账号
邮箱: test@example.com

密码: password123

## 项目结构

```
calendar-app/
├── src/
│ ├── application/ # 应用逻辑层
│ ├── domain/ # 领域模型
│ ├── infrastructure/ # 基础设施
│ ├── presentation/ # UI 展示层
│ └── App.tsx # 应用入口
├── mock-server.ts # 模拟后端服务
├── vite.config.ts # Vite 配置
└── package.json # 项目依赖
```

## 构建生产版本

```bash
npm run build
```

构建结果将输出到 dist 目录
