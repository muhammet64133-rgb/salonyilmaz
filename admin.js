let siteData = window.siteData || {};

function initPanel() {
  // GitHub Ayarlarını Hatırla
  if (document.getElementById('gh-username')) document.getElementById('gh-username').value = localStorage.getItem('gh_username') || '';
  if (document.getElementById('gh-repo')) document.getElementById('gh-repo').value = localStorage.getItem('gh_repo') || '';
  if (document.getElementById('gh-token')) document.getElementById('gh-token').value = localStorage.getItem('gh_token') || '';

  // Mevcut Verileri Formlara Doldur
  document.getElementById('hero-title-1').value = siteData.hero?.title1 || '';
  document.getElementById('hero-title-2').value = siteData.hero?.title2 || '';
  document.getElementById('hero-description').value = siteData.hero?.description || '';
  
  const preview = document.getElementById('hero-preview');
  if (preview && siteData.hero?.image) preview.src = siteData.hero.image;

  renderServices();
  renderGallery();

  document.getElementById('contact-phone').value = siteData.contact?.phone || '';
  document.getElementById('contact-hours').value = siteData.contact?.hours || '';
  document.getElementById('contact-address').value = siteData.contact?.address || '';
}

// Resim Yükleme (ImgBB)
async function uploadImageToCloud(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch('https://api.imgbb.com/1/upload?key=c304f5fa44b0e9d63c40134f0d3663b7', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return data.success ? data.data.url : null;
  } catch (err) {
    alert("Resim yüklenirken hata oluştu.");
    return null;
  }
}

// Hero Resmi Seçildiğinde
document.getElementById('hero-file-input')?.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const status = document.getElementById('hero-upload-status');
  const preview = document.getElementById('hero-preview');
  
  if (status) status.classList.remove('hidden');
  if (preview) preview.style.opacity = '0.3';

  const uploadedUrl = await uploadImageToCloud(file);
  
  if (uploadedUrl) {
    siteData.hero.image = uploadedUrl;
    if (preview) preview.src = uploadedUrl;
  }

  if (status) status.classList.add('hidden');
  if (preview) preview.style.opacity = '1';
});

// Galeriye Resim Yükleme
document.getElementById('gallery-file-input')?.addEventListener('change', async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  const status = document.getElementById('gallery-upload-status');
  if (status) status.classList.remove('hidden');

  if (!siteData.gallery) siteData.gallery = [];

  for (const file of files) {
    const uploadedUrl = await uploadImageToCloud(file);
    if (uploadedUrl) {
      siteData.gallery.push(uploadedUrl);
      renderGallery();
    }
  }

  if (status) status.classList.add('hidden');
});

function renderServices() {
  const container = document.getElementById('services-container');
  if (!container) return;
  container.innerHTML = '';

  (siteData.services || []).forEach((s, idx) => {
    container.innerHTML += `
      <div class="bg-[#08080a] p-3 rounded-lg border border-brand-border space-y-2">
        <label class="block text-[10px] text-white/50 uppercase font-bold">Hizmet ${idx + 1}</label>
        <input type="text" id="srv-title-${idx}" value="${s.title}" class="w-full bg-[#141416] border border-brand-border rounded p-2 text-sm text-brand font-bold outline-none">
        <input type="text" id="srv-desc-${idx}" value="${s.desc}" class="w-full bg-[#141416] border border-brand-border rounded p-2 text-xs text-white/80 outline-none">
      </div>
    `;
  });
}

function renderGallery() {
  const container = document.getElementById('gallery-preview-container');
  if (!container) return;
  container.innerHTML = '';

  (siteData.gallery || []).forEach((imgSrc, index) => {
    container.innerHTML += `
      <div class="relative group rounded-lg overflow-hidden border border-brand-border h-32">
        <img src="${imgSrc}" class="w-full h-full object-cover">
        <button type="button" onclick="deleteGalleryImg(${index})" class="absolute top-1 right-1 bg-red-600 text-white text-[10px] px-2 py-1 rounded opacity-90 hover:opacity-100 cursor-pointer">
          Sil
        </button>
      </div>
    `;
  });
}

function deleteGalleryImg(index) {
  siteData.gallery.splice(index, 1);
  renderGallery();
}

// GİTHUB API İLE DOĞRUDAN KAYDETME
document.getElementById('save-github-btn')?.addEventListener('click', async () => {
  const username = document.getElementById('gh-username').value.trim();
  const repo = document.getElementById('gh-repo').value.trim();
  const token = document.getElementById('gh-token').value.trim();

  if (!username || !repo || !token) {
    alert("⚠️ Lütfen en üstteki GitHub Kullanıcı Adı, Repo Adı ve Token alanlarını doldurun!");
    return;
  }

  // Bilgileri sonraki kullanımlar için sakla
  localStorage.setItem('gh_username', username);
  localStorage.setItem('gh_repo', repo);
  localStorage.setItem('gh_token', token);

  const saveBtn = document.getElementById('save-github-btn');
  saveBtn.innerText = "⏳ Kaydediliyor...";
  saveBtn.disabled = true;

  // Form Verilerini Topla
  siteData.hero.title1 = document.getElementById('hero-title-1').value;
  siteData.hero.title2 = document.getElementById('hero-title-2').value;
  siteData.hero.description = document.getElementById('hero-description').value;

  siteData.services = (siteData.services || []).map((_, idx) => ({
    title: document.getElementById(`srv-title-${idx}`).value,
    desc: document.getElementById(`srv-desc-${idx}`).value
  }));

  if (!siteData.contact) siteData.contact = {};
  siteData.contact.phone = document.getElementById('contact-phone').value;
  siteData.contact.hours = document.getElementById('contact-hours').value;
  siteData.contact.address = document.getElementById('contact-address').value;

  const newContent = `window.siteData = ${JSON.stringify(siteData, null, 2)};`;
  const encodedContent = btoa(unescape(encodeURIComponent(newContent)));

  try {
    // 1. Önce mevcut data.js'in SHA kodunu al
    const getFile = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/data.js`, {
      headers: { 'Authorization': `token ${token}` }
    });

    let sha = '';
    if (getFile.ok) {
      const fileData = await getFile.json();
      sha = fileData.sha;
    }

    // 2. GitHub API üzerinden dosyayı güncelle
    const updateFile = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/data.js`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Panelden otomatik güncelleme',
        content: encodedContent,
        sha: sha || undefined
      })
    });

    if (updateFile.ok) {
      alert("✅ Harika! Değişiklikler GitHub'a doğrudan kaydedildi.\n\nSiteniz 1-2 dakika içinde güncellenecektir.");
    } else {
      const errRes = await updateFile.json();
      alert("⚠️ Güncelleme Başarısız: " + (errRes.message || "Bilinmeyen hata"));
    }
  } catch (err) {
    alert("⚠️ Bağlantı Hatası: " + err.message);
  } finally {
    saveBtn.innerText = "💾 GitHub'a Doğrudan Kaydet";
    saveBtn.disabled = false;
  }
});

document.addEventListener('DOMContentLoaded', initPanel);
    
