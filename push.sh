#!/bin/bash
# 一键发布：自动提交所有改动 + 推送（网络不稳会重试）
#   ./push.sh                → 自动生成提交说明
#   ./push.sh "加了几份讲义"  → 自定义提交说明
cd "$(dirname "$0")" || exit 1

# ---- 1. 检查有没有改动 ----
if [ -z "$(git status --porcelain)" ]; then
  echo "没有需要提交的改动，所有文件都已是最新。"
  exit 0
fi

echo "── 发现以下改动 ──"
git status --short
echo

# ---- 2. 提交 ----
msg="${1:-更新 $(date '+%Y-%m-%d %H:%M')}"
git add -A
if ! git commit -q -m "$msg"; then
  echo "❌ 提交失败，已中止。"
  exit 1
fi
echo "✅ 已提交：$msg"
echo

# ---- 3. 推送（失败自动重试）----
max=40
for i in $(seq 1 $max); do
  echo "── 第 $i / $max 次推送 ──"
  if git push -u origin main; then
    echo
    echo "✅ 推送成功。1～2 分钟后网站自动更新。"
    echo "   https://hanyi04.github.io"
    exit 0
  fi
  if [ "$i" -lt "$max" ]; then
    echo "失败，5 秒后重试（Ctrl+C 可放弃，本地提交不会丢）"
    sleep 5
  fi
done

echo
echo "❌ 连续 $max 次都失败，先检查网络："
echo "   warp-cli status"
echo "   getent hosts github.com"
exit 1
