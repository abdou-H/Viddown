const express = require('express');
const path = require('path');
const YtDlpWrap = require('yt-dlp-wrap');

const app = express();
const PORT = process.env.PORT || 3000;
const ytDlpWrap = new YtDlpWrap();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', { success: false, error: null, videoTitle: null });
});

app.post('/download', async (req, res) => {
    const videoURL = req.body.url;

    if (!videoURL) {
        return res.render('index', { success: false, error: "Please provide a valid URL." });
    }

    try {
        const metadata = await ytDlpWrap.getVideoInfo(videoURL);
        
        const title = metadata.title
            .replace(/[^\x00-\x7F]/g, "")
            .replace(/[\\/:*?"<>|]/g, '_');

        const format = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        
        const ytDlpStream = ytDlpWrap.execStream([
            videoURL,
            '-f', format,
        ]);
        
        console.log(`Starting download for: ${title}`);

        ytDlpStream.pipe(res);

        ytDlpStream.on('error', (error) => {
            console.error('Error during yt-dlp stream:', error);
        });
        
        ytDlpStream.on('close', () => {
            console.log(`Download finished for: ${title}`);
        });

    } catch (error) {
        console.error(error);
        const errorMessage = error.stderr || 'Failed to process video. The URL might be incorrect, private, or from an unsupported site.';
        res.render('index', { success: false, error: errorMessage.split('\n')[0] });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
