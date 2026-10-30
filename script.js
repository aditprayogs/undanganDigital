// Septa & Reina — Wedding Invitation Logic

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwT7FB-iag0pIl1f565rY7Aq_GIR_RymSS4DG-7NyciNbSjRA-8l9twdnXwqLwpGawn/exec";

let guestName = "Tamu Undangan";
let gallerySwiper;

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Inisialisasi AOS Animation
  if (window.AOS) {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic'
    });
  }

  // 2. Fetch Nama Tamu dari Query String dengan Tampilan Loading
  const guestId = getGuestIdFromUrl();
  const guestEl = document.getElementById("guest-name");

  // Tampilkan indikator loading terlebih dahulu
  if (guestEl) {
    guestEl.innerHTML = '<span class="inline-flex items-center gap-2 text-gold/80 text-lg font-sans italic"><i class="fas fa-spinner animate-spin"></i> Memuat nama tamu...</span>';
  }

  if (guestId && APPS_SCRIPT_URL) {
    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?id=${encodeURIComponent(guestId)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success" && data.nama) {
          guestName = data.nama;
        }
      }
    } catch (error) {
      console.warn("Gagal memuat nama tamu, menggunakan nama default.", error);
    }
  }

  // Setel nama tamu asli atau default "Tamu Undangan" jika tidak ada data/gagal
  if (guestEl) {
    guestEl.textContent = guestName;
  }

  // 3. Control Musik Background
  const audio = document.getElementById("bg-music");
  const icon = document.getElementById("music-icon");

  if (audio && icon) {
    audio.addEventListener("play", () => icon.classList.add("animate-spin"));
    audio.addEventListener("pause", () => icon.classList.remove("animate-spin"));
  }

  // 4. Inisialisasi Countdown Timer
  const eventDate = new Date("2026-11-14T08:00:00+07:00").getTime();
  const updateCountdown = () => {
    const distance = eventDate - Date.now();
    const root = document.getElementById("countdown");

    if (distance <= 0) {
      if (root) root.innerHTML = "<p class='font-serif text-gold text-lg'>Hari bahagia telah tiba!</p>";
      return;
    }

    const values = {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance % 86400000) / 3600000),
      minutes: Math.floor((distance % 3600000) / 60000),
      seconds: Math.floor((distance % 60000) / 1000)
    };

    Object.entries(values).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(value).padStart(2, "0");
    });
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 5. Inisialisasi Slider Galeri (Ultra Smooth Swiper)
  if (window.Swiper && document.querySelector(".galeriSwiper")) {
    gallerySwiper = new Swiper(".galeriSwiper", {
      slidesPerView: 1.25,
      centeredSlides: true,
      spaceBetween: 16,
      loop: true,
      speed: 1000,
      grabCursor: true,
      resistanceRatio: 0.85,

      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },

      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true
      },

      breakpoints: {
        520: {
          slidesPerView: 2,
          centeredSlides: false,
          spaceBetween: 16
        },
        768: {
          slidesPerView: 2.5,
          centeredSlides: true,
          spaceBetween: 20
        }
      }
    });
  }

  // 6. Event listener tombol ESC untuk Lightbox
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
});

// --- HELPER FUNCTIONS ---

function getGuestIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id")?.trim() || params.get("to")?.trim() || null;
}

function openInvitation() {
  const cover = document.getElementById("cover");
  const audioControl = document.getElementById("audio-control");
  const audio = document.getElementById("bg-music");

  if (!cover || cover.classList.contains("opening")) return;

  cover.classList.add("opening");
  document.body.classList.remove("locked");

  if (audio) {
    audio.play().catch(() => console.info("Autoplay musik dicegah oleh kebijakan browser."));
  }

  setTimeout(() => {
    cover.classList.add("cover-closed");
    if (audioControl) audioControl.classList.remove("hidden");
    if (window.AOS) AOS.refresh();
  }, 650);
}

function toggleMusic() {
  const audio = document.getElementById("bg-music");
  if (!audio) return;
  audio.paused ? audio.play() : audio.pause();
}

function openLightbox(src) {
  const modal = document.getElementById("lightbox-modal");
  const img = document.getElementById("lightbox-img");
  if (modal && img) {
    img.src = src;
    modal.classList.remove("hidden");
    document.body.classList.add("lightbox-open");
  }
}

function closeLightbox() {
  const modal = document.getElementById("lightbox-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.classList.remove("lightbox-open");
  }
}

function salinRekening(elementId, btnElement) {
  const text = document.getElementById(elementId)?.innerText;
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    const originalContent = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="fas fa-check"></i> <span>Tersalin!</span>';
    btnElement.style.background = '#4a5d4e';
    btnElement.style.color = '#ffffff';

    setTimeout(() => {
      btnElement.innerHTML = originalContent;
      btnElement.style.background = '';
      btnElement.style.color = '';
    }, 2000);
  });
}