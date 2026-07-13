# Spark Journey Demo

> 重庆亦之趣科技 · AI App 全栈高级开发工程师 · 面试 Demo

Spark 疗愈旅程 App — 开发计划书 + 可运行 Demo

**GitHub**：https://github.com/liuchao0739/spark-journey-demo

## 目录

```
yizhiqu-demo/
├── docs/开发计划书.md      # 一测交付：开发计划书
├── docs/录屏脚本.md        # 二测录屏分镜脚本
├── spark-demo-api/         # 后端 Express + Prisma + SQLite
└── spark-demo-app/         # 前端 Expo React Native
```

## 快速启动

### 1. 启动后端

```bash
cd spark-demo-api
npm install
npm run db:reset    # 初始化数据库 + 种子数据
npm run dev         # http://localhost:3000
```

验证：`curl http://localhost:3000/api/v1/journey?locale=en-US`

### 2. 启动前端

```bash
cd spark-demo-app
npm install
npm run web         # Web 预览
# 或
npm run android     # Android 模拟器（API 地址默认 10.0.2.2:3000）
```

真机调试时，修改 `app.json` 中 `extra.apiUrl` 为你的电脑局域网 IP，例如：

```json
"extra": { "apiUrl": "http://192.168.1.100:3000/api/v1" }
```

## 功能完成情况

| 功能 | 状态 |
|------|------|
| 底部 5 Tab 导航 | ✅ |
| 旅程地图（蜿蜒路径 + 节点状态） | ✅ |
| 章节头部 + Bottom Sheet | ✅ |
| 节点弹窗 + 课程学习全流程 | ✅ |
| 长文阅读（>5000 字 HTML 排版） | ✅ |
| 完成评分 + 解锁下一课 + 星星积分 | ✅ |
| 前端 i18n（en-US / zh-CN） | ✅ |
| 后端课程数据 i18n | ✅ |
| Aa 字号调节 | ✅ |
| 阅读进度条 | ✅ |

## 打包

### Web

```bash
cd spark-demo-app
npm run export:web
# 输出在 dist/
```

### APK

```bash
npm install -g eas-cli
cd spark-demo-app
eas build --platform android --profile preview
```

或使用本地构建：

```bash
npx expo run:android
```

### 后端 Docker

```bash
cd spark-demo-api
docker build -t spark-demo-api .
docker run -p 3000:3000 spark-demo-api
```

## 录屏

详细分镜脚本见 [`docs/录屏脚本.md`](docs/录屏脚本.md)，建议时长 4–6 分钟。

## 已知限制

- 今日 / 探索 / 陪伴 Tab 为占位页（Demo 聚焦旅程核心流程）
- 未接入真实用户登录，默认单用户（id=1）
- iOS 本地构建需 macOS + Xcode
