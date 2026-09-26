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

// Sayfa yüklendiğinde mevcut bilgileri doldur
function initPanel() {
  document.getElementById('hero-title-1').value = siteData.hero.title1;
  document.getElementById('hero-title-2').value = siteData.hero.title2;
  document.getElementById('hero-description').value = siteData.hero.description;
  document.getElementById('hero-preview').src = siteData.hero.image;

  renderGallery();
}

// Resim dosyasını Base64 formatına çeviren yardımcı fonksiyon
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// Hero Modeli Resmi Seçildiğinde
document.getElementById('hero-file-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const base64Image = await fileToBase64(file);
    siteData.hero.image = base64Image;
    document.getElementById('hero-preview').src = base64Image;
  }
});

// Galeriden Toplu Fotoğraf Yükleme
document.getElementById('gallery-file-input').addEventListener('change', async (e) => {
  const files = Array.from(e.target.files);
  for (const file of files) {
    const base64Image = await fileToBase64(file);
    siteData.gallery.push(base64Image);
  }
  renderGallery();
});

// Galeri Ekranını Çiz
function renderGallery() {
  const container = document.getElementById('gallery-preview-container');
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

  localStorage.setItem('salonYilmazData', JSON.stringify(siteData));
  alert('Görseller ve yazılar başarıyla kaydedildi!');
});

document.addEventListener('DOMContentLoaded', initPanel);
  
