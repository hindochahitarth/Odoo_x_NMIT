// EcoFinds Cart JavaScript
// Handles shopping cart functionality

class CartManager {
    constructor() {
        this.cart = [];
        this.userId = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.bindEvents();
        this.loadCartFromDatabase();
    }

    // Check if user is authenticated
    checkAuth() {
        sharedUtils.refreshUserData();
        if (!sharedUtils.isAuthenticated()) {
            sharedUtils.showMessage('Please login to view your cart', 'warning');
            setTimeout(() => {
                window.location.href = '/auth.html';
            }, 2000);
            return;
        }
        this.userId = sharedUtils.userData.id;
    }

    bindEvents() {
        // Clear cart button
        document.getElementById('clearCartBtn').addEventListener('click', () => {
            this.clearCart();
        });

        // Checkout button
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            this.proceedToCheckout();
        });
    }

    // Load cart from database
    async loadCartFromDatabase() {
        try {
            const response = await sharedUtils.makeApiCall(`/api/cart/items/${this.userId}`);
            if (response.success) {
                this.cart = response.cartItems || [];
                this.renderCart();
            } else {
                sharedUtils.showMessage('Failed to load cart items', 'error');
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            sharedUtils.showMessage('Failed to load cart items', 'error');
        }
    }

    // Update cart count in header
    updateCartCount() {
        const cartCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cartCount').textContent = cartCount;
    }

    // Render cart items
    renderCart() {
        const cartItems = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');

        if (this.cart.length === 0) {
            cartItems.innerHTML = '';
            emptyCart.classList.remove('hidden');
            this.updateSummary();
            return;
        }

        emptyCart.classList.add('hidden');
        cartItems.innerHTML = this.cart.map(item => this.createCartItemHTML(item)).join('');
        
        // Add event listeners to cart items
        this.addCartItemHandlers();
        this.updateSummary();
    }

    // Create cart item HTML
    createCartItemHTML(item) {
        // Map backend field names to frontend expected names
        const title = item.productTitle || item.title || 'Unknown Product';
        const price = item.productPrice || item.price || 0;
        const imageUrl = item.productImageUrl || item.imageUrl;
        const category = item.productCategory || item.category || 'General';
        const productId = item.productId || item.id;

        const imageHtml = imageUrl ? 
            `<img src="${imageUrl}" alt="${title}" class="item-image">` :
            `<div class="item-image"><i class="fas fa-image"></i></div>`;

        return `
            <div class="cart-item" data-product-id="${productId}" data-cart-item-id="${item.id}">
                ${imageHtml}
                <div class="item-details">
                    <h3 class="item-title">${this.escapeHtml(title)}</h3>
                    <div class="item-category">${this.escapeHtml(category)}</div>
                    <div class="item-price">${sharedUtils.formatPrice(price)}</div>
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-action="decrease" data-cart-item-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-cart-item-id="${item.id}">
                        <button class="quantity-btn" data-action="increase" data-cart-item-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-btn" data-action="remove" data-cart-item-id="${item.id}">
                        <i class="fas fa-trash"></i>
                        Remove
                    </button>
                </div>
            </div>
        `;
    }

    // Add event handlers to cart items
    addCartItemHandlers() {
        // Quantity buttons
        document.querySelectorAll('[data-action="decrease"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartItemId = e.target.closest('[data-cart-item-id]').dataset.cartItemId;
                this.updateQuantity(cartItemId, -1);
            });
        });

        document.querySelectorAll('[data-action="increase"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartItemId = e.target.closest('[data-cart-item-id]').dataset.cartItemId;
                this.updateQuantity(cartItemId, 1);
            });
        });

        // Quantity input
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const cartItemId = e.target.dataset.cartItemId;
                const newQuantity = parseInt(e.target.value);
                this.setQuantity(cartItemId, newQuantity);
            });
        });

        // Remove buttons
        document.querySelectorAll('[data-action="remove"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartItemId = e.target.closest('[data-cart-item-id]').dataset.cartItemId;
                this.removeItem(cartItemId);
            });
        });
    }

    // Update item quantity
    async updateQuantity(cartItemId, change) {
        const item = this.cart.find(item => item.id == cartItemId);
        if (!item) return;

        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
            this.removeItem(cartItemId);
        } else {
            await this.setQuantity(cartItemId, newQuantity);
        }
    }

    // Set item quantity
    async setQuantity(cartItemId, quantity) {
        try {
            const response = await sharedUtils.makeApiCall(
                `/api/cart/update/${cartItemId}?userId=${this.userId}&quantity=${quantity}`,
                null,
                'PUT'
            );
            
            if (response.success) {
                await this.loadCartFromDatabase();
                sharedUtils.showMessage('Quantity updated', 'success');
            } else {
                sharedUtils.showMessage('Failed to update quantity', 'error');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            sharedUtils.showMessage('Failed to update quantity', 'error');
        }
    }

    // Remove item from cart
    async removeItem(cartItemId) {
        try {
            const response = await sharedUtils.makeApiCall(
                `/api/cart/remove/${cartItemId}?userId=${this.userId}`,
                null,
                'DELETE'
            );
            
            if (response.success) {
                await this.loadCartFromDatabase();
                sharedUtils.showMessage('Item removed from cart', 'success');
            } else {
                sharedUtils.showMessage('Failed to remove item', 'error');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            sharedUtils.showMessage('Failed to remove item', 'error');
        }
    }

    // Clear entire cart
    async clearCart() {
        const confirmed = await sharedUtils.confirmAction(
            'Are you sure you want to clear your cart? This action cannot be undone.',
            'Clear Cart'
        );

        if (confirmed) {
            try {
                const response = await sharedUtils.makeApiCall(
                    `/api/cart/clear/${this.userId}`,
                    null,
                    'DELETE'
                );
                
                if (response.success) {
                    await this.loadCartFromDatabase();
                    sharedUtils.showMessage('Cart cleared', 'success');
                } else {
                    sharedUtils.showMessage('Failed to clear cart', 'error');
                }
            } catch (error) {
                console.error('Error clearing cart:', error);
                sharedUtils.showMessage('Failed to clear cart', 'error');
            }
        }
    }

    // Update cart summary
    updateSummary() {
        const itemCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        const subtotal = this.cart.reduce((total, item) => {
            const price = item.productPrice || item.price || 0;
            return total + (parseFloat(price) * item.quantity);
        }, 0);

        document.getElementById('itemCount').textContent = itemCount;
        document.getElementById('subtotal').textContent = sharedUtils.formatPrice(subtotal);
        document.getElementById('total').textContent = sharedUtils.formatPrice(subtotal);
    }

    // Proceed to checkout
    async proceedToCheckout() {
        if (this.cart.length === 0) {
            sharedUtils.showMessage('Your cart is empty', 'warning');
            return;
        }

        try {
            const response = await sharedUtils.makeApiCall(
                `/api/purchases/checkout/${this.userId}`,
                null,
                'POST'
            );
            
            if (response.success) {
                sharedUtils.showMessage('Purchase completed successfully!', 'success');
                // Redirect to purchases page
                setTimeout(() => {
                    window.location.href = '/purchases.html';
                }, 2000);
            } else {
                sharedUtils.showMessage(response.message || 'Checkout failed', 'error');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            sharedUtils.showMessage('Checkout failed. Please try again.', 'error');
        }
    }

    // Add item to cart (called from other pages)
    async addToCart(product) {
        if (!this.userId) {
            sharedUtils.showMessage('Please login to add items to cart', 'warning');
            return;
        }

        try {
            const response = await sharedUtils.makeApiCall(
                `/api/cart/add?userId=${this.userId}&productId=${product.id}&quantity=1`,
                null,
                'POST'
            );
            
            if (response.success) {
                await this.loadCartFromDatabase();
                sharedUtils.showMessage('Product added to cart!', 'success');
            } else {
                sharedUtils.showMessage('Failed to add item to cart', 'error');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            sharedUtils.showMessage('Failed to add item to cart', 'error');
        }
    }

    // Utility methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CartManager();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CartManager };
}
