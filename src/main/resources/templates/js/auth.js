// EcoFinds Authentication JavaScript
// Simple vanilla JavaScript for login/signup functionality

class AuthManager {
    constructor() {
        this.currentForm = 'login';
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupFormValidation();
        this.checkUrlAndSetForm();
    }

    bindEvents() {
        // Form toggle events
        document.getElementById('showSignup').addEventListener('click', () => this.showSignupForm());
        document.getElementById('showLogin').addEventListener('click', () => this.showLoginForm());

        // Form submission events
        document.getElementById('loginFormElement').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signupFormElement').addEventListener('submit', (e) => this.handleSignup(e));

        // Password toggle events
        document.getElementById('loginPasswordToggle').addEventListener('click', () => this.togglePassword('loginPassword', 'loginPasswordToggle'));
        document.getElementById('signupPasswordToggle').addEventListener('click', () => this.togglePassword('signupPassword', 'signupPasswordToggle'));
        document.getElementById('signupConfirmPasswordToggle').addEventListener('click', () => this.togglePassword('signupConfirmPassword', 'signupConfirmPasswordToggle'));

        // Forgot password event
        document.getElementById('forgotPassword').addEventListener('click', () => this.handleForgotPassword());

        // Image upload event
        document.getElementById('signupProfileImage').addEventListener('change', (e) => this.handleImageUpload(e));

        // Real-time validation
        this.setupRealTimeValidation();
    }

    setupFormValidation() {
        // Email validation regex
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Password requirements
        this.minPasswordLength = 8;
        this.minUsernameLength = 3;
    }

    setupRealTimeValidation() {
        // Login form validation
        const loginEmail = document.getElementById('loginEmail');
        const loginPassword = document.getElementById('loginPassword');

        loginEmail.addEventListener('blur', () => this.validateLoginEmail());
        loginPassword.addEventListener('blur', () => this.validateLoginPassword());

        // Signup form validation
        const signupDisplayName = document.getElementById('signupDisplayName');
        const signupEmail = document.getElementById('signupEmail');
        const signupPassword = document.getElementById('signupPassword');
        const signupConfirmPassword = document.getElementById('signupConfirmPassword');

        signupDisplayName.addEventListener('blur', () => this.validateSignupDisplayName());
        signupEmail.addEventListener('blur', () => this.validateSignupEmail());
        signupPassword.addEventListener('blur', () => this.validateSignupPassword());
        signupPassword.addEventListener('input', () => this.updatePasswordRequirements());
        signupConfirmPassword.addEventListener('blur', () => this.validateSignupConfirmPassword());
    }

    // Check URL and set initial form state
    checkUrlAndSetForm() {
        const path = window.location.pathname;
        if (path.includes('/register')) {
            this.showSignupForm();
        } else {
            this.showLoginForm();
        }
    }

    // Form Toggle Methods
    showSignupForm() {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('signupForm').classList.remove('hidden');
        this.currentForm = 'signup';
        this.clearAllErrors();
    }

