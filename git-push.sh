#!/bin/bash

# 拉取远程仓库的最新更改
git pull

# 检查是否有更改
if git diff-index --quiet HEAD --; then
    echo "没有更改，无需提交。"
    exit 0
fi

# 添加所有更改到暂存区
git add .

# 提交更改
echo "请输入提交信息: "
read commit_message
git commit -m "$commit_message"

# 推送更改到远程仓库
git push

echo "更改已成功推送到远程仓库。"
