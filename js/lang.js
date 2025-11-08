/**
 * ===================================================================
 * UTILITY FUNCTION: Throttle
 * ===================================================================
 */
function throttle(func, limit) {
    let inThrottle;
    let lastFunc;
    let lastRan;
    return function(...args) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            lastRan = Date.now();
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
                if (lastFunc) {
                    lastFunc.apply(context, args);
                    lastFunc = null;
                    lastRan = Date.now();
                }
            }, limit);
        } else {
            lastFunc = func;
        }
    }
}

/**
 * ===================================================================
 * EVENT LISTENER UTAMA: DOMContentLoaded
 * ===================================================================
 */
document.addEventListener("DOMContentLoaded", () => {

    const App = {

        selectors: {
            // --- Global ---
            pageTransitionOverlay: document.getElementById("page-transition-overlay"),
            navbar: document.querySelector('.navbar'),
            allSections: document.querySelectorAll('section[id]'),
            hiddenElements: document.querySelectorAll('.hidden'),

            // --- Navigasi ---
            hamburger: document.querySelector('.hamburger'),
            navLinksContainer: document.querySelector('.nav-links'),
            navLinks: document.querySelectorAll('.nav-links li a'),
            navLinksAnchors: document.querySelectorAll('.nav-links a'),

            // --- Bahasa --- ✅ DIPERBAIKI: ID yang benar
            languageToggle: document.getElementById("languageToggle"),
            translatableElements: document.querySelectorAll("[data-en][data-id]"),

            // --- Produk (Showcase) ---
            productThumbnails: document.querySelectorAll(".product-thumb"),
            mainProductImage: document.getElementById("main-product-image"),

            // --- Produk (Tabs) ---
            tabButtons: document.querySelectorAll('.tab-button'),
            productGrids: document.querySelectorAll('.product-grid'),
            allProductsGrid: document.getElementById('all-products'),

            // --- FAQ ---
            faqQuestions: document.querySelectorAll('.faq-question')
        },

        config: {
            PAGE_TRANSITION_DURATION: 250,
            IMAGE_TRANSITION_DURATION: 300,
            NAV_HIGHLIGHT_OFFSET: 100,
            SCROLL_THROTTLE_LIMIT: 100
        },

        modules: {

            /**
             * === 1. Modul: Language Switcher ===
             */
            initLanguageSwitcher() {
                const toggle = App.selectors.languageToggle;
                const elements = App.selectors.translatableElements;
                const overlay = App.selectors.pageTransitionOverlay;
                const DURATION = App.config.PAGE_TRANSITION_DURATION;

                if (!toggle || elements.length === 0) {
                    console.warn("Language toggle atau elemen translatable tidak ditemukan");
                    if (overlay) {
                        overlay.classList.add("hidden");
                    }
                    return;
                }

                let isTransitioning = false;

                const updateTextContent = lang => {
                    elements.forEach(el => {
                        el.textContent = el.dataset[lang];
                    });
                    const titleEl = document.querySelector("title");
                    if (titleEl) {
                        document.title = titleEl.dataset[lang];
                    }
                };

                const setLanguage = (lang, force = false) => {
                    if (isTransitioning && !force) return;

                    if (!force && overlay) {
                        isTransitioning = true;
                        overlay.classList.remove("hidden");
                        
                        setTimeout(() => {
                            updateTextContent(lang);
                            overlay.classList.add("hidden");
                            setTimeout(() => {
                                isTransitioning = false;
                            }, DURATION);
                        }, DURATION);
                    } else {
                        updateTextContent(lang);
                        if (overlay) {
                            overlay.classList.add("hidden");
                        }
                    }

                    localStorage.setItem("language", lang);
                    document.documentElement.lang = lang;
                    
                    toggle.checked = lang === "id";
                };

                const initLanguage = () => {
                    const savedLang = localStorage.getItem("language");
                    let currentLang = savedLang || 'en';
                    setLanguage(currentLang, true);
                };
                toggle.addEventListener("change", () => {
                    const newLang = toggle.checked ? "id" : "en";
                    setLanguage(newLang);
                });

                initLanguage();
            },

            /**
             * === 2. Modul: Navigasi Mobile (Hamburger Menu) ===
             */
            initMobileNav() {
                const hamburger = App.selectors.hamburger;
                const navLinksContainer = App.selectors.navLinksContainer;
                const links = App.selectors.navLinks;
                
                if (!hamburger || !navLinksContainer) return;

                hamburger.addEventListener('click', () => {
                    const isExpanded = navLinksContainer.classList.toggle('active');
                    hamburger.classList.toggle('active');
                    hamburger.setAttribute('aria-expanded', isExpanded);
                });

                links.forEach(link => {
                    link.addEventListener('click', () => {
                        if (navLinksContainer.classList.contains('active')) {
                            navLinksContainer.classList.remove('active');
                            hamburger.classList.remove('active');
                            hamburger.setAttribute('aria-expanded', 'false');
                        }
                    });
                });
            },

            /**
             * === 3. Modul: Fungsionalitas Scroll (Sticky Nav & Scrollspy) ===
             */
            initScrollFunctionality() {
                const header = App.selectors.navbar;
                const sections = App.selectors.allSections;
                const navLinks = App.selectors.navLinksAnchors;
                const headerOffset = App.config.NAV_HIGHLIGHT_OFFSET;

                if (!header || sections.length === 0 || navLinks.length === 0) return;

                const handleStickyNav = () => {
                    if (window.scrollY > 50) {
                        header.classList.add('sticky');
                    } else {
                        header.classList.remove('sticky');
                    }
                };

                const handleNavHighlight = () => {
                    let scrollY = window.pageYOffset;
                    let currentActiveId = "home";

                    sections.forEach(current => {
                        const sectionHeight = current.offsetHeight;
                        const sectionTop = current.offsetTop - headerOffset;
                        const sectionId = current.getAttribute('id');
                        
                        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                            currentActiveId = sectionId;
                        }
                    });

                    navLinks.forEach(link => {
                        const linkId = link.getAttribute('href').substring(1);
                        if (linkId === currentActiveId) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                };

                const onScroll = () => {
                    handleStickyNav();
                    handleNavHighlight();
                };

                window.addEventListener('scroll', throttle(onScroll, App.config.SCROLL_THROTTLE_LIMIT));

                handleStickyNav();
                handleNavHighlight();
            },

            /**
             * === 4. Modul: Animasi Saat Scroll (Intersection Observer) ===
             */
            initScrollAnimations() {
                const hiddenElements = App.selectors.hiddenElements;
                if (hiddenElements.length === 0) return;

                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('show-anim');
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '0px 0px -100px 0px'
                });

                hiddenElements.forEach(el => {
                    observer.observe(el);
                });
            },

            /**
             * === 5. Modul: Pengalih Thumbnail Produk ===
             */
            initProductThumbnailSwitcher() {
                const thumbnails = App.selectors.productThumbnails;
                const mainImage = App.selectors.mainProductImage;
                const DURATION = App.config.IMAGE_TRANSITION_DURATION;

                if (thumbnails.length === 0 || !mainImage) return;

                thumbnails.forEach(thumb => {
                    thumb.addEventListener("click", function() {
                        const newImageSrc = this.getAttribute("data-target-img");

                        if (mainImage.src.endsWith(newImageSrc)) {
                            return;
                        }

                        thumbnails.forEach(t => t.classList.remove("active"));
                        this.classList.add("active");
                        
                        mainImage.classList.add("is-changing"); 

                        setTimeout(() => {
                            mainImage.src = newImageSrc;
                            mainImage.alt = this.alt;
                            mainImage.classList.remove("is-changing");
                        }, DURATION);
                    });
                });
            },

            /**
             * === 6. Modul: Tab Produk (Fresh, Processed, All) ===
             */
            initProductTabs() {
                const tabButtons = App.selectors.tabButtons;
                const productGrids = App.selectors.productGrids;
                const allProductsGrid = App.selectors.allProductsGrid;

                if (tabButtons.length === 0 || productGrids.length === 0) return;

                const switchProductTab = targetTab => {
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    
                    requestAnimationFrame(() => {
                        productGrids.forEach(grid => grid.classList.remove('active'));

                        const activeTabButton = document.querySelector(`.tab-button[data-tab="${targetTab}"]`);
                        if (activeTabButton) {
                            activeTabButton.classList.add('active');
                        }
                        
                        let targetGrid;
                        if (targetTab === 'all') {
                            targetGrid = allProductsGrid;
                        } else {
                            targetGrid = document.getElementById(`${targetTab}-products`);
                        }

                        if (targetGrid) {
                            targetGrid.classList.add('active');
                        }
                    });
                };

                tabButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const targetTab = this.getAttribute('data-tab');
                        switchProductTab(targetTab);
                    });
                });
            },

            /**
             * === 7. Modul: FAQ Accordion ===
             */
            initFaqAccordion() {
                const faqQuestions = App.selectors.faqQuestions;
                if (faqQuestions.length === 0) return;

                faqQuestions.forEach(question => {
                    question.addEventListener('click', () => {
                        const faqItem = question.closest('.faq-item');
                        if (!faqItem) return;

                        const answer = faqItem.querySelector('.faq-answer');
                        if (!answer) return;
            
                        const isActive = question.classList.contains('active');
            
                        // Tutup semua item lain (Accordion Single-Open)
                        faqQuestions.forEach(activeQuestion => {
                            if (activeQuestion !== question) {
                                activeQuestion.classList.remove('active');
                                const otherItem = activeQuestion.closest('.faq-item');
                                if (otherItem) {
                                    const otherAnswer = otherItem.querySelector('.faq-answer');
                                    if (otherAnswer) {
                                        otherAnswer.classList.remove('open');
                                    }
                                }
                            }
                        });
                        
                        // Toggle item yang diklik
                        question.classList.toggle('active');
                        answer.classList.toggle('open');
                    });
                });
            }
        },

        /**
         * 4. Inisialisasi Utama
         */
        init() {
            App.modules.initLanguageSwitcher();
            App.modules.initMobileNav();
            App.modules.initScrollFunctionality();
            App.modules.initScrollAnimations();
            App.modules.initProductThumbnailSwitcher();
            App.modules.initProductTabs();
            App.modules.initFaqAccordion();
        }
    };

    // Jalankan aplikasi
    App.init();

});