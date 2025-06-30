#!/usr/bin/env bash
# exit on error
set -o errexit

# --- Install System Dependencies ---
apt-get update && apt-get install -y ffmpeg python3-pip

# Install yt-dlp using pip
pip install --upgrade yt-dlp

# --- Install Node.js Dependencies ---
npm install
