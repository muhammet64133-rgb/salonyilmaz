// Varsayılan Bilgiler
const defaultData = {
  hero: {
    title1: "TARZINI",
    title2: "YÜKSELT",
    description: "Erkeklerin yeni nesil duruşu. Özenli bakım, keskin stil.",
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1000&auto=format&fit=crop"
  },
  services: [
    { title: "SAÇ KESİM", desc: "Keskin stiller, mükemmel sonuçlar." },
    { title: "SAKAL & TRAŞ", desc: "Tıraş, şekillendirme ve bakım." },
    { title: "SAÇ & SAKAL BAKIM", desc: "Saç, cilt ve sakal için özenli bakım." },
    { title: "RENKLENDİRME", desc: "Kişiye özel renk çözümleri." }
  ],
  gallery: [],
  contact: {
    phone: "0507 577 10 22",
    hours: "Pzt–Cmt 09:00–21:00",
    address: "Arda Mahallesi 3205 Sokak 18/B, Manisa"
  }
};

let siteData = JSON.parse(localStorage.getItem('salonYilmazData')) || defaultData;

// Sayfa Yüklendiğinde
function initPanel() {
  // Hero
  if (document.getElementById('hero-title-1')) document.getElementById('hero-title-1').value = siteData.hero.title1 || '';
  if (document.getElementById('hero-title-2')) document.getElementById('hero-title-2').value = siteData.hero.title2 || '';
  if (document.getElementById('hero-description')) document.getElementById('hero-description').value = siteData.hero.description || '';
  if (document.getElementById('hero-preview')) document.getElementById('hero-preview').src = siteData.hero.image || '';

  // Hizmetler
  renderServices();

  // Galeri
  renderGallery();

  // İletişim
  if (document.getElementById('contact-phone')) document.getElementById('contact-phone').value = siteData.contact?.phone || '';
  if (document.getElementById('contact-hours')) document.getElementById('contact-hours').value = siteData.contact?.hours || '';
  if (document.getElementById('contact-address')) document.getElementById('contact-address').value = siteData.contact?.address || '';
}

// Resim Sıkıştırma (Canvas)
function compressAndResizeImage(file, maxWidth = 1000, quality = 0.75) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    };
  });
}

// Hizmetleri Ekrana Çiz
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

// Galeri Ekrana Çiz
function renderGallery() {
  const container = document.getElementById('gallery-preview-container');
  if (!container) return;
  container.innerHTML = '';

  (siteData.gallery || []).forEach((imgSrc, index) => {
    container.innerHTML += `
      <div class="relative group rounded-lg overflow-hidden border border-brand-border h-32">
        <img src="${imgSrc}" class="w-full h-full object-cover">
        <button onclick="deleteGalleryImg(${index})" class="absolute top-1 right-1 bg-red-600 text-white text-[10px] px-2 py-1 rounded opacity-90 hover:opacity-100">
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

// Hero Resmi Seçildiğinde
document.getElementById('hero-file-input')?.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const preview = document.getElementById('hero-preview');
  if (preview) preview.style.opacity = '0.3';

  const compressedImg = await compressAndResizeImage(file, 1000, 0.75);
  siteData.hero.image = compressedImg;
  if (preview) {
    preview.src = compressedImg;
    preview.style.opacity = '1';
  }
});

// Galeriye Resim Yükleme
document.getElementById('gallery-file-input')?.addEventListener('change', async (e) => {
  const files = Array.from(e.target.files);
  if (!siteData.gallery) siteData.gallery = [];

  for (const file of files) {
    const compressedImg = await compressAndResizeImage(file, 800, 0.70);
    siteData.gallery.push(compressedImg);
  }
  renderGallery();
});

// Kaydet Butonu
document.getElementById('save-all-btn')?.addEventListener('click', () => {
  try {
    // Hero Kaydet
    siteData.hero.title1 = document.getElementById('hero-title-1').value;
    siteData.hero.title2 = document.getElementById('hero-title-2').value;
    siteData.hero.description = document.getElementById('hero-description').value;

    // Hizmetleri Kaydet
    siteData.services = (siteData.services || []).map((_, idx) => ({
      title: document.getElementById(`srv-title-${idx}`).value,
      desc: document.getElementById(`srv-desc-${idx}`).value
    }));

    // İletişim Kaydet
    if (!siteData.contact) siteData.contact = {};
    siteData.contact.phone = document.getElementById('contact-phone').value;
    siteData.contact.hours = document.getElementById('contact-hours').value;
    siteData.contact.address = document.getElementById('contact-address').value;

    // LocalStorage Kaydet
    localStorage.setItem('salonYilmazData', JSON.stringify(siteData));
    alert('✅ Tüm değişiklikler başarıyla kaydedildi!');
  } catch (error) {
    alert('⚠️ Hafıza doldu! Lütfen bazı galeri resimlerini silip tekrar deneyin.');
  }
});

document.addEventListener('DOMContentLoaded', initPanel);
    
