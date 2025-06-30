const translations = {
  ar: {
    title: "أداة تحميل الفيديوهات",
    placeholder: "ضع الرابط هنا",
    button: "تحميل",
    status_start: "📥 جاري التحميل...",
    status_done: "✅ تم التحميل!",
    status_error: "⚠️ فشل التحميل",
    status_server_error: "❌ خطأ أثناء الاتصال بالخادم"
  },
  en: {
    title: "Video Downloader Tool",
    placeholder: "Paste the URL here",
    button: "Download",
    status_start: "📥 Downloading...",
    status_done: "✅ Download complete!",
    status_error: "⚠️ Download failed",
    status_server_error: "❌ Server error"
  },
  fr: {
    title: "Outil de téléchargement vidéo",
    placeholder: "Collez le lien ici",
    button: "Télécharger",
    status_start: "📥 Téléchargement en cours...",
    status_done: "✅ Téléchargement terminé !",
    status_error: "⚠️ Échec du téléchargement",
    status_server_error: "❌ Erreur du serveur"
  },
  de: {
    title: "Video-Download-Tool",
    placeholder: "Fügen Sie den Link hier ein",
    button: "Herunterladen",
    status_start: "📥 Wird heruntergeladen...",
    status_done: "✅ Heruntergeladen!",
    status_error: "⚠️ Download fehlgeschlagen",
    status_server_error: "❌ Serverfehler"
  },
  es: {
    title: "Herramienta para descargar videos",
    placeholder: "Pega el enlace aquí",
    button: "Descargar",
    status_start: "📥 Descargando...",
    status_done: "✅ Descarga completa!",
    status_error: "⚠️ Falló la descarga",
    status_server_error: "❌ Error del servidor"
  },
  zh: {
    title: "视频下载工具",
    placeholder: "请在此粘贴链接",
    button: "下载",
    status_start: "📥 正在下载...",
    status_done: "✅ 下载完成！",
    status_error: "⚠️ 下载失败",
    status_server_error: "❌ 服务器错误"
  },
  tr: {
    title: "Video İndirme Aracı",
    placeholder: "Bağlantıyı buraya yapıştırın",
    button: "İndir",
    status_start: "📥 İndiriliyor...",
    status_done: "✅ İndirme tamamlandı!",
    status_error: "⚠️ İndirme başarısız",
    status_server_error: "❌ Sunucu hatası"
  },
  hi: {
    title: "वीडियो डाउनलोड टूल",
    placeholder: "यहाँ लिंक पेस्ट करें",
    button: "डाउनलोड करें",
    status_start: "📥 डाउनलोड हो रहा है...",
    status_done: "✅ डाउनलोड पूरा!",
    status_error: "⚠️ डाउनलोड विफल",
    status_server_error: "❌ सर्वर त्रुटि"
  },
  ru: {
    title: "Инструмент загрузки видео",
    placeholder: "Вставьте ссылку сюда",
    button: "Скачать",
    status_start: "📥 Загрузка...",
    status_done: "✅ Загрузка завершена!",
    status_error: "⚠️ Сбой загрузки",
    status_server_error: "❌ Ошибка сервера"
  }
};

function changeLanguage(lang) {
  const t = translations[lang] || translations.en;

  // Update HTML lang attribute for accessibility
  document.documentElement.lang = lang;

  document.getElementById("title").textContent = t.title;
  document.getElementById("url").placeholder = t.placeholder;
  document.getElementById("download-btn").textContent = t.button;

  localStorage.setItem("lang", lang);
}

function onLangSelectChange() {
  const selectedLang = document.getElementById("lang").value;
  changeLanguage(selectedLang);
}

async function downloadMedia() {
  const urlInput = document.getElementById('url');
  const format = document.getElementById('format').value;
  const status = document.getElementById('status');
  const bar = document.getElementById('progress-bar');
  const inner = document.getElementById('progress-inner');
  const downloadBtn = document.getElementById('download-btn');
  const lang = document.getElementById("lang").value;
  const t = translations[lang] || translations.en;

  if (!urlInput.value) {
    status.textContent = t.placeholder; // Prompt user to enter a URL
    return;
  }

  bar.style.display = 'block';
  inner.style.width = '0%';
  status.textContent = t.status_start;
  downloadBtn.disabled = true; // Disable button during download

  const evtSource = new EventSource('/progress');
  evtSource.onmessage = (e) => {
    inner.style.width = e.data + '%';
  };

  try {
    const res = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlInput.value, format }),
    });

    evtSource.close();

    if (!res.ok) {
      const errorData = await res.json();
      // Display detailed error from server if available
      status.textContent = `${t.status_error}: ${errorData.details || ''}`;
      inner.style.width = '0%';
      bar.style.display = 'none';
      return;
    }

    inner.style.width = '100%';
    const blob = await res.blob();
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    
    // Create a better filename
    const filename = (urlInput.value.split('v=')[1] || `media_${Date.now()}`).split('&')[0];
    a.download = `${filename}.${format}`;
    
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(downloadUrl);
    
    status.textContent = t.status_done;
    urlInput.value = ''; // Clear input on success
  } catch (err) {
    evtSource.close();
    status.textContent = t.status_server_error;
    console.error("Download error:", err);
  } finally {
    downloadBtn.disabled = false; // Re-enable button
  }
}

// Set up event listeners and initial language when the page loads
window.onload = () => {
  let savedLang = localStorage.getItem("lang");

  if (!savedLang) {
    const browserLang = navigator.language.slice(0, 2);
    savedLang = translations[browserLang] ? browserLang : "en";
  }

  document.getElementById("lang").value = savedLang;
  changeLanguage(savedLang);

  // Attach event listeners using modern JS
  document.getElementById("lang").addEventListener("change", onLangSelectChange);
  document.getElementById("download-btn").addEventListener("click", downloadMedia);
};
