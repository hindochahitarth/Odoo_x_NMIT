// EcoFinds Dashboard JavaScript
// Handles user profile management and dashboard functionality

class DashboardManager {
    constructor() {
        this.userId = null;
        this.userData = null;
        this.isEditing = false;
        this.originalData = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadUserData();
    }

    bindEvents() {
        // Image upload events
        document.getElementById('editImageBtn').addEventListener('click', () => this.triggerImageUpload());
        document.getElementById('imageInput').addEventListener('change', (e) => this.handleImageUpload(e));

        // Field editing events
        const editableFields = document.querySelectorAll('.editable-field');
        editableFields.forEach(field => {
            field.addEventListener('input', () => this.onFieldChange());
            field.addEventListener('blur', () => this.validateField(field));
        });

        // Save button event
        document.getElementById('saveBtn').addEventListener('click', () => this.saveProfile());

        // Navigation button events
        document.getElementById('myPurchasesBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleMyPurchases();
        });
    }

    // Load user data from URL parameters or localStorage
    loadUserData() {
        // Refresh user data from localStorage
        sharedUtils.refreshUserData();
        console.log('Shared user data:', sharedUtils.userData);
        
        // Check if user is authenticated using shared utilities
        if (!sharedUtils.isAuthenticated()) {
            console.log('User not authenticated, redirecting to auth');
            this.showMessage('Please login to access dashboard', 'warning');
            setTimeout(() => {
                window.location.href = '/auth.html';
            }, 2000);
            return;
        }

        // Use shared user data for userId, but fetch latest profile from API
        this.userId = sharedUtils.userData.id;
        this.userData = sharedUtils.userData;
        console.log('Dashboard userId:', this.userId);
        console.log('Dashboard userData:', this.userData);
        
        // First populate fields with localStorage data as fallback
        this.populateFields();
        
        // Then fetch latest user profile from API
        this.fetchUserProfile();
    }

    // Fetch user profile from API
    async fetchUserProfile() {
        this.showLoading(true);
        
        try {
            console.log('Fetching profile for userId:', this.userId);
            
            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 10000)
            );
            
            const apiPromise = sharedUtils.makeApiCall(`/api/dashboard/profile?userId=${this.userId}`, null, 'GET');
            
            const response = await Promise.race([apiPromise, timeoutPromise]);
            console.log('Profile API response:', response);
            
            if (response.success) {
                this.userData = response.user;
                console.log('User data loaded from API:', this.userData);
                this.populateFields();
                this.showMessage('Profile loaded successfully', 'success');
            } else {
                console.error('Profile API error:', response.message);
                this.showMessage(response.message || 'Failed to load profile', 'error');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            this.showMessage('Failed to load profile. Using cached data.', 'warning');
            // Keep the existing userData from localStorage
        } finally {
            this.showLoading(false);
        }
    }

    // Populate form fields with user data
    populateFields() {
        console.log('Populating fields with userData:', this.userData);
        if (!this.userData) {
            console.log('No userData available for populating fields');
            return;
        }

        // Update user badge
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = this.userData.displayName || 'User';
            console.log('Updated userName element:', this.userData.displayName);
        }

        // Populate form fields
        const displayNameField = document.getElementById('displayNameField');
        const emailField = document.getElementById('emailField');
        const profileImageUrlField = document.getElementById('profileImageUrlField');
        
        if (displayNameField) {
            displayNameField.value = this.userData.displayName || '';
            console.log('Updated displayName field:', this.userData.displayName);
        }
        
        if (emailField) {
            emailField.value = this.userData.email || '';
            console.log('Updated email field:', this.userData.email);
        }
        
        if (profileImageUrlField) {
            profileImageUrlField.value = this.userData.profileImageUrl || '';
            console.log('Updated profileImageUrl field:', this.userData.profileImageUrl);
        }

        // Update profile image
        this.updateProfileImage(this.userData.profileImageUrl);

        // Store original data for comparison
        this.originalData = { ...this.userData };
        console.log('Stored original data:', this.originalData);
    }

    // Update profile image display
    updateProfileImage(imageUrl) {
        const profileImagePreview = document.getElementById('profileImagePreview');
        const profilePlaceholder = document.getElementById('profilePlaceholder');

        if (imageUrl && imageUrl.trim() !== '') {
            profileImagePreview.src = imageUrl;
            profileImagePreview.style.display = 'block';
            profilePlaceholder.style.display = 'none';
        } else {
            profileImagePreview.style.display = 'none';
            profilePlaceholder.style.display = 'flex';
        }
    }

    // Handle image upload
    triggerImageUpload() {
        document.getElementById('imageInput').click();
    }

    async handleImageUpload(event) {
        const file = event.target.files[0];
        
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showMessage('Please select a valid image file', 'error');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.showMessage('Image size must be less than 5MB', 'error');
                return;
            }

            try {
                // Convert to base64
                const base64String = await this.convertFileToBase64(file);
                
                // Update the profile image URL field
                document.getElementById('profileImageUrlField').value = base64String;
                
                // Update the image preview
                this.updateProfileImage(base64String);
                
                this.onFieldChange();
                this.showMessage('Image uploaded successfully', 'success');
            } catch (error) {
                console.error('Error converting image:', error);
                this.showMessage('Error processing image', 'error');
            }
        }
    }

    // Convert file to base64
    async convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    // Handle field changes
    onFieldChange() {
        this.isEditing = true;
        this.updateSaveButton();
    }

    // Validate individual field
    validateField(field) {
        const fieldId = field.id;
        const value = field.value.trim();

        // Clear previous errors
        this.clearFieldError(fieldId);

        switch (fieldId) {
            case 'displayNameField':
                if (!value) {
                    this.showFieldError(fieldId, 'Display name is required');
                    return false;
                }
                if (value.length < 3) {
                    this.showFieldError(fieldId, 'Display name must be at least 3 characters');
                    return false;
                }
                break;

            case 'emailField':
                if (!value) {
                    this.showFieldError(fieldId, 'Email is required');
                    return false;
                }
                if (!this.isValidEmail(value)) {
                    this.showFieldError(fieldId, 'Please enter a valid email address');
                    return false;
                }
                break;

            case 'profileImageUrlField':
                if (value && !this.isValidUrl(value)) {
                    this.showFieldError(fieldId, 'Please enter a valid URL');
                    return false;
                }
                break;
        }

        return true;
    }

    // Show field error
    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.classList.add('error');
        
        // Create or update error message
        let errorElement = document.getElementById(fieldId + 'Error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.id = fieldId + 'Error';
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    // Clear field error
    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        field.classList.remove('error');
        
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    // Update save button state
    updateSaveButton() {
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.disabled = !this.isEditing;
        
        if (this.isEditing) {
            saveBtn.classList.add('editing');
        } else {
            saveBtn.classList.remove('editing');
        }
    }

    // Save profile
    async saveProfile() {
        // Validate all fields
        const fields = ['displayNameField', 'emailField', 'profileImageUrlField'];
        let isValid = true;

        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showMessage('Please fix the errors before saving', 'error');
            return;
        }

        // Check if there are any changes
        const currentData = {
            displayName: document.getElementById('displayNameField').value.trim(),
            email: document.getElementById('emailField').value.trim(),
            profileImageUrl: document.getElementById('profileImageUrlField').value.trim()
        };

        const hasChanges = Object.keys(currentData).some(key => 
            currentData[key] !== (this.originalData[key] || '')
        );

        if (!hasChanges) {
            this.showMessage('No changes to save', 'warning');
            return;
        }

        this.showLoading(true);

        try {
            const response = await sharedUtils.makeApiCall('/api/dashboard/profile', {
                userId: this.userId,
                ...currentData
            }, 'PUT');

            if (response.success) {
                this.userData = response.user;
                this.originalData = { ...this.userData };
                this.isEditing = false;
                this.updateSaveButton();
                this.showMessage('Profile updated successfully', 'success');
                
                // Update shared user data
                sharedUtils.userData = this.userData;
                sharedUtils.setItem('userData', this.userData);
            } else {
                this.showMessage(response.message || 'Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            this.showMessage('Failed to save profile. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Handle navigation buttons
    handleMyPurchases() {
        this.showMessage('My Purchases feature coming soon!', 'warning');
        // TODO: Implement purchases functionality
    }


    // Utility methods
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

    // UI helper methods
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('show');
        } else {
            overlay.classList.remove('show');
        }
    }

    showMessage(message, type) {
        const messageContainer = document.getElementById('messageContainer');
        
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
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, 5000);
    }
}

// Initialize the dashboard manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DashboardManager };
}
