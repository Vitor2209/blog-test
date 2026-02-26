/* =============================================
   TEC BRASIL - Main JavaScript
   Controle do menu, dark mode, busca e interações
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização de todos os módulos
    initDarkMode();
    initMobileMenu();
    initSearch();
    initNewsletter();
    initViewCounter();
    initSmoothScroll();
});

/* =============================================
   Dark Mode Toggle
   ============================================= */
function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Verificar preferência salva ou do sistema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateDarkModeIcon(savedTheme === 'dark');
    } else if (prefersDark.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateDarkModeIcon(true);
    }
    
    // Toggle click handler
    if (toggle) {
        toggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateDarkModeIcon(newTheme === 'dark');
            
            showToast(newTheme === 'dark' ? 'Modo escuro ativado' : 'Modo claro ativado');
        });
    }
}

function updateDarkModeIcon(isDark) {
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

/* =============================================
   Mobile Menu
   ============================================= */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const isOpen = navMenu.classList.contains('active');
            menuBtn.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!menuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                menuBtn.querySelector('i').className = 'fas fa-bars';
            }
        });
        
        // Fechar menu ao redimensionar para desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 1024) {
                navMenu.classList.remove('active');
                menuBtn.querySelector('i').className = 'fas fa-bars';
            }
        });
    }
}

/* =============================================
   Search Functionality
   ============================================= */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const closeModalBtn = document.getElementById('closeSearchModal');
    const modalSearchInput = document.getElementById('modalSearchInput');
    const modalSearchBtn = document.getElementById('modalSearchBtn');
    const searchResults = document.getElementById('searchResults');
    
    // Dados de busca simulados
    const searchData = [
        {
            title: 'iPhone 16 Pro Max: Vale a Pena Comprar?',
            category: 'Reviews',
            image: 'https://images.unsplash.com/photo-1764744224150-5d54a48f7947?w=200',
            url: 'review.html'
        },
        {
            title: 'Melhores Fones de Ouvido Bluetooth de 2026',
            category: 'Comparativo',
            image: 'https://images.pexels.com/photos/35147239/pexels-photo-35147239.jpeg?auto=compress&cs=tinysrgb&w=200',
            url: 'artigo.html'
        },
        {
            title: 'Como Montar o Setup Gamer Perfeito',
            category: 'Guias',
            image: 'https://images.pexels.com/photos/9794458/pexels-photo-9794458.jpeg?auto=compress&cs=tinysrgb&w=200',
            url: 'artigo.html'
        },
        {
            title: 'Windows 12: Novidades e Expectativas',
            category: 'Notícias',
            image: 'https://images.unsplash.com/photo-1692663732610-dce180040495?w=200',
            url: 'artigo.html'
        },
        {
            title: 'Review: Melhor Monitor 4K para Jogos',
            category: 'Reviews',
            image: 'https://images.unsplash.com/photo-1632064824547-e77c36851495?w=200',
            url: 'artigo.html'
        },
        {
            title: 'PlayStation 5 ou Xbox Series S: Qual Console é Melhor?',
            category: 'Comparativo',
            image: 'https://images.pexels.com/photos/9794458/pexels-photo-9794458.jpeg?auto=compress&cs=tinysrgb&w=200',
            url: 'artigo.html'
        },
        {
            title: 'Como Configurar Alexa para Dispositivos Inteligentes',
            category: 'Tutoriais',
            image: 'https://images.unsplash.com/photo-1758525747606-bd5d801ca87b?w=200',
            url: 'artigo.html'
        },
        {
            title: 'Galaxy S24: Teste Mostra Se Novo Celular Vale a Pena',
            category: 'Reviews',
            image: 'https://images.pexels.com/photos/35147262/pexels-photo-35147262.jpeg?auto=compress&cs=tinysrgb&w=200',
            url: 'review.html'
        }
    ];
    
    // Abrir modal de busca
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            openSearchModal();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            openSearchModal();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                openSearchModal();
                if (modalSearchInput) {
                    modalSearchInput.value = this.value;
                    performSearch(this.value);
                }
            }
        });
    }
    
    // Fechar modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeSearchModal);
    }
    
    if (searchModal) {
        searchModal.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                closeSearchModal();
            }
        });
    }
    
    // Busca no modal
    if (modalSearchInput) {
        modalSearchInput.addEventListener('input', function() {
            performSearch(this.value);
        });
        
        modalSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
    
    if (modalSearchBtn) {
        modalSearchBtn.addEventListener('click', function() {
            if (modalSearchInput) {
                performSearch(modalSearchInput.value);
            }
        });
    }
    
    function openSearchModal() {
        if (searchModal) {
            searchModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (modalSearchInput) {
                setTimeout(() => modalSearchInput.focus(), 100);
            }
        }
    }
    
    function closeSearchModal() {
        if (searchModal) {
            searchModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    function performSearch(query) {
        if (!searchResults) return;
        
        const trimmedQuery = query.trim().toLowerCase();
        
        if (trimmedQuery.length < 2) {
            searchResults.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 20px;">Digite pelo menos 2 caracteres para buscar...</p>';
            return;
        }
        
        const results = searchData.filter(item => 
            item.title.toLowerCase().includes(trimmedQuery) ||
            item.category.toLowerCase().includes(trimmedQuery)
        );
        
        if (results.length === 0) {
            searchResults.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 20px;">Nenhum resultado encontrado para "' + query + '"</p>';
            return;
        }
        
        searchResults.innerHTML = results.map(item => `
            <a href="${item.url}" class="search-result-item">
                <img src="${item.image}" alt="${item.title}">
                <div>
                    <h4>${highlightMatch(item.title, trimmedQuery)}</h4>
                    <p>${item.category}</p>
                </div>
            </a>
        `).join('');
    }
    
    function highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background-color: var(--accent); color: white; padding: 0 2px; border-radius: 2px;">$1</mark>');
    }
    
    // Atalho de teclado para busca (Ctrl+K ou Cmd+K)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearchModal();
        }
        
        if (e.key === 'Escape') {
            closeSearchModal();
        }
    });
}

