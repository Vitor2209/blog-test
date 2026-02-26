/* =============================================
   TEC BRASIL - Filters & Pagination
   Controle de filtros, colunas e paginação
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    initFilters();
    initColumnToggle();
    initPagination();
    initStarRating();
    initCommentForm();
    initContactForm();
});

/* =============================================
   Filtros de Categoria
   ============================================= */
function initFilters() {
    const filterSelect = document.getElementById('filterSelect');
    const articlesGrid = document.querySelector('.articles-grid');
    
    if (!filterSelect || !articlesGrid) return;
    
    filterSelect.addEventListener('change', function() {
        const sortBy = this.value;
        const articles = Array.from(articlesGrid.querySelectorAll('.news-card'));
        
        // Ordenar artigos baseado na seleção
        articles.sort((a, b) => {
            switch(sortBy) {
                case 'recentes':
                    return getDate(b) - getDate(a);
                case 'mais-lidas':
                    return getViews(b) - getViews(a);
                case 'melhor-avaliadas':
                    return getRating(b) - getRating(a);
                default:
                    return 0;
            }
        });
        
        // Reordenar no DOM
        articles.forEach(article => {
            articlesGrid.appendChild(article);
        });
        
        // Animação sutil
        articles.forEach((article, index) => {
            article.style.opacity = '0';
            article.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                article.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                article.style.opacity = '1';
                article.style.transform = 'translateY(0)';
            }, index * 50);
        });
    });
    
    function getDate(element) {
        const dateEl = element.querySelector('.card-meta span:first-child');
        if (!dateEl) return 0;
        
        const dateText = dateEl.textContent;
        // Parse date format: "26 de Janeiro de 2026"
        const months = {
            'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
            'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
            'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
        };
        
        const match = dateText.match(/(\d+)\s+de\s+(\w+)\s+de\s+(\d+)/i);
        if (match) {
            const day = parseInt(match[1]);
            const month = months[match[2].toLowerCase()] || 0;
            const year = parseInt(match[3]);
            return new Date(year, month, day).getTime();
        }
        return 0;
    }
    
    function getViews(element) {
        const viewsEl = element.querySelector('[data-views]');
        return viewsEl ? parseInt(viewsEl.dataset.views) : Math.floor(Math.random() * 10000);
    }
    
    function getRating(element) {
        const ratingEl = element.querySelector('.review-score');
        return ratingEl ? parseFloat(ratingEl.textContent) : 0;
    }
}

/* =============================================
   Toggle de Colunas (1, 2 ou 3)
   ============================================= */
function initColumnToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const articlesGrid = document.querySelector('.articles-grid');
    
    if (!viewButtons.length || !articlesGrid) return;
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const columns = this.getAttribute('data-columns');
            
            // Atualizar botões
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Atualizar grid
            articlesGrid.setAttribute('data-columns', columns);
            
            // Salvar preferência
            localStorage.setItem('preferredColumns', columns);
            
            // Animação
            articlesGrid.style.opacity = '0';
            setTimeout(() => {
                articlesGrid.style.opacity = '1';
            }, 150);
        });
    });
    
    // Restaurar preferência salva
    const savedColumns = localStorage.getItem('preferredColumns');
    if (savedColumns) {
        const savedBtn = document.querySelector(`[data-columns="${savedColumns}"]`);
        if (savedBtn) {
            savedBtn.click();
        }
    }
}

/* =============================================
   Sistema de Paginação
   ============================================= */
function initPagination() {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;
    
    const paginationBtns = pagination.querySelectorAll('.pagination-btn:not(.prev):not(.next)');
    const prevBtn = pagination.querySelector('.pagination-btn.prev');
    const nextBtn = pagination.querySelector('.pagination-btn.next');
    
    let currentPage = 1;
    const totalPages = paginationBtns.length;
    
    // Click nos números
    paginationBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            goToPage(index + 1);
        });
    });
    
    // Botão anterior
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                goToPage(currentPage - 1);
            }
        });
    }
    
    // Botão próximo
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                goToPage(currentPage + 1);
            }
        });
    }
    
    function goToPage(page) {
        currentPage = page;
        
        // Atualizar botões
        paginationBtns.forEach((btn, index) => {
            btn.classList.toggle('active', index + 1 === page);
        });
        
        // Atualizar estado dos botões prev/next
        if (prevBtn) {
            prevBtn.disabled = page === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = page === totalPages;
        }
        
        // Scroll suave para o topo
        window.scrollTo({
            top: 200,
            behavior: 'smooth'
        });
        
        // Aqui você faria a requisição para buscar os dados da página
        // Por enquanto, apenas mostra uma mensagem
        console.log(`Navegando para página ${page}`);
        
        // Simular carregamento
        const articlesGrid = document.querySelector('.articles-grid');
        if (articlesGrid) {
            articlesGrid.style.opacity = '0.5';
            setTimeout(() => {
                articlesGrid.style.opacity = '1';
            }, 300);
        }
    }
}

