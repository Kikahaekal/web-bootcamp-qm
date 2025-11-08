// ===========================================
// LANGUAGE TRANSLATION SYSTEM
// ===========================================

const languageToggle = document.getElementById('languageToggle');
let currentLanguage = 'en';

// Error messages in both languages
const errorMessages = {
    en: {
        nameRequired: 'Please enter your name',
        nameLength: 'Name must be at least 2 characters',
        emailRequired: 'Please enter your email',
        emailInvalid: 'Please enter a valid email address',
        messageRequired: 'Please enter your message',
        messageLength: 'Message must be at least 10 characters'
    },
    id: {
        nameRequired: 'Silakan masukkan nama Anda',
        nameLength: 'Nama harus minimal 2 karakter',
        emailRequired: 'Silakan masukkan email Anda',
        emailInvalid: 'Silakan masukkan alamat email yang valid',
        messageRequired: 'Silakan masukkan pesan Anda',
        messageLength: 'Pesan harus minimal 10 karakter'
    }
};

// Language toggle event listener
languageToggle.addEventListener('change', function() {
    currentLanguage = this.checked ? 'id' : 'en';
    translatePage(currentLanguage);
    
    // Save language preference to localStorage
    localStorage.setItem('preferredLanguage', currentLanguage);
});

// Load saved language preference on page load
window.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage === 'id') {
        languageToggle.checked = true;
        currentLanguage = 'id';
        translatePage('id');
    }
});

// Main translation function
function translatePage(lang) {
    // Translate all elements with data-en and data-id attributes
    const elements = document.querySelectorAll('[data-en][data-id]');
    
    elements.forEach(element => {
        const text = lang === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-id');
        
        // Handle HTML content (like <br> tags)
        if (text.includes('<br>')) {
            element.innerHTML = text;
        } else {
            element.textContent = text;
        }
    });
    
    // Update error messages if they are visible
    updateErrorMessages();
}

// Update error messages when language changes
function updateErrorMessages() {
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    
    // Only update if error is currently visible
    if (nameError.style.display === 'block') {
        const currentError = nameError.textContent;
        if (currentError.includes('enter') || currentError.includes('masukkan')) {
            nameError.textContent = errorMessages[currentLanguage].nameRequired;
        } else {
            nameError.textContent = errorMessages[currentLanguage].nameLength;
        }
    }
    
    if (emailError.style.display === 'block') {
        const currentError = emailError.textContent;
        if (currentError.includes('enter your') || currentError.includes('masukkan email')) {
            emailError.textContent = errorMessages[currentLanguage].emailRequired;
        } else {
            emailError.textContent = errorMessages[currentLanguage].emailInvalid;
        }
    }
    
    if (messageError.style.display === 'block') {
        const currentError = messageError.textContent;
        if (currentError.includes('enter your') || currentError.includes('masukkan pesan')) {
            messageError.textContent = errorMessages[currentLanguage].messageRequired;
        } else {
            messageError.textContent = errorMessages[currentLanguage].messageLength;
        }
    }
}

// ===========================================
// FORM VALIDATION AND SUBMISSION
// ===========================================

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset previous errors
    clearErrors();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    
    // Validate name
    if (name === '') {
        showError('name', 'nameError', errorMessages[currentLanguage].nameRequired);
        isValid = false;
    } else if (name.length < 2) {
        showError('name', 'nameError', errorMessages[currentLanguage].nameLength);
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        showError('email', 'emailError', errorMessages[currentLanguage].emailRequired);
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('email', 'emailError', errorMessages[currentLanguage].emailInvalid);
        isValid = false;
    }
    
    // Validate message
    if (message === '') {
        showError('message', 'messageError', errorMessages[currentLanguage].messageRequired);
        isValid = false;
    } else if (message.length < 10) {
        showError('message', 'messageError', errorMessages[currentLanguage].messageLength);
        isValid = false;
    }
    
    // If form is valid, show success and reset
    if (isValid) {
        showSuccess();
        this.reset();
        
        // Log form data (in real application, this would be sent to server)
        console.log('Form submitted:', {
            name: name,
            email: email,
            message: message,
            language: currentLanguage,
            timestamp: new Date().toISOString()
        });
    }
});

// Real-time validation on blur
document.getElementById('name').addEventListener('blur', function() {
    if (this.value.trim() !== '') {
        validateField('name', this.value.trim().length >= 2, errorMessages[currentLanguage].nameLength);
    }
});

document.getElementById('email').addEventListener('blur', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value.trim() !== '') {
        validateField('email', emailRegex.test(this.value.trim()), errorMessages[currentLanguage].emailInvalid);
    }
});

document.getElementById('message').addEventListener('blur', function() {
    if (this.value.trim() !== '') {
        validateField('message', this.value.trim().length >= 10, errorMessages[currentLanguage].messageLength);
    }
});

// Clear errors when user starts typing
document.querySelectorAll('input, textarea').forEach(element => {
    element.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            this.classList.remove('error');
            const errorElement = document.getElementById(this.id + 'Error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
    });
});

// ===========================================
// HELPER FUNCTIONS
// ===========================================

// Show error for specific field
function showError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    field.classList.add('error');
    error.textContent = message;
    error.style.display = 'block';
}

// Clear all errors
function clearErrors() {
    const inputs = document.querySelectorAll('input, textarea');
    const errors = document.querySelectorAll('.error-message');
    
    inputs.forEach(input => input.classList.remove('error'));
    errors.forEach(error => {
        error.style.display = 'none';
        error.textContent = '';
    });
    
    document.getElementById('successMessage').style.display = 'none';
}

// Validate individual field
function validateField(fieldId, isValid, errorMessage) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    
    if (!isValid) {
        field.classList.add('error');
        error.textContent = errorMessage;
        error.style.display = 'block';
    } else {
        field.classList.remove('error');
        error.style.display = 'none';
    }
}

// Show success message
function showSuccess() {
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// ===========================================
// SMOOTH SCROLL FOR NAVIGATION
// ===========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================================
// HEADER SCROLL EFFECT
// ===========================================

let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.9)';
        header.style.padding = '15px 80px';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.5)';
        header.style.padding = '20px 80px';
    }
    
    lastScroll = currentScroll;
});

// ===========================================
// ANIMATION ON SCROLL
// ===========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.contact-card, .location-card, .contact-form').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Console welcome message
console.log('%c🍄 Queen\'s Mushroom', 'color: #D4AF37; font-size: 24px; font-weight: bold;');
console.log('%cFresh. Local. Sustainable.', 'color: #8B7355; font-size: 14px;');