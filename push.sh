#!/bin/bash
# 自动重试推送：网络波动时反复尝试，通了就成功
# 第一次运行会要求输入用户名和 token，之后 1 小时内不再询问
cd "$(dirname "$0")"

max=40
for i in $(seq 1 $max); do
  echo "── 第 $i / $max 次尝试 ──"
  if git push -u origin main; then
    echo
    echo "✅ 推送成功，接下来去 GitHub 仓库的 Settings → Pages，把 Source 选成 GitHub Actions"
    exit 0
  fi
  if [ "$i" -lt "$max" ]; then
    echo "失败，5 秒后重试（按 Ctrl+C 可放弃，本地提交不会丢）"
    sleep 5
  fi
done
echo
echo "❌ 连续 $max 次都失败，说明现在整条线路都不通，换个时间或换网络再试"
exit 1
