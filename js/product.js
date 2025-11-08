// ===========================================
// LANGUAGE TRANSLATION SYSTEM
// ===========================================

const languageToggle = document.getElementById("languageToggle");
let currentLanguage = "en";

const miniImages = document.querySelectorAll(".mini-product img");
const featuredImage = document.getElementById("featuredImage");

let currentImage = null;
let isAnimating = false;

window.addEventListener("DOMContentLoaded", () => {
  if (miniImages.length > 0) {
    const firstImage = miniImages[0].getAttribute("src");
    featuredImage.src = firstImage;
    featuredImage.classList.add("show");
    currentImage = firstImage;
    
    // ✅ Set mini image pertama sebagai active
    miniImages[0].classList.add("active");
  }

  // === Load saved language preference ===
  const savedLanguage = localStorage.getItem("preferredLanguage");
  if (savedLanguage === "id") {
    languageToggle.checked = true;
    currentLanguage = "id";
    translatePage("id");
  }
});

miniImages.forEach((img) => {
  img.addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;

    const selectedImage = img.getAttribute("src");
    if (currentImage === selectedImage) {
      isAnimating = false;
      return;
    }

    // ✅ Hapus class active dari semua mini images
    miniImages.forEach((miniImg) => miniImg.classList.remove("active"));
    
    // ✅ Tambahkan class active ke mini image yang diklik
    img.classList.add("active");

    // Animasi keluar
    featuredImage.classList.add("smooth-exit");
    featuredImage.addEventListener(
      "animationend",
      () => {
        featuredImage.classList.remove("smooth-exit");
        featuredImage.src = selectedImage;

        // Animasi masuk
        featuredImage.classList.add("smooth-enter");
        featuredImage.addEventListener(
          "animationend",
          () => {
            featuredImage.classList.remove("smooth-enter");
            currentImage = selectedImage;
            isAnimating = false;
          },
          { once: true }
        );
      },
      { once: true }
    );
  });
});

// Language toggle event listener
languageToggle.addEventListener("change", function () {
  currentLanguage = this.checked ? "id" : "en";
  translatePage(currentLanguage);

  // Save language preference to localStorage
  localStorage.setItem("preferredLanguage", currentLanguage);
});

// Main translation function
function translatePage(lang) {
  // Translate all elements with data-en and data-id attributes
  const elements = document.querySelectorAll("[data-en][data-id]");

  elements.forEach((element) => {
    const text =
      lang === "en"
        ? element.getAttribute("data-en")
        : element.getAttribute("data-id");
    if (text.includes("<br>")) {
      element.innerHTML = text;
    } else {
      element.textContent = text;
    }
  });
}

// ===========================================
// SMOOTH SCROLL FOR NAVIGATION
// ===========================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerHeight = document.querySelector("header").offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ===========================================
// ANIMATION ON SCROLL
// ===========================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document
  .querySelectorAll(".contact-card, .location-card, .contact-form")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s ease-out";
    observer.observe(el);
  });

// ===========================================
// PRODUCT FILTER BUTTONS (Versi Stabil & Multibahasa)
// ===========================================

const filterButtons = document.querySelectorAll(".product-filter button");
const items = document.querySelectorAll(".parent .item");
const parentGrid = document.querySelector(".parent");

// ✅ Tambahkan atribut data-filter ke tombol di HTML:
// <button data-filter="all">All</button>
// <button data-filter="fresh">Fresh Mushroom</button>
// <button data-filter="processed">Processed Mushroom Products</button>

function resetGridLayout() {
  parentGrid.classList.remove("filtered");
  parentGrid.style.gridTemplateColumns = "repeat(4, 1fr)";
  items.forEach((item) => {
    item.style.gridColumn = "";
    item.style.gridRow = "";
    item.style.display = "flex";
    item.classList.remove("big", "tall", "small");
  });
}

// === ALL ===
function showAll() {
  resetGridLayout();
  items.forEach((item) => (item.style.display = "flex"));
}

// === FRESH MUSHROOM ===
function showFresh() {
  resetGridLayout();
  parentGrid.classList.add("filtered");
  items.forEach((item) => (item.style.display = "none"));

  const packagedOyster = document.querySelector(".item3");
  const freshOyster = document.querySelector(".item2");
  const earMushroom = document.querySelector(".item7");
  const packagedEar = document.querySelector(".item8");

  const freshItems = [packagedOyster, freshOyster, earMushroom, packagedEar];
  freshItems.forEach((item) => (item.style.display = "flex"));

  packagedOyster.style.gridColumn = "1 / 2";
  packagedOyster.style.gridRow = "1 / 2";

  freshOyster.style.gridColumn = "2 / 4";
  freshOyster.style.gridRow = "1 / 3";

  earMushroom.style.gridColumn = "1 / 2";
  earMushroom.style.gridRow = "2 / 3";

  packagedEar.style.gridColumn = "1 / 2";
  packagedEar.style.gridRow = "3 / 4";
}

// === PROCESSED MUSHROOM ===
function showProcessed() {
  resetGridLayout();
  parentGrid.classList.add("filtered");
  items.forEach((item) => (item.style.display = "none"));

  const shredded = document.querySelector(".item1");
  const satay = document.querySelector(".item9");
  const sauce = document.querySelector(".item4");
  const nuggets = document.querySelector(".item5");
  const chips = document.querySelector(".item6");

  const processedItems = [shredded, satay, sauce, nuggets, chips];
  processedItems.forEach((item) => (item.style.display = "flex"));

  shredded.style.gridColumn = "1 / 3";
  shredded.style.gridRow = "1 / 2";

  satay.style.gridColumn = "3 / 4";
  satay.style.gridRow = "1 / 2";

  sauce.style.gridColumn = "1 / 2";
  sauce.style.gridRow = "2 / 3";

  nuggets.style.gridColumn = "2 / 3";
  nuggets.style.gridRow = "2 / 3";

  chips.style.gridColumn = "3 / 4";
  chips.style.gridRow = "2 / 3";
}

// === Event Listeners ===
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filterType = button.dataset.filter; // gunakan data-filter, bukan textContent
    if (filterType === "all") showAll();
    else if (filterType === "fresh") showFresh();
    else if (filterType === "processed") showProcessed();
  });
});

// ===========================================
// CONSOLE LOG
// ===========================================
console.log(
  "%c🍄 Queen's Mushroom",
  "color: #D4AF37; font-size: 24px; font-weight: bold;"
);
console.log("%cFresh. Local. Sustainable.", "color: #8B7355; font-size: 14px;");
