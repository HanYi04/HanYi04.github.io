#!/bin/bash
# 新建一篇文章：./new-post.sh "文章标题"
set -e
title="${1:-未命名}"
date_prefix=$(date +%Y-%m-%d)
slug=$(echo "$title" | tr ' ' '-' | tr -d '/\\:*?"<>|')
cd "$(dirname "$0")"
file="_posts/${date_prefix}-${slug}.md"

if [ -e "$file" ]; then
  echo "文件已存在：$file"
  exit 1
fi

# 用引号包住分隔符，模板里的 $ 和 \ 才不会被 shell 展开
cat > "$file" <<'POST'
---
layout: post
title: "__TITLE__"
date: __DATE__
summary: ""
---

在这里开始写正文。

行内公式：$E = mc^2$

独立公式（前后各留一个空行）：

$$
\hat H |\psi\rangle = E |\psi\rangle
$$
POST

# 再回填标题和日期
python3 - "$file" "$title" "$(date '+%Y-%m-%d %H:%M:%S %z')" <<'PY'
import sys
path, title, date = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(path, encoding='utf-8').read()
s = s.replace('__TITLE__', title).replace('__DATE__', date)
open(path, 'w', encoding='utf-8').write(s)
PY

echo "已创建：$file"
