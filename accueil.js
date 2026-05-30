// ========== MENU MOBILE ==========
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-links a");

if (menuToggle && navMenu) {
    // Fermer le menu si on clique en dehors
    const handleClickOutside = (event) => {
        if (!navMenu.contains(event.target) && !menuToggle.contains(event.target) && navMenu.classList.contains("active")) {
            closeMenu();
        }
    };

    const closeMenu = () => {
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        document.body.style.overflow = ""; // Réactiver le scroll
        document.removeEventListener("click", handleClickOutside);
    };

    const openMenu = () => {
        navMenu.classList.add("active");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        document.body.style.overflow = "hidden"; // Empêcher le scroll en arrière-plan sur mobile
        setTimeout(() => {
            document.addEventListener("click", handleClickOutside);
        }, 100);
    };

    menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (navMenu.classList.contains("active")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Fermer le menu quand on clique sur un lien
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    // Fermer le menu avec la touche Echap
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navMenu.classList.contains("active")) {
            closeMenu();
        }
    });
}

// ========== SMOOTH SCROLL POUR LES ANCRES ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#" || href === "") return;

        const targetElement = document.querySelector(href);
        if (targetElement) {
            e.preventDefault();
            const offsetTop = targetElement.offsetTop - 80; // Éviter d'être caché sous le header fixe
            window.scrollTo({
                top: offsetTop,
                behavior: "smooth"
            });

            // Mettre à jour l'URL sans recharger
            if (history.pushState) {
                history.pushState(null, null, href);
            }
        }
    });
});

// ========== HEADER SCROLL EFFECT ==========
const header = document.querySelector(".nav");
let lastScroll = 0;

if (header) {
    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.background = "rgb(1, 4, 34)";
            header.style.backdropFilter = "blur(10px)";
            header.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";
        } else {
            header.style.background = "rgb(1, 4, 34)";
            header.style.backdropFilter = "blur(0px)";
            header.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.16)";
        }

        lastScroll = currentScroll;
    });
}

// ========== ANIMATION AU SCROLL (REVELATION DES ELEMENTS) ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // Une fois animé, on arrête d'observer
        }
    });
}, observerOptions);

// Ajouter la classe fade-in aux éléments à animer
const elementsToAnimate = document.querySelectorAll(".service-content, .stats-cards, .contact-card, .testimonial-card");
elementsToAnimate.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
});

// Style CSS pour l'animation visible (à injecter dynamiquement)
const style = document.createElement("style");
style.textContent = `
    .service-content.visible,
    .stats-cards.visible,
    .contact-card.visible,
    .testimonial-card.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ========== VALIDATION DU FORMULAIRE AVEC ENVOI AJAX ==========
const form = document.querySelector(".form-devis");
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const descriptionInput = document.getElementById("description");
        const submitBtn = form.querySelector(".form-btn");
        const originalBtnText = submitBtn.innerHTML;

        let hasError = false;

        // Validation simple
        if (!nameInput.value.trim()) {
            showError(nameInput, "Veuillez entrer votre nom ou entreprise");
            hasError = true;
        } else {
            clearError(nameInput);
        }

        if (!emailInput.value.trim()) {
            showError(emailInput, "Veuillez entrer votre email");
            hasError = true;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, "Email invalide (ex: nom@domaine.com)");
            hasError = true;
        } else {
            clearError(emailInput);
        }

        if (!descriptionInput.value.trim()) {
            showError(descriptionInput, "Veuillez décrire votre projet");
            hasError = true;
        } else {
            clearError(descriptionInput);
        }

        if (hasError) return;

        // Désactiver le bouton et afficher le chargement
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...';

        // Simuler l'envoi ou utiliser Formspree/Netlify
        try {
            // Si vous utilisez Formspree, décommentez ceci :
            // const response = await fetch(form.action, {
            //     method: "POST",
            //     body: new FormData(form),
            //     headers: { "Accept": "application/json" }
            // });
            // if (response.ok) {
            //     showNotification("success", "Votre demande a été envoyée avec succès !");
            //     form.reset();
            // } else {
            //     throw new Error("Erreur d'envoi");
            // }

            // Simulation d'envoi (à remplacer par votre vrai endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Notification de succès
            showNotification("success", "✅ Demande envoyée ! Nous vous répondrons sous 24h.");
            form.reset();

            // Tracking de conversion
            if (typeof gtag !== "undefined") {
                gtag("event", "submit_form", {
                    "event_category": "contact",
                    "event_label": "devis_gratuit"
                });
            }

        } catch (error) {
            showNotification("error", "❌ Erreur d'envoi. Veuillez réessayer ou nous contacter directement.");
            console.error("Erreur formulaire:", error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;

            // Masquer la notification après 5 secondes
            setTimeout(() => {
                const notification = document.querySelector(".notification-toast");
                if (notification) notification.remove();
            }, 5000);
        }
    });
}

// Fonction pour valider l'email
function isValidEmail(email) {
    const regex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    return regex.test(email);
}

// Fonction pour afficher une erreur sous un champ
function showError(input, message) {
    clearError(input);
    input.style.borderColor = "#ff4444";
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.color = "#ff4444";
    errorDiv.style.fontSize = "11px";
    errorDiv.style.marginTop = "4px";
    errorDiv.innerText = message;
    input.parentNode.appendChild(errorDiv);
}

// Fonction pour effacer l'erreur
function clearError(input) {
    input.style.borderColor = "";
    const parent = input.parentNode;
    const existingError = parent.querySelector(".error-message");
    if (existingError) existingError.remove();
}

// Fonction pour afficher une notification toast
function showNotification(type, message) {
    // Supprimer les anciennes notifications
    const oldNotification = document.querySelector(".notification-toast");
    if (oldNotification) oldNotification.remove();

    const notification = document.createElement("div");
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 14px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            ${type === "success" ? "background: #00d9d9; color: #000c19;" : "background: #ff4444; color: white;"}
        ">
            ${message}
        </div>
        <style>
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        </style>
    `;
    document.body.appendChild(notification);

    // Auto-suppression après 5 secondes
    setTimeout(() => {
        if (notification && notification.remove) notification.remove();
    }, 5000);
}

