const express = require('express');
const ytdl = require('ytdl-core');
const cp = require('child_process');
const readline = require('readline');
const ffmpeg = require('ffmpeg-static');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', { success: false, error: null });
});

app.post('/download', async (req, res) => {
    const videoURL = req.body.url;

    if (!videoURL || !ytdl.validateURL(videoURL)) {
        return res.render('index', { success: false, error: "Please provide a valid YouTube URL." });
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^\x00-\x7F]/g, "");

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

        const audio = ytdl(videoURL, { quality: 'highestaudio' });
        const video = ytdl(videoURL, { quality: 'highestvideo' });

        const ffmpegProcess = cp.spawn(ffmpeg, [
            '-loglevel', '8', '-hide_banner',
            '-i', 'pipe:3',
            '-i', 'pipe:4',
            '-c:v', 'copy',
            '-c:a', 'aac',
            '-f', 'mp4',
            'pipe:5'
        ], {
            windowsHide: true,
            stdio: [
                'inherit', 'inherit', 'inherit',
                'pipe', 'pipe', 'pipe'
            ]
        });

        audio.pipe(ffmpegProcess.stdio[3]);
        video.pipe(ffmpegProcess.stdio[4]);
        ffmpegProcess.stdio[5].pipe(res);

        ffmpegProcess.on('error', (err) => {
            console.error('FFmpeg process error:', err);
        });

        ffmpegProcess.stderr.on('data', (data) => {
            console.error(`FFmpeg stderr: ${data}`);
        });

        ffmpegProcess.on('close', (code) => {
            console.log(`FFmpeg process exited with code ${code}`);
        });

    } catch (err) {
        console.error(err);
        res.render('index', { success: false, error: "Failed to download video. The video might be private, age-restricted, or the URL is invalid." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
