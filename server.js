const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
// Use the port assigned by the hosting provider, or 5000 for local development
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static("public"));

let clients = [];

// Server-Sent Events endpoint for progress
app.get("/progress", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  clients.push(res);

  req.on("close", () => {
    clients = clients.filter(client => client !== res);
  });
});

function sendProgress(progress) {
  clients.forEach(res => {
    res.write(`data: ${progress}\n\n`);
  });
}

// Main download API endpoint
app.post("/api/download", async (req, res) => {
  const { url, format } = req.body;
  if (!url || !format) {
    return res.status(400).json({ error: "Missing URL or format" });
  }

  const output = `media_${Date.now()}.${format}`;
  const filePath = path.join(__dirname, output);

  const args = format === "mp3"
    ? ["-f", "bestaudio", "--extract-audio", "--audio-format", "mp3", "-o", output, url]
    : ["-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best", "-o", output, url];

  const yt = spawn("yt-dlp", args);
  let errorOutput = "";

  yt.stdout.on("data", (data) => {
    const outputStr = data.toString();
    // More robust regex to capture progress percentage
    const match = outputStr.match(/\[download\]\s+([\d\.]+)%/);
    if (match && match[1]) {
      sendProgress(match[1]);
    }
  });

  yt.stderr.on("data", (data) => {
    console.error("stderr:", data.toString());
    errorOutput += data.toString(); // Capture errors
  });

  yt.on("close", (code) => {
    if (code !== 0) {
      console.error(`yt-dlp process exited with code ${code}`);
      // Send a more informative error to the client
      const details = errorOutput.includes("Unsupported URL") ? "Unsupported URL" : "Download process failed.";
      return res.status(500).json({ error: "Download failed", details });
    }

    res.download(filePath, output, (err) => {
      if (err) {
        console.error("Error sending file:", err);
      }
      // Clean up the file from the server after download
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting file:", unlinkErr);
      });
    });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
