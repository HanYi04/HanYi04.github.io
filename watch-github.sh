#!/bin/bash
# 守望脚本：GitHub 网页一旦可达，立刻弹桌面通知。
# 用法：./watch-github.sh    （Ctrl+C 停止）
cd "$(dirname "$0")"

echo "正在等 GitHub 网页可用的窗口（每 5 秒探测一次，通了会弹通知）..."
echo "保持这个窗口开着，通的时候立刻去浏览器操作。"
echo

was_up=0
while true; do
  if timeout 6 wget -q --spider --no-check-certificate https://github.com/ 2>/dev/null; then
    now=$(date +%H:%M:%S)
    if [ "$was_up" -eq 0 ]; then
      notify-send -u critical "GitHub 通了（$now）" "现在去 github.com/settings/keys 添加 SSH key，顺手把 Pages 开起来"
      echo "[$now] ✅ 通了！窗口已打开，快去浏览器操作"
      was_up=1
    fi
  else
    if [ "$was_up" -eq 1 ]; then
      echo "[$(date +%H:%M:%S)] ❌ 又断了，等下一波"
      was_up=0
    fi
  fi
  sleep 5
done
