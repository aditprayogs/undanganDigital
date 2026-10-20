// Septa & Reina — wedding invitation interactions

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwT7FB-iag0pIl1f565rY7Aq_GIR_RymSS4DG-7NyciNbSjRA-8l9twdnXwqLwpGawn/exec";

let guestName = "Tamu Undangan";
let gallerySwiper;

document.addEventListener("DOMContentLoaded", async () => {
  if (window.AOS) {
    AOS.init({
      duration: 850,
      once: true,
      offset: 60
    });
  }

  // Ambil kode tamu dari URL
  const guestId = getGuestIdFromUrl();

  // Ambil elemen nama tamu
  const guestEl = document.getElementById("guest-name");

  if (guestEl) {
    guestEl.textContent = "Memuat nama tamu...";
  }

  if (guestId && APPS_SCRIPT_URL) {
    try {
      const response = await fetch(
        `${APPS_SCRIPT_URL}?id=${encodeURIComponent(guestId)}`
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data tamu.");
      }

      const data = await response.json();

      if (data.status === "success" && data.nama) {
        guestName = data.nama;

        if (guestEl) {
          guestEl.textContent = guestName;
        }
      } else {
        guestName = "Tamu Undangan";

        if (guestEl) {
          guestEl.textContent = guestName;
        }

        console.warn("Kode undangan tidak ditemukan.");
      }
    } catch (error) {
      console.error("Gagal memuat nama tamu:", error);

      if (guestEl) {
        guestEl.textContent = "Tamu Undangan";
      }
    }
  } else if (!guestId) {
    if (guestEl) {
      guestEl.textContent = "Tamu Undangan";
    }
  }

  // Inisialisasi musik
  const audio = document.getElementById("bg-music");
  const icon = document.getElementById("music-icon");

  if (audio && icon) {
    audio.addEventListener("play", () => {
      icon.classList.add("animate-spin");
    });

    audio.addEventListener("pause", () => {
      icon.classList.remove("animate-spin");
    });
  }

  // Inisialisasi countdown
  const eventDate = new Date(
    "2026-11-14T08:00:00+07:00"
  ).getTime();

  const updateCountdown = () => {
    const distance = eventDate - Date.now();
    const root = document.getElementById("countdown");

    if (distance <= 0) {
      if (root) {
        root.innerHTML =
          "<p class='font-serif text-gold text-lg'>Hari bahagia telah tiba</p>";
      }

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

      if (el) {
        el.textContent = String(value).padStart(2, "0");
      }
    });
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

// Inisialisasi galeri — smooth editorial slider
if (window.Swiper && document.querySelector(".galeriSwiper")) {
  gallerySwiper = new Swiper(".galeriSwiper", {
    slidesPerView: 1.2,
    centeredSlides: true,
    spaceBetween: 16,

    loop: true,
    speed: 1000,

    grabCursor: true,
    watchSlidesProgress: true,

    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
      waitForTransition: true
    },

    pagination: {
      el: ".galeriSwiper .swiper-pagination",
      clickable: true
    },

    breakpoints: {
      520: {
        slidesPerView: 1.7,
        centeredSlides: true,
        spaceBetween: 16
      },

      760: {
        slidesPerView: 2.1,
        centeredSlides: true,
        spaceBetween: 20
      },

      1024: {
        slidesPerView: 1.8,
        centeredSlides: true,
        spaceBetween: 20
      }
    },

    on: {
      init: function () {
        this.el.classList.add("swiper-ready");
      }
    }
  });
}

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
});

function getGuestIdFromUrl() {
  // Mendukung URL dengan parameter ?id=NZL123
  const params = new URLSearchParams(window.location.search);
  const queryId = params.get("id");

  if (queryId) {
    return queryId.trim();
  }

  // Mendukung URL dengan parameter ?to=NZL123
  const queryTo = params.get("to");

  if (queryTo) {
    return queryTo.trim();
  }

  // Mendukung URL seperti /NZL123
  const path = window.location.pathname
    .split("/")
    .filter(Boolean);

  if (path.length > 0) {
    return decodeURIComponent(path[path.length - 1]).trim();
  }

  return null;
}

function openInvitation() {
  const cover = document.getElementById("cover");
  const audioControl = document.getElementById("audio-control");
  const audio = document.getElementById("bg-music");
  const button = cover?.querySelector(".open-invitation-btn");

  // Cegah tombol diproses berulang kali
  if (!cover || cover.classList.contains("opening")) {
    return;
  }

  // Mulai animasi cover
  cover.classList.add("opening");

  if (button) {
    button.disabled = true;
  }

  // Aktifkan scrolling
  document.body.classList.remove("locked");

  // Putar musik ketika diizinkan browser
  if (audio) {
    audio.play().catch(error => {
      console.info("Musik menunggu interaksi berikutnya:", error);
    });
  }

  // Setelah animasi selesai, hilangkan cover
  window.setTimeout(() => {
    cover.classList.add("cover-closed");

    document.body.classList.add("invitation-opening");

    if (audioControl) {
      audioControl.classList.remove("hidden");
    }

    if (window.AOS) {
      AOS.refresh();
    }

    // Bersihkan status animasi
    window.setTimeout(() => {
      cover.classList.remove("opening");
      document.body.classList.remove("invitation-opening");
    }, 1200);

  }, 650);
}

/**
 * Menyalin nomor rekening ke clipboard.
 */
async function salinRekening(elementId, button) {
  const rekeningElement = document.getElementById(elementId);

  if (!rekeningElement) {
    return;
  }

  const nomorRekening = rekeningElement.textContent.trim();

  if (!nomorRekening) {
    return;
  }

  const buttonText = button.querySelector("span");
  const buttonIcon = button.querySelector("i");

  const teksAwal = buttonText ? buttonText.textContent : "Salin";
  const ikonAwal = buttonIcon ? buttonIcon.className : "";

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(nomorRekening);
    } else {
      // Fallback untuk browser yang tidak mendukung Clipboard API.
      const textarea = document.createElement("textarea");

      textarea.value = nomorRekening;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);
      textarea.select();

      const berhasil = document.execCommand("copy");

      textarea.remove();

      if (!berhasil) {
        throw new Error("Gagal menyalin nomor rekening.");
      }
    }

    if (buttonText) {
      buttonText.textContent = "Tersalin!";
    }

    if (buttonIcon) {
      buttonIcon.className = "fas fa-check";
    }

    button.classList.add("bg-olive", "text-white");

  } catch (error) {
    console.error("Gagal menyalin nomor rekening:", error);

    if (buttonText) {
      buttonText.textContent = "Gagal";
    }

    if (buttonIcon) {
      buttonIcon.className = "fas fa-exclamation-circle";
    }
  }

  setTimeout(() => {
    if (buttonText) {
      buttonText.textContent = teksAwal;
    }

    if (buttonIcon) {
      buttonIcon.className = ikonAwal;
    }

    button.classList.remove("bg-olive", "text-white");
  }, 2000);
}