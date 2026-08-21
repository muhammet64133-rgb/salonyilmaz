// AOS Animasyonlarını Başlat
AOS.init({
  duration: 800,
  once: true
});

// Mobil Menü
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('hidden');
  });
}

// Yorumlar
const reviews = [
  { name: "Mert K.", text: "Harika bir atmosfer ve ustalara yakışır bir hassasiyet. Yıllardır vazgeçemediğim tek berber.", rating: 5 },
  { name: "Burak T.", text: "Sakal tasarımı ve hat kesiminde Manisa'da üstüne yok. Kesinlikle tavsiye ederim.", rating: 5 },
  { name: "Ali R.", text: "Cilt bakımı ve saç kesimi için geldim. İlgi, alaka ve hijyen gerçekten 10/10.", rating: 5 }
];

const reviewsGrid = document.getElementById('reviews-grid');
if (reviewsGrid) {
  reviews.forEach(r => {
    const starSvg = '<svg class="star-icon" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
    reviewsGrid.innerHTML += `
      <div class="card-lux p-6 flex flex-col justify-between">
        <p class="text-sm text-white/80 leading-relaxed font-normal">"${r.text}"</p>
        <div class="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <span class="font-display-tw text-lg text-white/90">${r.name}</span>
          <div class="flex gap-1">${starSvg.repeat(r.rating)}</div>
        </div>
      </div>
    `;
  });
}

// WhatsApp Randevu Formu
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const service = document.getElementById('service').value;

    const message = `Merhaba Salon Yılmaz, randevu almak istiyorum:%0A%0A` +
                    `👤 *Ad Soyad:* ${encodeURIComponent(name)}%0A` +
                    `📞 *Telefon:* ${encodeURIComponent(phone)}%0A` +
                    `📅 *Tarih:* ${encodeURIComponent(date)}%0A` +
                    `⏰ *Saat:* ${encodeURIComponent(time)}%0A` +
                    `✂️ *Hizmet:* ${encodeURIComponent(service)}`;

    window.open(`https://wa.me/905075771022?text=${message}`, '_blank');
  });
}

