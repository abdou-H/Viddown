# Viddown - Multi-Platform Video Downloader

Viddown is a powerful web application built with Node.js that allows users to download videos from hundreds of websites, including YouTube, Facebook, Twitter, TikTok, and many more. It uses the powerful `yt-dlp` engine in the backend.

## Features
-   Simple and clean user interface.
-   Supports hundreds of websites, thanks to `yt-dlp`.
-   Downloads videos in the best available MP4 format.

## Tech Stack
-   **Backend:** Node.js, Express.js
-   **Frontend:** EJS (Embedded JavaScript templates), CSS
-   **Core Engine:** `yt-dlp-wrap` (a wrapper for the `yt-dlp` command-line program).

---

## Local Setup

To run this project on your local machine, follow these steps.

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
    This command will also automatically download the correct `yt-dlp` binary for your system.

4.  **Start the server:**
    ```bash
    npm start
    ```
    The application will be running at `http://localhost:3000`.

---

## Deployment Warning

This project is more complex to deploy than a standard Node.js application because it has external dependencies:
1.  **`yt-dlp`**: The core download engine.
2.  **`Python`**: `yt-dlp` is a Python program and requires a Python runtime to be installed on the server.

**Recommended Hosting Platforms:**
-   **Render**: You will need to use a Dockerfile to create a custom environment that installs Node.js, Python, and yt-dlp.
-   **Heroku**: You will need to add buildpacks for both Node.js and Python.
-   **VPS (DigitalOcean, Linode, etc.)**: This gives you full control to install all dependencies manually, making it the most reliable option.

Static hosting platforms like Vercel or Netlify **will not work** with this project.
