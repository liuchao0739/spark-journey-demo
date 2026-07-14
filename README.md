# Spark Journey Demo

> 重庆亦之趣科技 · AI App 全栈高级开发工程师 · 面试 Demo

Spark 疗愈旅程 App — 开发计划书 + 可运行 Demo

**GitHub**：https://github.com/liuchao0739/spark-journey-demo

## 目录

```
yizhiqu-demo/
├── docs/开发计划书.md      # 一测交付：开发计划书
├── docs/录屏脚本.md        # 二测录屏分镜脚本
├── docs/录屏文件.mp4       # 二测交付：Demo 运行录屏成片
├── docs/spark-demo.apk     # 二测交付：Android APK
├── docs/面试问答备忘.md    # 面试问答提纲
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
| 底部 5 Tab 导航（默认中文） | ✅ |
| 旅程地图（14 节点 / S 形路径 / 滚动切章） | ✅ |
| 当前节点小范围星星簇动画 | ✅ |
| 章节头部 + Bottom Sheet | ✅ |
| 第 2 章路径首部分隔线「思维」 | ✅ |
| 节点弹窗 + 课程学习全流程 | ✅ |
| 长文分段阅读（文末菊花 + 自上而下 reveal） | ✅ |
| 完成评分 + 解锁下一课 + 星星积分 | ✅ |
| 前端 / 后端 i18n（zh-CN / en-US） | ✅ |
| Aa 字号调节 + 段落进度条 | ✅ |

## 打包

### Web

```bash
cd spark-demo-app
npm run export:web
# 输出在 dist/
```

### APK

仓库已附带可安装包：[`docs/spark-demo.apk`](docs/spark-demo.apk)（约 68MB）。

**本地重新打包**（需 Android SDK，已验证）：

```bash
cd spark-demo-app
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
cp app/build/outputs/apk/release/app-release.apk ../../docs/spark-demo.apk
```

也可使用 EAS 云端（需先 `npx eas-cli login`）：

```bash
cd spark-demo-app
npx eas-cli build --platform android --profile preview
```

配置见 `spark-demo-app/eas.json`（preview 产物为 apk）。

**联调说明**：

- 模拟器默认 API：`http://10.0.2.2:3000/api/v1`（需本机后端已启动）
- 真机：在 `app.json` 设置 `extra.apiUrl` 为本机局域网地址后重新打包

### 后端 Docker

```bash
cd spark-demo-api
docker build -t spark-demo-api .
docker run -p 3000:3000 spark-demo-api
```

## 录屏

| 材料 | 路径 |
|------|------|
| 分镜脚本 | [`docs/录屏脚本.md`](docs/录屏脚本.md) |
| 成片（二测提交） | [`docs/录屏文件.mp4`](docs/录屏文件.mp4) |
| Android APK | [`docs/spark-demo.apk`](docs/spark-demo.apk) |

建议时长 4–6 分钟；按脚本录制后成片已放入仓库 `docs/`。

## 面试准备

围绕本 Demo 的问答提纲见 [`docs/面试问答备忘.md`](docs/面试问答备忘.md)（开场介绍、架构/前后端深挖、AI 协作、反问清单、演示 Checklist）。

## 已知限制

- 今日 / 探索 / 陪伴 Tab 为占位页（Demo 聚焦旅程核心流程）
- 未接入真实用户登录，默认单用户（id=1）
- iOS 本地构建需 macOS + Xcode
