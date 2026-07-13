#!/usr/bin/env bash
# 推送 spark-journey-demo 到 GitHub
# 前提：已在 GitHub 登录（SSH 或 gh CLI）

set -e
cd "$(dirname "$0")/.."

REPO="liuchao0739/spark-journey-demo"

if ! git remote get-url origin &>/dev/null; then
  git remote add origin "git@github.com:${REPO}.git"
fi

# 方式 A：gh CLI（需先 gh auth login）
if command -v gh &>/dev/null && gh auth status &>/dev/null; then
  echo "→ 使用 gh 创建仓库并推送..."
  gh repo create "$REPO" --public --source=. --remote=origin \
    --description "Spark healing journey demo - Expo + Express interview project" \
    --push 2>/dev/null || git push -u origin main
  echo "✅ 完成: https://github.com/${REPO}"
  exit 0
fi

# 方式 B：手动创建后 SSH 推送
echo "请先在 GitHub 创建空仓库: https://github.com/new?name=spark-journey-demo"
echo "  - Owner: liuchao0739"
echo "  - 不要勾选 README / .gitignore（本地已有）"
echo ""
read -p "创建完成后按 Enter 继续推送..."

git push -u origin main
echo "✅ 完成: https://github.com/${REPO}"
