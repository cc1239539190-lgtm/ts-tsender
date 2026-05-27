# TSender

批量 ERC-20 代币空投工具。基于 Next.js 16 + wagmi + RainbowKit 构建的前端 dApp。

## 功能

-   **钱包连接** — 支持 MetaMask 和 WalletConnect
-   **批量空投** — 支持逗号或换行分隔的地址/数额列表
-   **Safe / Unsafe 模式** — 带安全检查的标准合约 vs 极致 Gas 优化合约
-   **Token 信息展示** — 输入代币地址后自动显示名称、精度和余额
-   **暗色 / 亮色主题** — 一键切换，偏好保存在 localStorage

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 钱包 | wagmi v2 + RainbowKit v2 |
| 合约交互 | viem + @wagmi/core |
| 样式 | Tailwind CSS v4 |
| 单元测试 | Vitest |
| E2E 测试 | Playwright + Synpress |

## 快速开始

### 1. 环境准备

```bash
# 安装依赖
pnpm install

# 复制环境变量并填写 WalletConnect Project ID
cp .env.example .env.local
# 编辑 .env.local 填入你的 NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
```

### 2. 启动本地 Anvil

```bash
pnpm anvil
```

此命令会加载 `tsender-deployed.json` 状态文件，恢复预部署的 TSender 合约和 Mock Token。

如果状态文件不存在，使用裸 Anvil 启动并手动部署合约：

```bash
anvil --port 8545
```

### 3. 启动开发服务器

```bash
pnpm dev
```

打开 http://localhost:3000。

### 4. 配置 MetaMask

-   **RPC**: `http://127.0.0.1:8545`
-   **Chain ID**: `31337`
-   **Symbol**: `ETH`
-   **导入测试账户**: 私钥 `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`（Anvil 默认 Account #0）

## 脚本

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建
pnpm start        # 启动生产服务
pnpm anvil        # 启动 Anvil（加载预部署状态）
pnpm test         # 运行单元测试
pnpm test:watch   # 监听模式运行单元测试
pnpm test:e2e     # 运行 E2E 测试
pnpm type-check   # TypeScript 类型检查
```

## 部署

```bash
pnpm build
pnpm start
```

部署前确认 `.env.local` 中配置了生产环境的 `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`。

## 项目结构

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # 根布局
│   ├── page.tsx              # 首页
│   ├── providers.tsx         # Web3 Providers
│   └── globals.css           # 全局样式 + CSS 变量
├── components/
│   ├── AirdropForm.tsx       # 空投表单（核心逻辑）
│   ├── Header.tsx            # 顶部导航（钱包 + 主题切换）
│   └── ui/
│       ├── InputField.tsx    # 输入框 / 文本域组件
│       └── Tabs.tsx          # 标签页组件
├── constants.ts              # 合约地址 + ABI
├── rainbowKitConfig.tsx      # RainbowKit 配置
└── utils/
    ├── calculateTotal/       # 计算空投总额（bigint 安全）
    └── formatTokenAmount/    # Wei → 可读代币数量
```

## 许可

MIT
