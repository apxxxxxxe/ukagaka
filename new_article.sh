#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <title>"
  exit 1
fi

title=$1

dir=$(dirname $0)

article_dir=$dir/content/$title

if [ -e $article_dir ]; then
  echo "Article already exists"
  exit 1
fi

mkdir -p $article_dir

cat > $article_dir/index.md <<EOF
---
title: "$title"
date: "$(date +'%Y%m%d')"
tags: [""]
summery: ""
---
EOF

$EDITOR $article_dir/index.md
