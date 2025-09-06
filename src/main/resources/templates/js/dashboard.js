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

        // Debug button event
        document.getElementById('debugBtn').addEventListener('click', () => this.debugInfo());

        // Navigation button events
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(button.getAttribute('href'));
            });
        });
    }

    // Load user data from the database via API
    async loadUserData() {
        // Wait for sharedUtils to be available
        if (typeof sharedUtils === 'undefined') {
            console.log('sharedUtils not available, waiting...');
            setTimeout(() => this.loadUserData(), 100);
            return;
        }

        // Refresh user data from localStorage
        sharedUtils.refreshUserData();
        
        if (!sharedUtils.isAuthenticated()) {
            console.log('User not authenticated, redirecting to auth');
            this.showMessage('Please login to access dashboard', 'warning');
            setTimeout(() => {
                window.location.href = '/auth.html';
            }, 2000);
            return;
        }

        this.userId = sharedUtils.getUserId();
        if (!this.userId) {
            console.error('No userId available');
            this.showMessage('User session invalid, please login again', 'error');
            return;
        }

        console.log('User authenticated, userId:', this.userId, 'type:', typeof this.userId);
        console.log('User data from sharedUtils:', sharedUtils.userData);
        await this.fetchUserProfile();
    }

    // Fetch user profile from database via API
    async fetchUserProfile() {
        this.showLoading(true);

        try {
            const apiUrl = `/api/dashboard/profile?userId=${this.userId}`;
            console.log('Making API call to:', apiUrl);
            
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), 10000)
            );

            const apiPromise = sharedUtils.makeApiCall(apiUrl, null, 'GET');
            const response = await Promise.race([apiPromise, timeoutPromise]);

            console.log('API Response received:', response);
            console.log('Response success:', response.success);
            console.log('Response user:', response.user);

            if (response.success && response.user) {
                this.userData = response.user;
                console.log('User data loaded from database:', this.userData);
                this.populateFields();
                this.showMessage('Profile loaded successfully', 'success');
            } else {
                console.error('Profile API error:', response.message);
                this.showMessage(response.message || 'Failed to load profile', 'error');
                // Optionally redirect to login if critical
                setTimeout(() => {
                    window.location.href = '/auth.html';
                }, 2000);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            this.showMessage('Failed to load profile. Please try again.', 'error');
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

        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = this.userData.displayName || 'User';
        }

        const fields = {
            displayNameField: this.userData.displayName || '',
            emailField: this.userData.email || '',
            profileImageUrlField: this.userData.profileImageUrl || ''
        };

        Object.entries(fields).forEach(([id, value]) => {
            const field = document.getElementById(id);
            if (field) {
                field.value = value;
                console.log(`Updated ${id}:`, value);
            }
        });

        this.updateProfileImage(this.userData.profileImageUrl);
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
            if (!file.type.startsWith('image/')) {
                this.showMessage('Please select a valid image file', 'error');
                return;
            }

            if (file.size > 2 * 1024 * 1024) { // Reduced to 2MB
                this.showMessage('Image size must be less than 2MB', 'error');
                return;
            }

            try {
                const base64String = await this.convertFileToBase64(file);
                
                // Check if base64 string is too long
                if (base64String.length > 10000) {
                    this.showMessage('Image is too large. Please use a smaller image.', 'error');
                    return;
                }
                
                document.getElementById('profileImageUrlField').value = base64String;
                this.updateProfileImage(base64String);
                this.onFieldChange();
                this.showMessage('Image uploaded successfully', 'success');
            } catch (error) {
                console.error('Error converting image:', error);
                this.showMessage('Error processing image', 'error');
            }
        }
    }

    async convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    onFieldChange() {
        this.isEditing = true;
        this.updateSaveButton();
    }

    validateField(field) {
        const fieldId = field.id;
        const value = field.value.trim();
        this.clearFieldError(fieldId);

        switch (fieldId) {
            case 'displayNameField':
                if (!value) {
                    this.showFieldError(fieldId, 'Display name is required');
                    return false;
                }
                if (value.length < 3 || value.length > 50) {
                    this.showFieldError(fieldId, 'Display name must be 3-50 characters');
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

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.classList.add('error');

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

    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        field.classList.remove('error');

        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    updateSaveButton() {
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.disabled = !this.isEditing;

        if (this.isEditing) {
            saveBtn.classList.add('editing');
        } else {
            saveBtn.classList.remove('editing');
        }
    }

    // Save profile to database
    async saveProfile() {
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
            const requestData = {
                userId: this.userId,
                ...currentData
            };
            
            console.log('Saving profile with data:', requestData);
            console.log('Making API call to: /api/dashboard/profile');
            
            const response = await sharedUtils.makeApiCall(`/api/dashboard/profile`, requestData, 'PUT');

            console.log('Save API Response received:', response);
            console.log('Response success:', response.success);
            console.log('Response message:', response.message);

            if (response.success) {
                this.userData = { ...this.userData, ...currentData };
                this.originalData = { ...this.userData };
                this.isEditing = false;
                this.updateSaveButton();
                this.showMessage('Profile updated successfully', 'success');
                
                // Update localStorage with new data
                sharedUtils.setStoredUserData(this.userData);
            } else {
                console.error('Save failed with response:', response);
                this.showMessage(response.message || 'Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            // Show more specific error message
            let errorMessage = 'Failed to save profile. Please try again.';
            if (error.message) {
                errorMessage = error.message;
            }
            this.showMessage(errorMessage, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    handleNavigation(href) {
        window.location.href = href;
    }

    debugInfo() {
        console.log('=== DASHBOARD DEBUG INFO ===');
        console.log('this.userId:', this.userId);
        console.log('this.userData:', this.userData);
        console.log('DOM Elements:');
        console.log('- displayNameField:', document.getElementById('displayNameField')?.value);
        console.log('- emailField:', document.getElementById('emailField')?.value);
        console.log('- profileImageUrlField:', document.getElementById('profileImageUrlField')?.value);
        console.log('- userName:', document.getElementById('userName')?.textContent);

        const debugInfo = `
Dashboard Debug Info:
- this.userId: ${this.userId}
- this.userData: ${JSON.stringify(this.userData)}
- Display Name Field: ${document.getElementById('displayNameField')?.value || 'EMPTY'}
- Email Field: ${document.getElementById('emailField')?.value || 'EMPTY'}
        `;
        alert(debugInfo);
    }


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

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.toggle('show', show);
    }

    showMessage(message, type) {
        const messageContainer = document.getElementById('messageContainer');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;

        messageContainer.appendChild(messageElement);
        setTimeout(() => messageElement.classList.add('show'), 100);

        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => messageContainer.removeChild(messageElement), 300);
        }, 5000);
    }
}

// Initialize the dashboard manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});

// sharedUtils should be loaded from shared.js