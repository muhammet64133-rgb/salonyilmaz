// Varsayılan Veriler
const defaultData = {
  hero: {
    title1: "TARZINI",
    title2: "YÜKSELT",
    description: "Erkeklerin yeni nesil duruşu. Özenli bakım, keskin stil.",
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1000&auto=format&fit=crop"
  },
  gallery: []
};

let siteData = JSON.parse(localStorage.getItem('salonYilmazData')) || defaultData;

// Sayfa Yüklendiğinde
function initPanel() {
  document.getElementById('hero-title-1').value = siteData.hero.title1;
  document.getElementById('hero-title-2').value = siteData.hero.title2;
  document.getElementById('hero-description').value = siteData.hero.description;
  document.getElementById('hero-preview').src = siteData.hero.image;

  renderGallery();
}

/**
 * Resimleri Kaliteyi Korumak Kaydıyla Otomatik Boyutlandıran ve Sıkıştıran Fonksiyon
 */
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

        // Boyut büyükse oranlı olarak küçült
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Resmi JPEG formatında sıkıştırıp döndür
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
    };
  });
}

// Hero Model Resmi Seçildiğinde
document.getElementById('hero-file-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const preview = document.getElementById('hero-preview');
  preview.style.opacity = '0.4';

  // Resmi arka planda sıkıştır
  const compressedImg = await compressAndResizeImage(file, 1000, 0.8);
  siteData.hero.image = compressedImg;
  preview.src = compressedImg;
  preview.style.opacity = '1';
});

// Galeriye Resim Yükleme
document.getElementById('gallery-file-input').addEventListener('change', async (e) => {
  const files = Array.from(e.target.files);
  for (const file of files) {
    // Galeri fotoğraflarını 800px genişliğe sıkıştır
    const compressedImg = await compressAndResizeImage(file, 800, 0.75);
    siteData.gallery.push(compressedImg);
  }
  renderGallery();
});

// Galeri Ekranını Çiz
function renderGallery() {
  const container = document.getElementById('gallery-preview-container');
  if (!container) return;
  container.innerHTML = '';

  siteData.gallery.forEach((imgSrc, index) => {
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

// Kaydet Butonu
document.getElementById('save-all-btn').addEventListener('click', () => {
  siteData.hero.title1 = document.getElementById('hero-title-1').value;
  siteData.hero.title2 = document.getElementById('hero-title-2').value;
  siteData.hero.description = document.getElementById('hero-description').value;

  try {
    localStorage.setItem('salonYilmazData', JSON.stringify(siteData));
    alert('Görseller ve yazılar başarıyla kaydedildi!');
  } catch (error) {
    alert('Çok fazla resim yüklendi! Lütfen bazı galeri resimlerini silip tekrar deneyin.');
  }
});

document.addEventListener('DOMContentLoaded', initPanel);
        
