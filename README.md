# Viddown - YouTube Video Downloader

Viddown is a simple web application built with Node.js and Express that allows users to download YouTube videos with both video and audio merged.

## Features
-   Simple and clean user interface.
-   Enter a YouTube URL and get a download link.
-   Merges the highest quality video and audio streams using FFmpeg.

## Tech Stack
-   **Backend:** Node.js, Express.js
-   **Frontend:** EJS (Embedded JavaScript templates), CSS
-   **Core Logic:** `ytdl-core` for fetching video streams.
-   **Processing:** `ffmpeg-static` for merging video and audio.

---

## Local Setup

To run this project on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/abdou-H/Viddown.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd Viddown
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Start the server:**
    ```bash
    npm start
    ```
    The application will be running at `http://localhost:3000`.

---

## Deployment Notes

This project uses **FFmpeg**, which is a system dependency and can be resource-intensive. Therefore, it may not work on all hosting platforms, especially static hosting platforms like Vercel or Netlify.

**Recommended Hosting Platforms:**
-   **Render**: Has good support for Node.js backends and system dependencies. You may need to add a buildpack for FFmpeg.
-   **Heroku**: Similar to Render, you'll likely need to add a custom FFmpeg buildpack in your project settings.
-   **VPS (DigitalOcean, Linode, etc.)**: This gives you full control to install FFmpeg manually, making it the most reliable option.
