// EcoFinds Purchases JavaScript
// Handles purchase history functionality

class PurchasesManager {
    constructor() {
        this.purchases = [];
        this.filteredPurchases = [];
        this.currentStatus = 'all';
        this.userId = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.bindEvents();
        this.loadPurchases();
        this.updateCartDisplay();
    }

    // Check if user is authenticated
    checkAuth() {
        sharedUtils.refreshUserData();
        if (!sharedUtils.isAuthenticated()) {
            sharedUtils.showMessage('Please login to view your purchases', 'warning');
            setTimeout(() => {
                window.location.href = '/auth.html';
            }, 2000);
            return;
        }
        this.userId = sharedUtils.userData.id;
    }

    bindEvents() {
        // Filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.setActiveTab(e.target);
                this.currentStatus = e.target.dataset.status;
                this.filterPurchases();
            });
        });
    }

    // Load purchases from database
    async loadPurchases() {
        this.showLoading(true);
        
        try {
            const response = await sharedUtils.makeApiCall(`/api/purchases/history/${this.userId}`);
            if (response.success) {
                this.purchases = response.purchases || [];
                this.filterPurchases();
            } else {
                sharedUtils.showMessage('Failed to load purchase history', 'error');
            }
        } catch (error) {
            console.error('Error loading purchases:', error);
            sharedUtils.showMessage('Failed to load your purchases. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }


    // Filter purchases based on status
    filterPurchases() {
        this.filteredPurchases = this.purchases.filter(purchase => {
            if (this.currentStatus === 'all') return true;
            return purchase.status === this.currentStatus;
        });

        this.renderPurchases();
    }

    // Set active filter tab
    setActiveTab(activeTab) {
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
    }

    // Render purchases
    renderPurchases() {
        const purchasesContent = document.getElementById('purchasesContent');
        const emptyState = document.getElementById('emptyState');
        const loadingState = document.getElementById('loadingState');

        // Hide loading state
        loadingState.classList.add('hidden');

        if (this.filteredPurchases.length === 0) {
            purchasesContent.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        // Hide empty state
        emptyState.classList.add('hidden');

        // Render purchases
        purchasesContent.innerHTML = this.filteredPurchases.map(purchase => this.createPurchaseHTML(purchase)).join('');
        
        // Add event listeners
        this.addPurchaseHandlers();
    }

    // Create purchase HTML
    createPurchaseHTML(purchase) {
        const statusClass = `status-${purchase.status}`;
        const statusText = purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1);
        const purchaseDate = new Date(purchase.purchaseDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="purchase-group" data-purchase-id="${purchase.id}">
                <div class="purchase-header">
                    <div class="purchase-info">
                        <div class="purchase-date">Order #${purchase.orderNumber} • ${purchaseDate}</div>
                        <div class="purchase-total">${sharedUtils.formatPrice(purchase.total)}</div>
                    </div>
                    <div class="purchase-status ${statusClass}">${statusText}</div>
                </div>
                <div class="purchase-items">
                    ${purchase.items.map(item => this.createPurchaseItemHTML(item)).join('')}
                </div>
            </div>
        `;
    }

    // Create purchase item HTML
    createPurchaseItemHTML(item) {
        const imageHtml = item.imageUrl ? 
            `<img src="${item.imageUrl}" alt="${item.title}" class="item-image">` :
            `<div class="item-image"><i class="fas fa-image"></i></div>`;

        return `
            <div class="purchase-item" data-item-id="${item.id}">
                ${imageHtml}
                <div class="item-details">
                    <h3 class="item-title">${this.escapeHtml(item.title)}</h3>
                    <div class="item-category">${this.escapeHtml(item.category)}</div>
                    <div class="item-seller">Sold by ${this.escapeHtml(item.seller.displayName)}</div>
                    <div class="item-actions">
                        <a href="/product-detail.html?id=${item.id}" class="action-btn">
                            <i class="fas fa-eye"></i>
                            View Details
                        </a>
                        <button class="action-btn" data-action="reorder" data-item-id="${item.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Reorder
                        </button>
                    </div>
                </div>
                <div class="item-price">${sharedUtils.formatPrice(item.price)}</div>
            </div>
        `;
    }

    // Add event handlers to purchases
    addPurchaseHandlers() {
        // Reorder buttons
        document.querySelectorAll('[data-action="reorder"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('[data-item-id]').dataset.itemId;
                this.reorderItem(itemId);
            });
        });
    }

    // Reorder item (add to cart)
    async reorderItem(itemId) {
        const purchase = this.purchases.find(p => p.items.some(item => item.id == itemId));
        if (!purchase) return;

        const item = purchase.items.find(item => item.id == itemId);
        if (!item) return;

        // Check if user is authenticated
        if (!sharedUtils.isAuthenticated()) {
            sharedUtils.showMessage('Please login to add items to cart', 'warning');
            return;
        }

        try {
            const response = await sharedUtils.makeApiCall(
                `/api/cart/add?userId=${this.userId}&productId=${item.id}&quantity=1`,
                null,
                'POST'
            );
            
            if (response.success) {
                sharedUtils.showMessage('Item added to cart!', 'success');
                this.updateCartDisplay();
            } else {
                sharedUtils.showMessage('Failed to add item to cart', 'error');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            sharedUtils.showMessage('Failed to add item to cart', 'error');
        }
    }

    // Update cart display
    async updateCartDisplay() {
        if (sharedUtils.isAuthenticated()) {
            try {
                const response = await sharedUtils.makeApiCall(`/api/cart/count/${this.userId}`);
                if (response.success) {
                    const cartCount = response.count;
                    document.getElementById('cartCount').textContent = cartCount;
                }
            } catch (error) {
                console.error('Error updating cart count:', error);
            }
        } else {
            document.getElementById('cartCount').textContent = '0';
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

// Initialize purchases manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PurchasesManager();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PurchasesManager };
}
