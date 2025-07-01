#!/usr/bin/env bash
# توقف عن التنفيذ عند أول خطأ
set -o errexit

# ✅ تحديث النظام وتثبيت ffmpeg و pip
apt-get update && apt-get install -y ffmpeg python3-pip

# ✅ تثبيت أو تحديث yt-dlp
pip install --upgrade yt-dlp

# ✅ تثبيت مكتبات Node.js من package.json
npm install
