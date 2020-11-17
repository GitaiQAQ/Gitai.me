#!/bin/sh

# If a command fails then the deploy stops
set -e

# Commit changes.
msg="rebuilding site $(date)"
if [ -n "$*" ]; then
	msg="$*"
fi

git add .

git commit -m "$msg"

git push origin master:master

hugo

printf "\033[0;32mDeploying updates to GitHub...\033[0m\n"

# Build the project.
hugo # if using a theme, replace with `hugo -t <YOURTHEME>`

# Go To Public folder
cd public

# git init

# git add origin https://github.com/GitaiQAQ/Gitai.me.git

# Add changes to git.
git add .

git commit -m "$msg"

# Push source and build repos.
git push origin master:gh-pages -f