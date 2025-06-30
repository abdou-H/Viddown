#!/usr/bin/env bash
# exit on error
set -o errexit

# --- Install System Dependencies ---
# Update package list and install ffmpeg (for audio/video processing)
apt-get update && apt-get install -y ffmpeg

# Install yt-dlp using Python's package manager (most reliable method)
pip install --upgrade yt-dlp

# --- Install Node.js Dependencies ---
# This will use the version of npm/node specified by the hosting service
npm install
