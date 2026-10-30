#!/bin/bash
# 本地预览
#   ./serve.sh          → 只有本机能看 http://127.0.0.1:4000
#   ./serve.sh --lan    → 同一 WiFi 下的手机/平板也能看（会打印内网地址）
set -e
export PATH="$HOME/.local/ruby/bin:$PATH"
cd "$(dirname "$0")"

if ! command -v bundle >/dev/null 2>&1; then
  echo "没有找到 bundle，Ruby 可能没装好。先看 README.md 的「第一次安装」一节。"
  exit 1
fi

if [ ! -f Gemfile.lock ] && ! bundle check >/dev/null 2>&1; then
  echo "正在安装依赖（第一次运行需要几分钟）..."
  bundle install
fi

if [ "$1" = "--lan" ]; then
  ip=$(hostname -I 2>/dev/null | awk '{print $1}')
  echo
  echo "  本机访问：http://127.0.0.1:4000"
  [ -n "$ip" ] && echo "  同一 WiFi 的手机/平板：http://$ip:4000"
  echo "  （按 Ctrl+C 停止）"
  echo
  exec bundle exec jekyll serve --livereload --host 0.0.0.0 --port 4000
else
  exec bundle exec jekyll serve --livereload --host 127.0.0.1 --port 4000
fi
