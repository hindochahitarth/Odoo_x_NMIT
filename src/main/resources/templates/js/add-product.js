// EcoFinds Add Product JavaScript
// Handles product creation form

class AddProductManager {
    constructor() {
        this.categories = [];
        this.conditionTypes = [];
        this.imageFile = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.bindEvents();
        this.loadCategories();
        this.loadConditionTypes();
    }

    // Check if user is authenticated
    checkAuth() {
        // Refresh user data from localStorage
        sharedUtils.refreshUserData();
        
        if (!sharedUtils.isAuthenticated()) {
            sharedUtils.showMessage('Please login to add a product', 'warning');
            setTimeout(() => {
                window.location.href = '/auth.html';
            }, 2000);
            return;
        }
    }

    bindEvents() {
        // Back button
        document.getElementById('backBtn').addEventListener('click', () => {
            sharedUtils.goBack();
        });

        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            if (this.hasUnsavedChanges()) {
                this.confirmCancel();
            } else {
                sharedUtils.goBack();
            }
        });

        // Form submission
        document.getElementById('productForm').addEventListener('submit', (e) => {
            this.handleSubmit(e);
        });

        // Image upload
        const imageUploadSection = document.getElementById('imageUploadSection');
        const imageInput = document.getElementById('imageInput');

        imageUploadSection.addEventListener('click', () => {
            imageInput.click();
        });

        imageInput.addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        // Drag and drop
        imageUploadSection.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUploadSection.classList.add('dragover');
        });

        imageUploadSection.addEventListener('dragleave', () => {
            imageUploadSection.classList.remove('dragover');
        });

        imageUploadSection.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUploadSection.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleImageFile(files[0]);
            }
        });

        // Real-time validation
        this.setupRealTimeValidation();
    }

    // Load categories from API
    async loadCategories() {
        try {
            const response = await sharedUtils.makeApiCall('/api/products/categories');
            this.categories = response;
            this.populateCategories();
        } catch (error) {
            console.error('Error loading categories:', error);
            sharedUtils.showMessage('Failed to load categories', 'error');
        }
    }

    // Load condition types from API
    async loadConditionTypes() {
        try {
            const response = await sharedUtils.makeApiCall('/api/products/conditions');
            this.conditionTypes = response;
            this.populateConditionTypes();
        } catch (error) {
            console.error('Error loading condition types:', error);
            sharedUtils.showMessage('Failed to load condition types', 'error');
        }
    }

    // Populate category dropdown
    populateCategories() {
        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = '<option value="">Select a category</option>';
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Populate condition types dropdown
    populateConditionTypes() {
        const conditionSelect = document.getElementById('conditionType');
        conditionSelect.innerHTML = '<option value="">Select condition</option>';
        
        this.conditionTypes.forEach(condition => {
            const option = document.createElement('option');
            option.value = condition;
            option.textContent = condition;
            conditionSelect.appendChild(option);
        });
    }

    // Setup real-time validation
    setupRealTimeValidation() {
        const fields = [
            { id: 'title', rules: { required: true, maxLength: 100 } },
            { id: 'description', rules: { maxLength: 500 } },
            { id: 'category', rules: { required: true } },
            { id: 'price', rules: { required: true, price: true } },
            { id: 'quantity', rules: { required: true, custom: (value) => parseInt(value) > 0 || 'Quantity must be greater than 0' } }
        ];

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            element.addEventListener('blur', () => {
                this.validateField(element, field.rules);
            });
        });
    }

    // Validate individual field
    validateField(field, rules) {
        const result = sharedUtils.validateField(field, rules);
        
        if (result.isValid) {
            sharedUtils.clearFieldError(field);
        } else {
            sharedUtils.showFieldError(field, result.errorMessage);
        }
        
        return result.isValid;
    }

    // Handle image upload
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.handleImageFile(file);
        }
    }

    // Handle image file
    async handleImageFile(file) {
        const validation = sharedUtils.validateImageFile(file);
        if (!validation.isValid) {
            sharedUtils.showMessage(validation.message, 'error');
            return;
        }

        try {
            this.imageFile = file;
            const base64String = await sharedUtils.convertFileToBase64(file);
            this.updateImagePreview(base64String);
        } catch (error) {
            console.error('Error processing image:', error);
            sharedUtils.showMessage('Error processing image', 'error');
        }
    }

    // Update image preview
    updateImagePreview(imageUrl) {
        const preview = document.getElementById('imagePreview');
        const placeholder = document.getElementById('uploadPlaceholder');
        
        preview.src = imageUrl;
        preview.classList.add('show');
        placeholder.style.display = 'none';
    }

    // Handle form submission
    async handleSubmit(event) {
        event.preventDefault();
        
        // Validate all fields
        const isValid = this.validateForm();
        if (!isValid) {
            sharedUtils.showMessage('Please fix the errors before submitting', 'error');
            return;
        }

        // Prepare form data
        const formData = this.getFormData();
        
        // Show loading
        sharedUtils.setButtonLoading(document.getElementById('submitBtn'), true);
        sharedUtils.showLoading(true);

        try {
            // Convert image to base64 if uploaded
            if (this.imageFile) {
                formData.imageUrl = await sharedUtils.convertFileToBase64(this.imageFile);
            }

            // Submit to API
            const response = await sharedUtils.makeApiCall(`/api/products?sellerId=${sharedUtils.userData.id}`, formData, 'POST');

            if (response.success) {
                sharedUtils.showMessage('Product added successfully!', 'success');
                setTimeout(() => {
                    window.location.href = '/my-listings.html';
                }, 1500);
            } else {
                sharedUtils.showMessage(response.message || 'Failed to add product', 'error');
            }
        } catch (error) {
            console.error('Error submitting product:', error);
            sharedUtils.showMessage('Failed to add product. Please try again.', 'error');
        } finally {
            sharedUtils.setButtonLoading(document.getElementById('submitBtn'), false);
            sharedUtils.showLoading(false);
        }
    }

    // Validate entire form
    validateForm() {
        const fields = [
            { id: 'title', rules: { required: true, maxLength: 100 } },
            { id: 'category', rules: { required: true } },
            { id: 'price', rules: { required: true, price: true } },
            { id: 'quantity', rules: { required: true, custom: (value) => parseInt(value) > 0 || 'Quantity must be greater than 0' } }
        ];

        let isValid = true;
        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!this.validateField(element, field.rules)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Get form data
    getFormData() {
        const form = document.getElementById('productForm');
        const formData = new FormData(form);
        
        return {
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            quantity: parseInt(formData.get('quantity')),
            conditionType: formData.get('conditionType'),
            brand: formData.get('brand'),
            model: formData.get('model'),
            yearManufactured: formData.get('yearManufactured') ? parseInt(formData.get('yearManufactured')) : null,
            dimensions: formData.get('dimensions'),
            weight: formData.get('weight') ? parseFloat(formData.get('weight')) : null,
            material: formData.get('material'),
            color: formData.get('color'),
            originalPackaging: formData.has('originalPackaging'),
            manualIncluded: formData.has('manualIncluded'),
            workingCondition: formData.get('workingCondition')
        };
    }

    // Check for unsaved changes
    hasUnsavedChanges() {
        const form = document.getElementById('productForm');
        const formData = new FormData(form);
        
        // Check if any field has a value
        for (let [key, value] of formData.entries()) {
            if (value && value.trim() !== '') {
                return true;
            }
        }
        
        return this.imageFile !== null;
    }

    // Confirm cancel action
    async confirmCancel() {
        const confirmed = await sharedUtils.confirmAction(
            'You have unsaved changes. Are you sure you want to leave?',
            'Unsaved Changes'
        );
        
        if (confirmed) {
            sharedUtils.goBack();
        }
    }
}

// Initialize add product manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AddProductManager();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AddProductManager };
}