// ========== NUMEROS DE TELEPHONE CLICKABLE ==========
const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
phoneLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (typeof gtag !== "undefined") {
            gtag("event", "click_phone", {
                "event_category": "contact",
                "event_label": link.getAttribute("href")
            });
        }
    });
});

// ========== WHATSAPP CLICK TRACKING ==========
const whatsappBtns = document.querySelectorAll('a[href*="wa.me"]');
whatsappBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (typeof gtag !== "undefined") {
            gtag("event", "click_whatsapp", {
                "event_category": "contact",
                "event_label": "whatsapp_chat"
            });
        }
    });
});

// ========== BOUTONS DE DEVIS ==========
const devisButtons = document.querySelectorAll(".btn-nav, .btn1, .btn2, .form-btn");
devisButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        if (typeof gtag !== "undefined") {
            gtag("event", "clic_devis", {
                "event_category": "conversion",
                "event_label": btn.innerText.trim()
            });
        }
    });
});

// ========== LAZY LOADING AVANCÉ POUR LES IMAGES ==========
if ("IntersectionObserver" in window) {
    const lazyImages = document.querySelectorAll("img[loading='lazy']");
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute("data-src");
                }
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========== DETECTION DU THEME SOMBRE (optionnel) ==========
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
if (prefersDarkScheme.matches) {
    document.body.classList.add("dark-mode");
}

// ========== GESTION DES PARAMÈTRES URL POUR LE SUIVI ==========
const urlParams = new URLSearchParams(window.location.search);
const source = urlParams.get("utm_source");
const medium = urlParams.get("utm_medium");
const campaign = urlParams.get("utm_campaign");

if (source && typeof gtag !== "undefined") {
    gtag("event", "page_view", {
        "traffic_source": source,
        "traffic_medium": medium,
        "campaign_name": campaign
    });
}

// ========== AJOUTER L'ANNÉE COURANTE DANS LE FOOTER ==========
const yearElement = document.querySelector(".licence p");
if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = yearElement.innerHTML.replace("2026", currentYear);
}

// ========== CONSERVATION DE L'ÉTAT DU MENU APRÈS RECHARGEMENT ==========
// Optionnel : Sauvegarder l'état du menu dans sessionStorage
// (décommentez si besoin)
/*
window.addEventListener("beforeunload", () => {
    if (navMenu && navMenu.classList.contains("active")) {
        sessionStorage.setItem("menuOpen", "true");
    } else {
        sessionStorage.removeItem("menuOpen");
    }
});

if (sessionStorage.getItem("menuOpen") === "true") {
    openMenu();
}
*/

console.log("✅ Infinity Dev - Site optimisé et prêt !");