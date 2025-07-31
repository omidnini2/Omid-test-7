// Persian Voice Cloning AI Web App - SPA UI
const app = document.getElementById('app');

let theme = localStorage.getItem('theme') || 'light';
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : '');
  localStorage.setItem('theme', t);
  theme = t;
}
setTheme(theme);

function render() {
  app.innerHTML = `
    <div class="theme-toggle">
      <label>
        <input type="checkbox" id="themeSwitch" ${theme === 'dark' ? 'checked' : ''} />
        تم دارک
      </label>
    </div>
    <h1>کلون صدای فارسی با هوش مصنوعی</h1>
    <form id="voiceForm">
      <div class="upload-section">
        <label>آپلود یا ضبط صدای خود (حداکثر ۲۰ دقیقه یا ۵۰ مگابایت):</label>
        <input type="file" id="voiceFile" accept="audio/*" />
        <button type="button" id="recordBtn">ضبط صدا</button>
        <audio id="audioPreview" controls style="display:none;"></audio>
      </div>
      <div class="text-section">
        <label>متن مورد نظر (حداکثر ۱۰۰,۰۰۰ کاراکتر):</label>
        <textarea id="textInput" maxlength="100000" placeholder="متن خود را وارد کنید..."></textarea>
      </div>
      <button type="submit">تبدیل به گفتار با صدای من</button>
    </form>
    <div class="output-section" id="outputSection" style="display:none;">
      <label>دانلود و اشتراک‌گذاری خروجی:</label>
      <audio id="outputAudio" controls></audio>
      <br>
      <button id="downloadBtn">دانلود فایل</button>
      <button id="shareBtn">اشتراک‌گذاری</button>
    </div>
    <hr>
    <div>
      <b>زبان‌های پشتیبانی‌شده:</b>
      <span id="langs">فارسی، انگلیسی، عربی، فرانسوی، آلمانی، روسی، چینی، ژاپنی، اسپانیایی و ...</span>
    </div>
  `;

  document.getElementById('themeSwitch').onchange = e => setTheme(e.target.checked ? 'dark' : 'light');

  // ضبط صدا
  let mediaRecorder, audioChunks = [];
  const recordBtn = document.getElementById('recordBtn');
  const audioPreview = document.getElementById('audioPreview');
  recordBtn.onclick = async function() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      recordBtn.textContent = 'ضبط صدا';
      return;
    }
    if (!navigator.mediaDevices) {
      alert('مرورگر شما ضبط صدا را پشتیبانی نمی‌کند.');
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      audioPreview.src = URL.createObjectURL(audioBlob);
      audioPreview.style.display = 'block';
      // قرار دادن فایل ضبط‌شده در input
      const file = new File([audioBlob], 'recorded.webm', { type: 'audio/webm' });
      const dt = new DataTransfer();
      dt.items.add(file);
      document.getElementById('voiceFile').files = dt.files;
    };
    mediaRecorder.start();
    recordBtn.textContent = 'پایان ضبط';
  };

  // پیش‌نمایش فایل صوتی آپلودی
  document.getElementById('voiceFile').onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
      audioPreview.src = URL.createObjectURL(file);
      audioPreview.style.display = 'block';
    }
  };

  // ارسال فرم
  document.getElementById('voiceForm').onsubmit = async function(e) {
    e.preventDefault();
    const file = document.getElementById('voiceFile').files[0];
    const text = document.getElementById('textInput').value.trim();
    if (!file) return alert('لطفاً یک فایل صوتی آپلود یا ضبط کنید.');
    if (!text) return alert('لطفاً متن را وارد کنید.');
    if (file.size > 50 * 1024 * 1024) return alert('حجم فایل نباید بیشتر از ۵۰ مگابایت باشد.');
    // ارسال به API (در نسخه بعدی)
    alert('در نسخه بعدی، فایل و متن به هوش مصنوعی ارسال می‌شود.');
    // شبیه‌سازی خروجی
    document.getElementById('outputSection').style.display = 'block';
    document.getElementById('outputAudio').src = audioPreview.src;
  };

  // دانلود و اشتراک‌گذاری
  document.getElementById('downloadBtn').onclick = function() {
    const audio = document.getElementById('outputAudio');
    const a = document.createElement('a');
    a.href = audio.src;
    a.download = 'output.webm';
    a.click();
  };
  document.getElementById('shareBtn').onclick = function() {
    const audio = document.getElementById('outputAudio');
    if (navigator.share) {
      fetch(audio.src).then(r => r.blob()).then(blob => {
        const file = new File([blob], 'output.webm', { type: 'audio/webm' });
        navigator.share({ files: [file], title: 'Voice Clone Output' });
      });
    } else {
      alert('اشتراک‌گذاری توسط مرورگر شما پشتیبانی نمی‌شود.');
    }
  };
}

render();