/* =============================================
   Newsletter Form
   ============================================= */
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('newsletterEmail');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (emailInput && emailInput.value) {
                // Simulação de envio
                const email = emailInput.value;
                
                // Validar email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showToast('Por favor, insira um e-mail válido', 'error');
                    return;
                }
                
                // Simular sucesso
                showToast('Inscrição realizada com sucesso! Obrigado por se inscrever.');
                emailInput.value = '';
            }
        });
    }
}

/* =============================================
   View Counter (Simulado)
   ============================================= */
function initViewCounter() {
    const viewCounters = document.querySelectorAll('[data-views]');
    
    viewCounters.forEach(counter => {
        const baseViews = parseInt(counter.getAttribute('data-views')) || 1000;
        const randomViews = baseViews + Math.floor(Math.random() * 500);
        counter.textContent = formatNumber(randomViews);
    });
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/* =============================================
   Toast Notification
   ============================================= */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        const icon = toast.querySelector('i');
        
        // Definir ícone e cor baseado no tipo
        if (icon) {
            if (type === 'error') {
                icon.className = 'fas fa-exclamation-circle';
                toast.style.backgroundColor = '#ef4444';
            } else {
                icon.className = 'fas fa-check-circle';
                toast.style.backgroundColor = '#10b981';
            }
        }
        
        toastMessage.textContent = message;
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
}

/* =============================================
   Smooth Scroll
   ============================================= */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
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
}

/* =============================================
   Tab Functionality
   ============================================= */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // Remove active de todos
            tabButtons.forEach(b => b.classList.remove('active'));
            
            // Adiciona active ao clicado
            this.classList.add('active');
            
            // Aqui você pode adicionar lógica para trocar conteúdo
            console.log('Tab selecionada:', tab);
        });
    });
}

// Inicializar tabs se existirem
document.addEventListener('DOMContentLoaded', initTabs);

/* =============================================
   Share Buttons
   ============================================= */
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const pageUrl = encodeURIComponent(window.location.href);
            const pageTitle = encodeURIComponent(document.title);
            
            let shareUrl = '';
            
            if (this.classList.contains('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
            } else if (this.classList.contains('twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
            } else if (this.classList.contains('whatsapp')) {
                shareUrl = `https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`;
            } else if (this.classList.contains('linkedin')) {
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}`;
            } else if (this.classList.contains('copy')) {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showToast('Link copiado para a área de transferência!');
                });
                return;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Inicializar share buttons se existirem
document.addEventListener('DOMContentLoaded', initShareButtons);

/* =============================================
   Lazy Loading Images
   ============================================= */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores antigos
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

document.addEventListener('DOMContentLoaded', initLazyLoading);

/* =============================================
   Header Scroll Effect
   ============================================= */
function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.style.boxShadow = 'var(--shadow-lg)';
            return;
        }
        
        if (currentScroll > lastScroll) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        }
        
        lastScroll = currentScroll;
    });
}

// Descomentrar para ativar o efeito de scroll no header
// document.addEventListener('DOMContentLoaded', initHeaderScroll);

/* =============================================
   Export para uso global
   ============================================= */
window.TecBrasil = {
    showToast,
    formatNumber
};
