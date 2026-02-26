/* =============================================
   TEC BRASIL - Hero Slider
   Controle do slider principal com autoplay
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    initHeroSlider();
});

function initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    
    let currentSlide = 0;
    let autoplayInterval = null;
    const autoplayDelay = 5000; // 5 segundos
    
    // Função para mostrar slide específico
    function showSlide(index) {
        // Normalizar índice
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        
        // Remover active de todos
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Adicionar active ao slide atual
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Próximo slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Slide anterior
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Iniciar autoplay
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }
    
    // Parar autoplay
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }
    
    // Event listeners para botões
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            startAutoplay(); // Reiniciar autoplay após interação
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            startAutoplay();
        });
    }
    
    // Event listeners para dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            startAutoplay();
        });
    });
    
    // Pausar autoplay ao hover
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    
    // Touch events para mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });
    
    slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left = next
            } else {
                prevSlide(); // Swipe right = prev
            }
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Verificar se o slider está visível
        const rect = slider.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                startAutoplay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                startAutoplay();
            }
        }
    });
    
    // Iniciar autoplay
    startAutoplay();
    
    // Pausar quando a página não está visível
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });
}

/* =============================================
   Gallery Slider (para página de produto)
   ============================================= */
function initGallerySlider() {
    const gallery = document.querySelector('.product-gallery');
    if (!gallery) return;
    
    const mainImage = gallery.querySelector('.gallery-main img');
    const thumbs = gallery.querySelectorAll('.gallery-thumb');
    
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Atualizar imagem principal
            const newSrc = this.querySelector('img').src;
            mainImage.src = newSrc;
            
            // Atualizar classe active
            thumbs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Keyboard navigation para gallery
    let currentThumb = 0;
    
    document.addEventListener('keydown', function(e) {
        if (!gallery.matches(':hover')) return;
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            currentThumb = Math.max(0, currentThumb - 1);
            thumbs[currentThumb].click();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            currentThumb = Math.min(thumbs.length - 1, currentThumb + 1);
            thumbs[currentThumb].click();
        }
    });
}

document.addEventListener('DOMContentLoaded', initGallerySlider);

/* =============================================
   News Section Navigation
   ============================================= */
function initNewsNav() {
    const newsSection = document.querySelector('.news-section');
    if (!newsSection) return;
    
    const prevBtn = document.getElementById('newsNavPrev');
    const nextBtn = document.getElementById('newsNavNext');
    const newsGrid = document.getElementById('newsGrid');
    
    if (!newsGrid) return;
    
    let scrollPosition = 0;
    const scrollAmount = 320; // Largura aproximada de um card
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            scrollPosition += scrollAmount;
            const maxScroll = newsGrid.scrollWidth - newsGrid.clientWidth;
            scrollPosition = Math.min(scrollPosition, maxScroll);
            newsGrid.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            scrollPosition -= scrollAmount;
            scrollPosition = Math.max(0, scrollPosition);
            newsGrid.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', initNewsNav);

/* =============================================
   Export
   ============================================= */
window.TecBrasilSlider = {
    initHeroSlider,
    initGallerySlider,
    initNewsNav
};
