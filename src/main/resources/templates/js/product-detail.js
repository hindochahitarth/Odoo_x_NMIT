// EcoFinds Product Detail JavaScript
// Handles product detail page functionality

class ProductDetailManager {
    constructor() {
        this.product = null;
        this.productId = null;
        this.currentImageIndex = 0;
        this.productImages = [];
        this.init();
    }

    init() {
        this.getProductIdFromUrl();
        this.bindEvents();
        this.loadProduct();
        this.updateCartDisplay();
    }

    // Get product ID from URL parameters
    getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        this.productId = urlParams.get('id');
        console.log('Product ID from URL:', this.productId);
        
        if (!this.productId) {
            sharedUtils.showMessage('Product ID not found', 'error');
            setTimeout(() => {
                window.location.href = '/marketplace.html';
            }, 2000);
        }
    }

    bindEvents() {
        // Back button
        document.getElementById('backBtn').addEventListener('click', () => {
            sharedUtils.goBack();
        });

        // Add to cart button
        document.getElementById('addToCartBtn').addEventListener('click', () => {
            this.addToCart();
        });

        // Contact seller button
        document.getElementById('contactSellerBtn').addEventListener('click', () => {
            this.contactSeller();
        });

        // Image navigation buttons
        document.getElementById('prevImageBtn').addEventListener('click', () => {
            this.previousImage();
        });

        document.getElementById('nextImageBtn').addEventListener('click', () => {
            this.nextImage();
        });
    }

    // Load product details from API
    async loadProduct() {
        if (!this.productId) return;

        sharedUtils.showLoading(true);

        try {
            const response = await sharedUtils.makeApiCall(`/api/products/${this.productId}`);
            console.log('Product API response:', response);
            
            if (response.success) {
                this.product = response.product;
                this.renderProduct();
            } else {
                sharedUtils.showMessage(response.message || 'Product not found', 'error');
                setTimeout(() => {
                    window.location.href = '/marketplace.html';
                }, 2000);
            }
        } catch (error) {
            console.error('Error loading product:', error);
            sharedUtils.showMessage('Failed to load product details', 'error');
            setTimeout(() => {
                window.location.href = '/marketplace.html';
            }, 2000);
        } finally {
            sharedUtils.showLoading(false);
        }
    }

    // Render product details
    renderProduct() {
        console.log('Rendering product:', this.product);
        if (!this.product) {
            console.log('No product data to render');
            return;
        }

        // Update page title
        document.title = `${this.product.title} - EcoFinds`;

        // Update status badge
        this.updateStatusBadge();

        // Update basic info
        document.getElementById('productTitle').textContent = this.product.title;
        document.getElementById('productPrice').textContent = sharedUtils.formatPrice(this.product.price);
        document.getElementById('productCategory').textContent = this.product.category;
        document.getElementById('productQuantity').textContent = this.product.quantity;
        document.getElementById('productCondition').textContent = this.product.conditionType || 'Not specified';
        document.getElementById('productDescription').textContent = this.product.description || 'No description provided.';

        // Update seller info
        this.updateSellerInfo();

        // Update images
        this.updateImages();

        // Update product details
        this.updateProductDetails();

        // Update action buttons
        this.updateActionButtons();
    }

    // Update status badge
    updateStatusBadge() {
        const statusBadge = document.getElementById('statusBadge');
        let status, statusClass;

        if (this.product.isSold) {
            status = 'Sold';
            statusClass = 'status-sold';
        } else if (!this.product.isActive) {
            status = 'Inactive';
            statusClass = 'status-inactive';
        } else {
            status = 'Available';
            statusClass = 'status-active';
        }

        statusBadge.textContent = status;
        statusBadge.className = `status-badge ${statusClass}`;
    }

    // Update seller information
    updateSellerInfo() {
        const sellerName = document.getElementById('sellerName');
        const sellerAvatar = document.getElementById('sellerAvatar');

        if (this.product.seller) {
            sellerName.textContent = this.product.seller.displayName;
            
            // Update avatar if seller has profile image
            if (this.product.seller.profileImageUrl) {
                sellerAvatar.innerHTML = `<img src="${this.product.seller.profileImageUrl}" alt="${this.product.seller.displayName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            }
        }
    }

    // Update product images
    updateImages() {
        const mainImageContainer = document.getElementById('mainImageContainer');
        const imageThumbnails = document.getElementById('imageThumbnails');
        const imageNavigation = document.getElementById('imageNavigation');

        // Prepare images array (for now, just one image, but structure supports multiple)
        this.productImages = [];
        if (this.product.imageUrl) {
            this.productImages.push(this.product.imageUrl);
        }

        if (this.productImages.length === 0) {
            // No image placeholder
            mainImageContainer.innerHTML = `
                <div class="main-image">
                    <div class="image-placeholder">
                        <i class="fas fa-image"></i>
                        <span>No image available</span>
                    </div>
                </div>
            `;
            imageThumbnails.innerHTML = '';
            imageNavigation.style.display = 'none';
        } else {
            // Show main image
            this.showImage(0);
            
            // Create thumbnails
            imageThumbnails.innerHTML = this.productImages.map((imageUrl, index) => `
                <img src="${imageUrl}" alt="${this.product.title}" class="thumbnail ${index === 0 ? 'active' : ''}" 
                     data-index="${index}" onclick="window.productDetailManager.showImage(${index})">
            `).join('');

            // Show/hide navigation based on number of images
            if (this.productImages.length > 1) {
                imageNavigation.style.display = 'flex';
                this.updateNavigationButtons();
            } else {
                imageNavigation.style.display = 'none';
            }
        }
    }

    // Show specific image
    showImage(index) {
        if (index < 0 || index >= this.productImages.length) return;

        this.currentImageIndex = index;
        const mainImageContainer = document.getElementById('mainImageContainer');
        const imageUrl = this.productImages[index];

        mainImageContainer.innerHTML = `<img src="${imageUrl}" alt="${this.product.title}" class="main-image">`;

        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        this.updateNavigationButtons();
    }

    // Previous image
    previousImage() {
        const newIndex = this.currentImageIndex > 0 ? this.currentImageIndex - 1 : this.productImages.length - 1;
        this.showImage(newIndex);
    }

    // Next image
    nextImage() {
        const newIndex = this.currentImageIndex < this.productImages.length - 1 ? this.currentImageIndex + 1 : 0;
        this.showImage(newIndex);
    }

    // Update navigation button states
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevImageBtn');
        const nextBtn = document.getElementById('nextImageBtn');

        // For circular navigation, buttons are always enabled when there are multiple images
        if (this.productImages.length > 1) {
            prevBtn.disabled = false;
            nextBtn.disabled = false;
        } else {
            prevBtn.disabled = true;
            nextBtn.disabled = true;
        }
    }

    // Update product details section
    updateProductDetails() {
        const detailsGrid = document.getElementById('detailsGrid');
        
        const details = [
            { label: 'Brand', value: this.product.brand || 'Not specified' },
            { label: 'Model', value: this.product.model || 'Not specified' },
            { label: 'Year Manufactured', value: this.product.yearManufactured || 'Not specified' },
            { label: 'Dimensions', value: this.product.dimensions || 'Not specified' },
            { label: 'Weight', value: this.product.weight ? `${this.product.weight} lbs` : 'Not specified' },
            { label: 'Material', value: this.product.material || 'Not specified' },
            { label: 'Color', value: this.product.color || 'Not specified' },
            { label: 'Original Packaging', value: this.product.originalPackaging ? 'Yes' : 'No' },
            { label: 'Manual Included', value: this.product.manualIncluded ? 'Yes' : 'No' }
        ];

        // Add working condition if available
        if (this.product.workingCondition) {
            details.push({ label: 'Working Condition', value: this.product.workingCondition });
        }

        detailsGrid.innerHTML = details.map(detail => `
            <div class="detail-item">
                <span class="detail-label">${detail.label}</span>
                <span class="detail-value">${this.escapeHtml(detail.value)}</span>
            </div>
        `).join('');
    }

    // Update action buttons based on product status
    updateActionButtons() {
        const addToCartBtn = document.getElementById('addToCartBtn');
        const contactSellerBtn = document.getElementById('contactSellerBtn');

        if (this.product.isSold) {
            addToCartBtn.innerHTML = '<i class="fas fa-times"></i> Sold Out';
            addToCartBtn.disabled = true;
            addToCartBtn.classList.add('btn-secondary');
            addToCartBtn.classList.remove('btn-primary');
        } else if (!this.product.isActive) {
            addToCartBtn.innerHTML = '<i class="fas fa-times"></i> Not Available';
            addToCartBtn.disabled = true;
            addToCartBtn.classList.add('btn-secondary');
            addToCartBtn.classList.remove('btn-primary');
        } else {
            addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            addToCartBtn.disabled = false;
            addToCartBtn.classList.add('btn-primary');
            addToCartBtn.classList.remove('btn-secondary');
        }
    }

    // Add product to cart
    addToCart() {
        if (!this.product || this.product.isSold || !this.product.isActive) {
            sharedUtils.showMessage('This product is not available for purchase', 'warning');
            return;
        }

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
        this.addToCartAsync();
    }

    // Add to cart using database API
    async addToCartAsync() {
        try {
            const response = await sharedUtils.makeApiCall(
                `/api/cart/add?userId=${sharedUtils.userData.id}&productId=${this.product.id}&quantity=1`,
                null,
                'POST'
            );
            
            if (response.success) {
                this.updateCartDisplay();
                sharedUtils.showMessage(`${this.product.title} added to cart`, 'success');
            } else {
                sharedUtils.showMessage('Failed to add item to cart', 'error');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            sharedUtils.showMessage('Failed to add item to cart', 'error');
        }
    }

    // Contact seller
    contactSeller() {
        if (!this.product || !this.product.seller) {
            sharedUtils.showMessage('Seller information not available', 'error');
            return;
        }

        // Check if user is logged in
        if (!sharedUtils.userData) {
            sharedUtils.showMessage('Please login to contact seller', 'warning');
            setTimeout(() => {
                window.location.href = '/auth.html';
            }, 2000);
            return;
        }

        // For now, just show a message
        sharedUtils.showMessage(`Contact feature coming soon! You can reach ${this.product.seller.displayName} at ${this.product.seller.email}`, 'info');
    }

    // Update cart display
    async updateCartDisplay() {
        if (sharedUtils.isAuthenticated()) {
            try {
                const response = await sharedUtils.makeApiCall(`/api/cart/count/${sharedUtils.userData.id}`);
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
}

// Initialize product detail manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productDetailManager = new ProductDetailManager();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProductDetailManager };
}