/* =============================================
   Sistema de Avaliação com Estrelas
   ============================================= */
function initStarRating() {
    const ratingContainers = document.querySelectorAll('.interactive-rating');
    
    ratingContainers.forEach(container => {
        const stars = container.querySelectorAll('.star');
        const ratingInput = container.querySelector('input[type="hidden"]');
        let currentRating = 0;
        
        stars.forEach((star, index) => {
            // Hover effect
            star.addEventListener('mouseenter', function() {
                highlightStars(index + 1);
            });
            
            star.addEventListener('mouseleave', function() {
                highlightStars(currentRating);
            });
            
            // Click para definir rating
            star.addEventListener('click', function() {
                currentRating = index + 1;
                highlightStars(currentRating);
                
                if (ratingInput) {
                    ratingInput.value = currentRating;
                }
                
                // Feedback visual
                this.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
        
        function highlightStars(count) {
            stars.forEach((star, index) => {
                const icon = star.querySelector('i');
                if (icon) {
                    if (index < count) {
                        icon.className = 'fas fa-star';
                        star.style.color = '#f59e0b';
                    } else {
                        icon.className = 'far fa-star';
                        star.style.color = '#e2e8f0';
                    }
                }
            });
        }
    });
}

/* =============================================
   Formulário de Comentários
   ============================================= */
function initCommentForm() {
    const commentForm = document.querySelector('.comment-form form');
    if (!commentForm) return;
    
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const textarea = this.querySelector('textarea');
        const nameInput = this.querySelector('input[name="name"]');
        
        if (!textarea || !textarea.value.trim()) {
            window.TecBrasil?.showToast('Por favor, escreva um comentário', 'error');
            return;
        }
        
        // Simular envio
        const comment = {
            name: nameInput?.value || 'Visitante',
            text: textarea.value,
            date: new Date().toLocaleDateString('pt-BR')
        };
        
        // Adicionar comentário na lista
        const commentsList = document.querySelector('.comments-list');
        if (commentsList) {
            const newComment = document.createElement('div');
            newComment.className = 'comment';
            newComment.innerHTML = `
                <div class="comment-avatar">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name)}&background=0d9488&color=fff" alt="${comment.name}">
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${comment.name}</span>
                        <span class="comment-date">Agora</span>
                    </div>
                    <p class="comment-text">${comment.text}</p>
                </div>
            `;
            
            // Animação de entrada
            newComment.style.opacity = '0';
            newComment.style.transform = 'translateY(-20px)';
            
            commentsList.insertBefore(newComment, commentsList.firstChild);
            
            setTimeout(() => {
                newComment.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                newComment.style.opacity = '1';
                newComment.style.transform = 'translateY(0)';
            }, 50);
        }
        
        // Limpar form
        textarea.value = '';
        if (nameInput) nameInput.value = '';
        
        window.TecBrasil?.showToast('Comentário enviado com sucesso!');
    });
}

/* =============================================
   Formulário de Contato
   ============================================= */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Validações básicas
        if (!data.name || data.name.trim().length < 2) {
            window.TecBrasil?.showToast('Por favor, insira seu nome', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            window.TecBrasil?.showToast('Por favor, insira um e-mail válido', 'error');
            return;
        }
        
        if (!data.message || data.message.trim().length < 10) {
            window.TecBrasil?.showToast('Por favor, escreva uma mensagem mais detalhada', 'error');
            return;
        }
        
        // Simular envio
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Resetar form
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            window.TecBrasil?.showToast('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        }, 1500);
    });
}

/* =============================================
   URL Parameters Helper
   ============================================= */
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
}

function updateUrlParam(key, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url);
}

/* =============================================
   Export
   ============================================= */
window.TecBrasilFilters = {
    initFilters,
    initColumnToggle,
    initPagination,
    initStarRating,
    getUrlParams,
    updateUrlParam
};
