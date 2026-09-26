let siteData = window.siteData || {};

function initPanel() {
  document.getElementById('hero-title-1').value = siteData.hero?.title1 || '';
  document.getElementById('hero-title-2').value = siteData.hero?.title2 || '';
  document.getElementById('hero-description').value = siteData.hero?.description || '';

  renderServices();

  document.getElementById('contact-phone').value = siteData.contact?.phone || '';
  document.getElementById('contact-hours').value = siteData.contact?.hours || '';
  document.getElementById('contact-address').value = siteData.contact?.address || '';
}

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

// Kodları Kopyala Butonu
document.getElementById('copy-code-btn')?.addEventListener('click', () => {
  // Inputlardan yeni değerleri topla
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

  // Yeni JS kodunu oluştur
  const generatedCode = `window.siteData = ${JSON.stringify(siteData, null, 2)};`;

  // Panoya Kopyala
  navigator.clipboard.writeText(generatedCode).then(() => {
    alert("✅ Yeni yazılar kopyalandı!\n\nŞimdi GitHub'a gidip 'data.js' dosyasının içine yapıştırıp 'Commit changes' butonuna basmanız yeterli.");
  }).catch(() => {
    alert("Kopyalama başarısız oldu. Lütfen manuel deneyin.");
  });
});

document.addEventListener('DOMContentLoaded', initPanel);
