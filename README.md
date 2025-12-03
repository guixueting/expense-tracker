# 记账本 - Expense Tracker

一个基于 Next.js 14 App Router + Prisma + TailwindCSS 构建的现代记账应用。

## 功能特性

- 📊 **仪表盘概览** - 查看本月收支情况和最近交易
- 💰 **交易管理** - 记录收入和支出，支持分类和备注
- 🏷️ **分类管理** - 自定义收入和支出分类，支持图标和颜色
- 📈 **统计报表** - 查看收支趋势和支出分布
- 💳 **账户管理** - 管理多个账户（现金、银行卡、支付宝等）

## 技术栈

- **框架**: Next.js 14 (App Router)
- **数据库**: Prisma + SQLite (可切换 PostgreSQL)
- **样式**: TailwindCSS
- **图标**: Lucide React
- **语言**: TypeScript

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 初始化数据库

```bash
# 生成 Prisma Client
npm run db:generate

# 推送数据库 schema
npm run db:push

# 填充示例数据
npm run db:seed
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
expense-tracker/
├── app/                    # Next.js App Router 页面
│   ├── (dashboard)/        # 仪表盘布局组
│   │   ├── page.tsx        # 首页
│   │   ├── transactions/   # 交易记录
│   │   ├── categories/     # 分类管理
│   │   ├── statistics/     # 统计报表
│   │   └── settings/       # 设置
│   ├── layout.tsx          # 根布局
│   └── globals.css         # 全局样式
├── components/             # React 组件
│   ├── ui/                 # 基础 UI 组件
│   ├── layout/             # 布局组件
│   ├── dashboard/          # 仪表盘组件
│   ├── transactions/       # 交易相关组件
│   ├── categories/         # 分类相关组件
│   └── settings/           # 设置相关组件
├── actions/                # Server Actions
├── lib/                    # 工具函数
├── types/                  # TypeScript 类型定义
└── prisma/                 # Prisma 配置和种子数据
```

## 数据库命令

```bash
# 生成 Prisma Client
npm run db:generate

# 推送 schema 到数据库
npm run db:push

# 填充示例数据
npm run db:seed

# 打开 Prisma Studio 查看数据
npm run db:studio

# 重置数据库并重新填充
npm run db:reset
```

## 切换到 PostgreSQL

1. 修改 `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. 更新 `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/expense_tracker"
```

3. 重新生成并推送:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

## 许可证

MIT

