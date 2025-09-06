// EcoFinds Shared JavaScript Utilities
// Common functions used across all pages

class SharedUtils {
    constructor() {
        this.apiBaseUrl = '/api';
        this.userData = this.getStoredUserData();
        this.initializeUserData();
    }

    // Initialize user data on page load
    initializeUserData() {
        if (this.userData) {
            console.log('User data loaded:', this.userData);
        } else {
            console.log('No user data found');
        }
    }

    // User Data Management
    getStoredUserData() {
        try {
            const stored = localStorage.getItem('userData');
            console.log('Raw localStorage userData:', stored);
            const parsed = stored ? JSON.parse(stored) : null;
            console.log('Parsed userData:', parsed);
            return parsed;
        } catch (e) {
            console.error('Error parsing stored user data:', e);
            return null;
        }
    }

    // Refresh user data from localStorage
    refreshUserData() {
        this.userData = this.getStoredUserData();
        console.log('Refreshed userData:', this.userData);
        return this.userData;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.userData && this.userData.id;
    }

    // Get user ID
    getUserId() {
        return this.userData ? this.userData.id : null;
    }

    // Logout user
    logout() {
        this.clearStoredUserData();
        window.location.href = '/auth.html';
    }

    setStoredUserData(userData) {
        try {
            localStorage.setItem('userData', JSON.stringify(userData));
            this.userData = userData;
        } catch (e) {
            console.error('Error storing user data:', e);
        }
    }

    clearStoredUserData() {
        localStorage.removeItem('userData');
        this.userData = null;
    }

    // API Helper Methods
    async makeApiCall(url, data = null, method = 'GET') {
        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            if (data && method !== 'GET') {
                options.body = JSON.stringify(data);
                console.log('Request body:', options.body);
            }

            // Check if URL already starts with /api, if not, prepend it
            const fullUrl = url.startsWith('/api') ? url : this.apiBaseUrl + url;
            console.log('Making API call to:', fullUrl);
            console.log('Request options:', options);
            
            const response = await fetch(fullUrl, options);
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            const result = await response.json();
            console.log('Response body:', result);
            
            if (!response.ok) {
                console.error('API call failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    result: result
                });
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }
            
            return result;
        } catch (error) {
            console.error('API Error:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            throw error;
        }
    }

    // Validation Methods
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    isValidPrice(price) {
        return !isNaN(price) && parseFloat(price) > 0;
    }

    // Form Validation
    validateField(field, rules = {}) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        }

        // Length validation
        if (isValid && value && rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} must be at least ${rules.minLength} characters`;
        }

        if (isValid && value && rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} must not exceed ${rules.maxLength} characters`;
        }

        // Email validation
        if (isValid && value && rules.email && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        // URL validation
        if (isValid && value && rules.url && !this.isValidUrl(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid URL';
        }

        // Price validation
        if (isValid && value && rules.price && !this.isValidPrice(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid price';
        }

        // Custom validation
        if (isValid && value && rules.custom) {
            const customResult = rules.custom(value);
            if (customResult !== true) {
                isValid = false;
                errorMessage = customResult || 'Invalid value';
            }
        }

        return { isValid, errorMessage };
    }

    getFieldLabel(fieldName) {
        const labels = {
            'title': 'Title',
            'description': 'Description',
            'category': 'Category',
            'price': 'Price',
            'quantity': 'Quantity',
            'email': 'Email',
            'displayName': 'Display Name',
            'profileImageUrl': 'Profile Image URL'
        };
        return labels[fieldName] || fieldName;
    }

    // Error Handling
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Create or update error message
        let errorElement = document.getElementById(field.id + 'Error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.id = field.id + 'Error';
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    // Message Display
    showMessage(message, type = 'info', duration = 5000) {
        const messageContainer = document.getElementById('messageContainer');
        if (!messageContainer) return;
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        // Add to container
        messageContainer.appendChild(messageElement);
        
        // Show with animation
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 100);
        
        // Auto remove after duration
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, duration);
    }

    // Loading States
    showLoading(show = true) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            if (show) {
                overlay.classList.add('show');
            } else {
                overlay.classList.remove('show');
            }
        }
    }

    setButtonLoading(button, loading = true) {
        if (loading) {
            button.disabled = true;
            button.classList.add('loading');
            const originalText = button.textContent;
            button.setAttribute('data-original-text', originalText);
            button.innerHTML = '<div class="loading-spinner"></div> Loading...';
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            const originalText = button.getAttribute('data-original-text');
            if (originalText) {
                button.textContent = originalText;
                button.removeAttribute('data-original-text');
            }
        }
    }

    // Image Handling
    async convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    validateImageFile(file, maxSizeMB = 5) {
        if (!file.type.startsWith('image/')) {
            return { isValid: false, message: 'Please select a valid image file' };
        }
        
        if (file.size > maxSizeMB * 1024 * 1024) {
            return { isValid: false, message: `Image size must be less than ${maxSizeMB}MB` };
        }
        
        return { isValid: true, message: '' };
    }

    // Navigation
    navigateTo(url) {
        window.location.href = url;
    }

    goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            this.navigateTo('/');
        }
    }

    // Confirmation Dialogs
    async confirmAction(message, title = 'Confirm Action') {
        return new Promise((resolve) => {
            const confirmed = window.confirm(`${title}\n\n${message}`);
            resolve(confirmed);
        });
    }

    // Formatting
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }

    // Debounce function for search
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Local Storage helpers
    setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error storing item:', e);
        }
    }

    getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error retrieving item:', e);
            return defaultValue;
        }
    }

    removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing item:', e);
        }
    }
}

// Create global instance
window.sharedUtils = new SharedUtils();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SharedUtils };
}
