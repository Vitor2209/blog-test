// ============================================
// Setup de Programador - JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();
    
    // Initialize all modules
    initHeader();
    initMobileMenu();
    initLeadCapture();
    initComparator();
    initAnimations();
});

// ============================================
// Header Scroll Effect
// ============================================
function initHeader() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ============================================
// Mobile Menu
// ============================================
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');
    
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
    
    mobileMenuClose.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ============================================
// Lead Capture Form
// ============================================
function initLeadCapture() {
    const form = document.getElementById('leadCaptureForm');
    const successMessage = document.getElementById('successMessage');
    const emailInput = document.getElementById('emailInput');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        if (!email) return;
        
        // Get submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="loading-spinner"></span>
            Enviando...
        `;
        
        // Simulate API call
        setTimeout(() => {
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');
            
            // Re-initialize icons for success message
            lucide.createIcons();
            
            // Reset form after 5 seconds
            setTimeout(() => {
                form.classList.remove('hidden');
                successMessage.classList.add('hidden');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
                emailInput.value = '';
                lucide.createIcons();
            }, 5000);
        }, 1000);
    });
}

// ============================================
// Notebook Comparator
// ============================================
function initComparator() {
    const notebook1Select = document.getElementById('notebook1');
    const notebook2Select = document.getElementById('notebook2');
    const compareButton = document.getElementById('compareButton');
    const comparisonResult = document.getElementById('comparisonResult');
    const comparisonTable = document.getElementById('comparisonTable');
    const comparisonCtas = document.getElementById('comparisonCtas');
    
    // Notebook data
    const notebooks = {
        'acer-aspire-5': {
            name: 'Acer Aspire 5',
            processor: 'AMD Ryzen 5 5500U',
            ram: '8GB DDR4',
            storage: 'SSD 256GB NVMe',
            display: '15.6" Full HD IPS',
            battery: '8 horas',
            weight: '1.8kg',
            forProgramming: true,
            forGaming: false,
        },
        'lenovo-ideapad-3': {
            name: 'Lenovo IdeaPad 3',
            processor: 'AMD Ryzen 7 5700U',
            ram: '16GB DDR4',
            storage: 'SSD 512GB NVMe',
            display: '15.6" Full HD IPS',
            battery: '7 horas',
            weight: '1.7kg',
            forProgramming: true,
            forGaming: true,
        },
        'dell-inspiron-15': {
            name: 'Dell Inspiron 15',
            processor: 'Intel Core i5-1235U',
            ram: '8GB DDR4',
            storage: 'SSD 256GB NVMe',
            display: '15.6" Full HD',
            battery: '6 horas',
            weight: '1.9kg',
            forProgramming: true,
            forGaming: false,
        },
        'samsung-book': {
            name: 'Samsung Book',
            processor: 'Intel Core i7-1165G7',
            ram: '16GB DDR4',
            storage: 'SSD 512GB NVMe',
            display: '15.6" Full HD',
            battery: '10 horas',
            weight: '1.6kg',
            forProgramming: true,
            forGaming: false,
        }
    };
    
    // Update button state
    function updateButtonState() {
        const n1 = notebook1Select.value;
        const n2 = notebook2Select.value;
        compareButton.disabled = !n1 || !n2 || n1 === n2;
    }
    
    notebook1Select.addEventListener('change', () => {
        updateButtonState();
        comparisonResult.classList.add('hidden');
    });
    
    notebook2Select.addEventListener('change', () => {
        updateButtonState();
        comparisonResult.classList.add('hidden');
    });
    
    // Compare button click
    compareButton.addEventListener('click', () => {
        const n1 = notebook1Select.value;
        const n2 = notebook2Select.value;
        
        if (!n1 || !n2 || n1 === n2) return;
        
        const nb1 = notebooks[n1];
        const nb2 = notebooks[n2];
        
        // Build comparison table
        const specs = [
            { key: 'processor', label: 'Processador', icon: 'cpu' },
            { key: 'ram', label: 'Memoria RAM', icon: 'zap' },
            { key: 'storage', label: 'Armazenamento', icon: 'hard-drive' },
            { key: 'display', label: 'Tela', icon: 'monitor' },
            { key: 'battery', label: 'Bateria', icon: 'zap' },
            { key: 'forProgramming', label: 'Bom para programar', icon: 'check-circle', isBoolean: true },
            { key: 'forGaming', label: 'Bom para jogos', icon: 'check-circle', isBoolean: true },
        ];
        
        let tableHTML = `
            <div class="comparison-header">
                <span>Especificacao</span>
                <span>${nb1.name}</span>
                <span>${nb2.name}</span>
            </div>
        `;
        
        specs.forEach(spec => {
            const val1 = nb1[spec.key];
            const val2 = nb2[spec.key];
            
            let val1Display, val2Display;
            
            if (spec.isBoolean) {
                val1Display = val1 
                    ? '<i data-lucide="check-circle" class="check"></i>' 
                    : '<i data-lucide="x-circle" class="x"></i>';
                val2Display = val2 
                    ? '<i data-lucide="check-circle" class="check"></i>' 
                    : '<i data-lucide="x-circle" class="x"></i>';
            } else {
                val1Display = val1;
                val2Display = val2;
            }
            
            tableHTML += `
                <div class="comparison-row">
                    <div class="spec-label">
                        <i data-lucide="${spec.icon}"></i>
                        <span>${spec.label}</span>
                    </div>
                    <div class="spec-value">${val1Display}</div>
                    <div class="spec-value">${val2Display}</div>
                </div>
            `;
        });
        
        comparisonTable.innerHTML = tableHTML;
        
        // Build CTAs
        comparisonCtas.innerHTML = `
            <a href="#affiliate-link" class="btn-primary" data-testid="compare-cta-1">
                Ver ${nb1.name}
            </a>
            <a href="#affiliate-link" class="btn-primary" data-testid="compare-cta-2">
                Ver ${nb2.name}
            </a>
        `;
        
        // Show result
        comparisonResult.classList.remove('hidden');
        
        // Re-initialize icons
        lucide.createIcons();
        
        // Scroll to result
        comparisonResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with animate class
    const animatedElements = document.querySelectorAll('.animate-fade-in-up');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// ============================================
// Smooth Scroll for Navigation Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#affiliate-link') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
