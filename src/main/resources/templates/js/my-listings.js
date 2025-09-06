// EcoFinds My Listings JavaScript
// Handles user's product listings management

class MyListingsManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentStatus = 'all';
        this.searchKeyword = '';
        this.init();
    }

    init() {
        this.checkAuth();
        this.bindEvents();
        this.loadUserProducts();
    }

    // Check if user is authenticated
    checkAuth() {
        if (!sharedUtils.userData) {
            sharedUtils.showMessage('Please login to view your listings', 'warning');
            setTimeout(() => {
                window.location.href = '/auth.html';
            }, 2000);
            return;
        }
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
                this.currentStatus = e.target.dataset.status;
                this.filterProducts();
            });
        });
    }

    // Load user's products from API
    async loadUserProducts() {
        this.showLoading(true);
        
        try {
            const response = await sharedUtils.makeApiCall(`/products/user/${sharedUtils.userData.id}`);
            this.products = response;
            this.filteredProducts = [...this.products];
            this.renderProducts();
        } catch (error) {
            console.error('Error loading user products:', error);
            sharedUtils.showMessage('Failed to load your listings. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Filter products based on search and status
    filterProducts() {
        this.filteredProducts = this.products.filter(product => {
            // Status filter
            let statusMatch = true;
            if (this.currentStatus === 'active') {
                statusMatch = product.isActive && !product.isSold;
            } else if (this.currentStatus === 'inactive') {
                statusMatch = !product.isActive;
            } else if (this.currentStatus === 'sold') {
                statusMatch = product.isSold;
            }
            
            // Search filter
            const searchMatch = !this.searchKeyword || 
                product.title.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(this.searchKeyword.toLowerCase())) ||
                (product.brand && product.brand.toLowerCase().includes(this.searchKeyword.toLowerCase()));
            
            return statusMatch && searchMatch;
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
        
        // Add event listeners to product cards
        this.addProductCardHandlers();
    }

    // Create product card HTML
    createProductCard(product) {
        const imageUrl = product.imageUrl || '';
        const imageHtml = imageUrl ? 
            `<img src="${imageUrl}" alt="${product.title}" class="product-image">` :
            `<div class="product-image"><i class="fas fa-image"></i></div>`;

        const status = this.getProductStatus(product);
        const statusClass = this.getStatusClass(status);

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-status ${statusClass}">${status}</div>
                <div class="product-actions">
                    <button class="action-btn edit-btn" data-action="edit" data-product-id="${product.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-action="delete" data-product-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
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

    // Get product status
    getProductStatus(product) {
        if (product.isSold) return 'Sold';
        if (!product.isActive) return 'Inactive';
        return 'Active';
    }

    // Get status CSS class
    getStatusClass(status) {
        switch (status) {
            case 'Active': return 'status-active';
            case 'Inactive': return 'status-inactive';
            case 'Sold': return 'status-sold';
            default: return 'status-inactive';
        }
    }

    // Add click handlers to product cards
    addProductCardHandlers() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            // Main card click (view details)
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on action buttons
                if (e.target.closest('.product-actions')) return;
                
                const productId = card.dataset.productId;
                this.viewProductDetails(productId);
            });

            // Action buttons
            const editBtn = card.querySelector('[data-action="edit"]');
            const deleteBtn = card.querySelector('[data-action="delete"]');

            if (editBtn) {
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const productId = editBtn.dataset.productId;
                    this.editProduct(productId);
                });
            }

            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const productId = deleteBtn.dataset.productId;
                    this.deleteProduct(productId);
                });
            }
        });
    }

    // View product details
    viewProductDetails(productId) {
        window.location.href = `/product-detail.html?id=${productId}`;
    }

    // Edit product
    editProduct(productId) {
        window.location.href = `/edit-product.html?id=${productId}`;
    }

    // Delete product
    async deleteProduct(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) return;

        const confirmed = await sharedUtils.confirmAction(
            `Are you sure you want to delete "${product.title}"? This action cannot be undone.`,
            'Delete Product'
        );

        if (!confirmed) return;

        sharedUtils.showLoading(true);

        try {
            const response = await sharedUtils.makeApiCall(`/products/${productId}?sellerId=${sharedUtils.userData.id}`, null, 'DELETE');
            
            if (response.success) {
                sharedUtils.showMessage('Product deleted successfully', 'success');
                // Remove from local array
                this.products = this.products.filter(p => p.id != productId);
                this.filterProducts();
            } else {
                sharedUtils.showMessage(response.message || 'Failed to delete product', 'error');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            sharedUtils.showMessage('Failed to delete product. Please try again.', 'error');
        } finally {
            sharedUtils.showLoading(false);
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

// Initialize my listings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MyListingsManager();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MyListingsManager };
}