    showLoginForm() {
        document.getElementById('signupForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
        this.currentForm = 'login';
        this.clearAllErrors();
    }

    // Validation Methods
    validateLoginEmail() {
        const email = document.getElementById('loginEmail').value.trim();
        const errorElement = document.getElementById('loginEmailError');
        
        if (!email) {
            this.showError('loginEmail', 'Email or username is required');
            return false;
        }
        
        this.clearError('loginEmail');
        return true;
    }

    validateLoginPassword() {
        const password = document.getElementById('loginPassword').value;
        const errorElement = document.getElementById('loginPasswordError');
        
        if (!password) {
            this.showError('loginPassword', 'Password is required');
            return false;
        }
        
        this.clearError('loginPassword');
        return true;
    }

    validateSignupDisplayName() {
        const displayName = document.getElementById('signupDisplayName').value.trim();
        
        if (!displayName) {
            this.showError('signupDisplayName', 'Display name is required');
            return false;
        }
        
        if (displayName.length < this.minUsernameLength) {
            this.showError('signupDisplayName', `Display name must be at least ${this.minUsernameLength} characters`);
            return false;
        }
        
        this.clearError('signupDisplayName');
        return true;
    }

    validateSignupEmail() {
        const email = document.getElementById('signupEmail').value.trim();
        
        if (!email) {
            this.showError('signupEmail', 'Email is required');
            return false;
        }
        
        if (!this.emailRegex.test(email)) {
            this.showError('signupEmail', 'Please enter a valid email address');
            return false;
        }
        
        this.clearError('signupEmail');
        return true;
    }

    validateSignupPassword() {
        const password = document.getElementById('signupPassword').value;
        
        if (!password) {
            this.showError('signupPassword', 'Password is required');
            return false;
        }
        
        if (password.length < this.minPasswordLength) {
            this.showError('signupPassword', `Password must be at least ${this.minPasswordLength} characters`);
            return false;
        }
        
        // Check for uppercase letter
        if (!/[A-Z]/.test(password)) {
            this.showError('signupPassword', 'Password must contain at least one uppercase letter');
            return false;
        }
        
        // Check for lowercase letter
        if (!/[a-z]/.test(password)) {
            this.showError('signupPassword', 'Password must contain at least one lowercase letter');
            return false;
        }
        
        // Check for number
        if (!/\d/.test(password)) {
            this.showError('signupPassword', 'Password must contain at least one number');
            return false;
        }
        
        // Check for special character
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            this.showError('signupPassword', 'Password must contain at least one special character (!@#$%^&*)');
            return false;
        }
        
        this.clearError('signupPassword');
        return true;
    }

