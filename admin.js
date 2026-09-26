// Varsayılan Veri Yapısı
const defaultData = {
  hero: {
    subheading: "/ YENİ TARZ. YENİ SEN.",
    title1: "TARZINI",
    title2: "YÜKSELT",
    description: "Erkeklerin yeni nesil duruşu. Özenli bakım, keskin stil.",
    imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1000&auto=format&fit=crop"
  },
  services: [
    { title: "SAÇ KESİM", desc: "Keskin stiller, mükemmel sonuçlar." },
    { title: "SAKAL & TRAŞ", desc: "Tıraş, şekillendirme ve bakım." },
    { title: "SAÇ & SAKAL BAKIM", desc: "Saç, cilt ve sakal için özenli bakım." },
    { title: "RENKLENDİRME", desc: "Kişiye özel renk çözümleri ve beyaz kapatma." }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600"
  ],
  contact: {
    phone: "0507 577 10 22",
    hours: "Pzt–Cmt 09:00–21:00",
    address: "Arda Mahallesi 3205 Sokak 18/B, Manisa"
  }
};

// LocalStorage'dan yükle veya varsayılanı al
let siteData = JSON.parse(localStorage.getItem('salonYilmazData')) || defaultData;

// Form Elemanlarını Doldur
function loadFormData() {
  document.getElementById('hero-subheading').value = siteData.hero.subheading;
  document.getElementById('hero-title-1').value = siteData.hero.title1;
  document.getElementById('hero-title-2').value = siteData.hero.title2;
  document.getElementById('hero-description').value = siteData.hero.description;
  document.getElementById('hero-image-url').value = siteData.hero.imageUrl;

  // Hizmetleri Dinamik Render Et
  const servicesContainer = document.getElementById('services-container');
  servicesContainer.innerHTML = '';
  siteData.services.forEach((s, idx) => {
    servicesContainer.innerHTML += `
      <div class="bg-[#08080a] p-3 rounded-lg border border-brand-border space-y-2">
        <input type="text" id="srv-title-${idx}" value="${s.title}" class="w-full bg-[#141416] border border-brand-border rounded p-2 text-sm text-brand font-bold">
        <input type="text" id="srv-desc-${idx}" value="${s.desc}" class="w-full bg-[#141416] border border-brand-border rounded p-2 text-xs text-white/80">
      </div>
    `;
  });

  // Galeriyi Dinamik Render Et
  renderGalleryInputs();

  document.getElementById('contact-phone').value = siteData.contact.phone;
  document.getElementById('contact-hours').value = siteData.contact.hours;
  document.getElementById('contact-address').value = siteData.contact.address;
}

function renderGalleryInputs() {
  const container = document.getElementById('gallery-container');
  container.innerHTML = '';
  siteData.gallery.forEach((url, idx) => {
    container.innerHTML += `
      <div class="flex items-center gap-2">
        <input type="text" value="${url}" id="gal-url-${idx}" class="flex-1 bg-[#08080a] border border-brand-border rounded-lg p-2.5 text-xs">
        <button onclick="removeGalleryItem(${idx})" class="text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg">Sil</button>
      </div>
    `;
  });
}

function removeGalleryItem(index) {
  siteData.gallery.splice(index, 1);
  renderGalleryInputs();
}

document.getElementById('add-gallery-img')?.addEventListener('click', () => {
  siteData.gallery.push('');
  renderGalleryInputs();
});

// Kaydet Butonu
document.getElementById('save-all-btn').addEventListener('click', () => {
  siteData.hero.subheading = document.getElementById('hero-subheading').value;
  siteData.hero.title1 = document.getElementById('hero-title-1').value;
  siteData.hero.title2 = document.getElementById('hero-title-2').value;
  siteData.hero.description = document.getElementById('hero-description').value;
  siteData.hero.imageUrl = document.getElementById('hero-image-url').value;

  siteData.services = siteData.services.map((_, idx) => ({
    title: document.getElementById(`srv-title-${idx}`).value,
    desc: document.getElementById(`srv-desc-${idx}`).value
  }));

  siteData.gallery = siteData.gallery.map((_, idx) => {
    const el = document.getElementById(`gal-url-${idx}`);
    return el ? el.value : null;
  }).filter(Boolean);

  siteData.contact.phone = document.getElementById('contact-phone').value;
  siteData.contact.hours = document.getElementById('contact-hours').value;
  siteData.contact.address = document.getElementById('contact-address').value;

  localStorage.setItem('salonYilmazData', JSON.stringify(siteData));
  alert('Değişiklikler başarıyla kaydedildi!');
});

document.addEventListener('DOMContentLoaded', loadFormData);
    
