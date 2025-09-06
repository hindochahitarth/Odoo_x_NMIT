// EcoFinds Marketplace JavaScript
// Handles product browsing, search, and filtering

class MarketplaceManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentCategory = 'all';
        this.searchKeyword = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProducts();
        this.updateCartDisplay();
    }

    bindEvents() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', sharedUtils.debounce((e) => {
            this.searchKeyword = e.target.value.trim();
            this.filterProducts();
        }, 300));

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveFilter(e.target);
                this.currentCategory = e.target.dataset.category;
                this.filterProducts();
            });
        });

        // Add product button
        document.getElementById('addProductBtn').addEventListener('click', () => {
            this.navigateToAddProduct();
        });

        // Floating cart button
        document.getElementById('viewCartBtn').addEventListener('click', () => {
            window.location.href = '/cart.html';
        });

        // User menu icon
        document.getElementById('userMenuIcon').addEventListener('click', () => {
            this.navigateToDashboard();
        });
    }

    // Load products from API
    async loadProducts() {
        this.showLoading(true);
        
        try {
            const response = await sharedUtils.makeApiCall('/api/products');
            this.products = response;
            this.filteredProducts = [...this.products];
            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            sharedUtils.showMessage('Failed to load products. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Filter products based on search and category
    filterProducts() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            const categoryMatch = this.currentCategory === 'all' || product.category === this.currentCategory;
            
            // Search filter
            const searchMatch = !this.searchKeyword || 
                product.title.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(this.searchKeyword.toLowerCase())) ||
                (product.brand && product.brand.toLowerCase().includes(this.searchKeyword.toLowerCase()));
            
            return categoryMatch && searchMatch;
        });

        this.renderProducts();
    }

    // Set active filter button
    setActiveFilter(activeBtn) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    // Render products to the grid
    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const emptyState = document.getElementById('emptyState');
        const loadingState = document.getElementById('loadingState');

        // Hide loading state
        loadingState.classList.add('hidden');

        if (this.filteredProducts.length === 0) {
            productsGrid.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        // Hide empty state
        emptyState.classList.add('hidden');

        // Render products
        productsGrid.innerHTML = this.filteredProducts.map(product => this.createProductCard(product)).join('');
        this.addProductCardHandlers();
    }

    // Create product card HTML
    createProductCard(product) {
        const imageUrl = product.imageUrl || '';
        const imageHtml = imageUrl ? 
            `<img src="${imageUrl}" alt="${product.title}" class="product-image">` :
            `<div class="product-image"><i class="fas fa-image"></i></div>`;

        return `
            <div class="product-card" data-product-id="${product.id}">
                ${imageHtml}
                <div class="product-info">
                    <h3 class="product-title">${this.escapeHtml(product.title)}</h3>
                    <div class="product-price">${sharedUtils.formatPrice(product.price)}</div>
                    <div class="product-category">${this.escapeHtml(product.category)}</div>
                    <div class="product-seller">by ${this.escapeHtml(product.seller.displayName)}</div>
                </div>
            </div>
        `;
    }

    // Add click handlers to product cards
    addProductCardHandlers() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const productId = card.dataset.productId;
                this.navigateToProductDetail(productId);
            });
        });
    }

    // Navigate to product detail page
    navigateToProductDetail(productId) {
        window.location.href = `/product-detail.html?id=${productId}`;
    }

    // Navigate to add product page
    navigateToAddProduct() {
        sharedUtils.refreshUserData();
        if (!sharedUtils.isAuthenticated()) {
            sharedUtils.showMessage('Please login to add a product', 'warning');
            window.location.href = '/auth.html';
            return;
        }
        window.location.href = '/add-product.html';
    }

    // Navigate to dashboard
    navigateToDashboard() {
        sharedUtils.refreshUserData();
        if (!sharedUtils.isAuthenticated()) {
            window.location.href = '/auth.html';
            return;
        }
        window.location.href = '/dashboard.html';
    }

    // Add to cart functionality
    addToCart(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) return;

        // Check if user is logged in
        sharedUtils.refreshUserData();
        if (!sharedUtils.isAuthenticated()) {
            sharedUtils.showMessage('Please login to add items to cart', 'warning');
            setTimeout(() => {
                window.location.href = '/auth.html';
            }, 2000);
            return;
        }

        // Add to cart using database API
        this.addToCartAsync(productId);
    }

    // Add to cart using database API
    async addToCartAsync(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) return;

        try {
            const response = await sharedUtils.makeApiCall(
                `/api/cart/add?userId=${sharedUtils.userData.id}&productId=${productId}&quantity=1`,
                null,
                'POST'
            );
            
            if (response.success) {
                this.updateCartDisplay();
                sharedUtils.showMessage(`${product.title} added to cart`, 'success');
            } else {
                sharedUtils.showMessage('Failed to add item to cart', 'error');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            sharedUtils.showMessage('Failed to add item to cart', 'error');
        }
    }

    // Cart management - now handled by database


    async updateCartDisplay() {
        sharedUtils.refreshUserData();
        if (sharedUtils.isAuthenticated()) {
            try {
                const response = await sharedUtils.makeApiCall(`/api/cart/count/${sharedUtils.userData.id}`);
                if (response.success) {
                    const cartCount = response.count;
                    document.getElementById('cartCount').textContent = cartCount;
                    document.getElementById('floatingCartCount').textContent = cartCount;
                }
            } catch (error) {
                console.error('Error updating cart count:', error);
                document.getElementById('cartCount').textContent = '0';
                document.getElementById('floatingCartCount').textContent = '0';
            }
        } else {
            document.getElementById('cartCount').textContent = '0';
            document.getElementById('floatingCartCount').textContent = '0';
        }
    }

    // Utility methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading(show) {
        const loadingState = document.getElementById('loadingState');
        if (show) {
            loadingState.classList.remove('hidden');
        } else {
            loadingState.classList.add('hidden');
        }
    }
}

// Initialize marketplace when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MarketplaceManager();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MarketplaceManager };
}