    updatePasswordRequirements() {
        const password = document.getElementById('signupPassword').value;
        
        // Update requirement indicators
        const lengthReq = document.getElementById('req-length');
        const uppercaseReq = document.getElementById('req-uppercase');
        const lowercaseReq = document.getElementById('req-lowercase');
        const numberReq = document.getElementById('req-number');
        const specialReq = document.getElementById('req-special');
        
        // Check each requirement
        if (password.length >= 8) {
            lengthReq.classList.add('valid');
        } else {
            lengthReq.classList.remove('valid');
        }
        
        if (/[A-Z]/.test(password)) {
            uppercaseReq.classList.add('valid');
        } else {
            uppercaseReq.classList.remove('valid');
        }
        
        if (/[a-z]/.test(password)) {
            lowercaseReq.classList.add('valid');
        } else {
            lowercaseReq.classList.remove('valid');
        }
        
        if (/\d/.test(password)) {
            numberReq.classList.add('valid');
        } else {
            numberReq.classList.remove('valid');
        }
        
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            specialReq.classList.add('valid');
        } else {
            specialReq.classList.remove('valid');
        }
    }

    validateSignupConfirmPassword() {
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        if (!confirmPassword) {
            this.showError('signupConfirmPassword', 'Please confirm your password');
            return false;
        }
        
        if (password !== confirmPassword) {
            this.showError('signupConfirmPassword', 'Passwords do not match');
            return false;
        }
        
        this.clearError('signupConfirmPassword');
        return true;
    }

    // Error Handling Methods
    showError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    clearError(fieldId) {
        const input = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }

    clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const errorInputs = document.querySelectorAll('.form-input.error');
        
        errorElements.forEach(element => {
            element.textContent = '';
            element.classList.remove('show');
        });
        
        errorInputs.forEach(input => {
            input.classList.remove('error');
        });
    }

    // API Methods
    async makeApiCall(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'An error occurred');
            }
            
            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Form Submission Handlers
    async handleLogin(event) {
        event.preventDefault();
        
        // Validate form
        const isEmailValid = this.validateLoginEmail();
        const isPasswordValid = this.validateLoginPassword();
        
        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        this.setLoading('login', true);

        try {
            const response = await this.makeApiCall('/api/auth/login', {
                email: email,
                password: password
            });

            console.log('Login response:', response);

            if (response.success && response.user) {
                // Store user data in localStorage
                localStorage.setItem('userData', JSON.stringify(response.user));
                
                this.showMessage('Login successful! Redirecting...', 'success');
                
                // Redirect to dashboard after successful login
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1500);
            } else {
                console.log('Login failed - success:', response.success, 'user:', response.user);
                this.showMessage(response.message || 'Login failed. Please check your credentials.', 'error');
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showMessage(error.message || 'Login failed. Please check your credentials.', 'error');
        } finally {
            this.setLoading('login', false);
        }
    }

    async handleSignup(event) {
        event.preventDefault();
        
        // Validate all fields
        const isDisplayNameValid = this.validateSignupDisplayName();
        const isEmailValid = this.validateSignupEmail();
        const isPasswordValid = this.validateSignupPassword();
        const isConfirmPasswordValid = this.validateSignupConfirmPassword();
        
        if (!isDisplayNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            return;
        }

        const displayName = document.getElementById('signupDisplayName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        
        // Handle profile image (convert to base64 for demo purposes)
        let profileImageUrl = null;
        if (this.profileImageFile) {
            profileImageUrl = await this.convertFileToBase64(this.profileImageFile);
        }

        this.setLoading('signup', true);

        try {
            const response = await this.makeApiCall('/api/auth/register', {
                displayName: displayName,
                email: email,
                password: password,
                profileImageUrl: profileImageUrl
            });

            this.showMessage('Account created successfully! Please login.', 'success');
            
            // Switch to login form after successful signup
            setTimeout(() => {
                this.showLoginForm();
                // Pre-fill email field
                document.getElementById('loginEmail').value = email;
            }, 1500);

        } catch (error) {
            this.showMessage(error.message || 'Signup failed. Please try again.', 'error');
        } finally {
            this.setLoading('signup', false);
        }
    }

    // UI Helper Methods
    setLoading(formType, isLoading) {
        const button = document.getElementById(formType + 'Button');
        const spinner = document.getElementById(formType + 'Spinner');
        
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
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

    // Password Toggle Functionality
    togglePassword(inputId, toggleId) {
        const input = document.getElementById(inputId);
        const toggle = document.getElementById(toggleId);
        
        if (input.type === 'password') {
            input.type = 'text';
            toggle.textContent = '🙈';
            toggle.setAttribute('aria-label', 'Hide password');
        } else {
            input.type = 'password';
            toggle.textContent = '👁';
            toggle.setAttribute('aria-label', 'Show password');
        }
    }

    // Forgot Password Functionality
    handleForgotPassword() {
        const email = document.getElementById('loginEmail').value.trim();
        
        if (!email) {
            this.showMessage('Please enter your email address first', 'error');
            document.getElementById('loginEmail').focus();
            return;
        }
        
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            document.getElementById('loginEmail').focus();
            return;
        }
        
        // Show info message (no backend implementation)
        this.showMessage('Password reset instructions have been sent to your email address', 'success');
        
        // In a real application, you would make an API call here
        console.log('Password reset requested for:', email);
    }

    // Image Upload Functionality
    handleImageUpload(event) {
        const file = event.target.files[0];
        const preview = document.getElementById('imagePreview');
        
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showError('signupProfileImage', 'Please select a valid image file');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.showError('signupProfileImage', 'Image size must be less than 5MB');
                return;
            }
            
            // Clear any previous errors
            this.clearError('signupProfileImage');
            
            // Create image preview
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="Profile preview">`;
            };
            reader.readAsDataURL(file);
            
            // Store the file for later upload
            this.profileImageFile = file;
        }
    }

    // Convert file to base64 for demo purposes
    convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }
}

// Initialize the authentication manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Utility functions for form validation
const ValidationUtils = {
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    isValidPassword: (password, minLength = 8) => {
        return password && password.length >= minLength;
    },
    
    isValidUsername: (username, minLength = 3) => {
        return username && username.trim().length >= minLength;
    }
};

// Convert file to base64 string
async function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthManager, ValidationUtils };
}
