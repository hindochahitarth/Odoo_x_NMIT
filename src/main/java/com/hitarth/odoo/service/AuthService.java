package com.hitarth.odoo.service;

import com.hitarth.odoo.dto.AuthResponse;
import com.hitarth.odoo.dto.LoginRequest;
import com.hitarth.odoo.dto.RegisterRequest;
import com.hitarth.odoo.model.User;
import com.hitarth.odoo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    /**
     * Register a new user
     * @param request the registration request
     * @return AuthResponse with success/error message
     */
    public AuthResponse register(RegisterRequest request) {
        try {
            System.out.println("Registration attempt for: " + request.getEmail());
            System.out.println("Display name: " + request.getDisplayName());
            
            // Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                System.out.println("Email already exists: " + request.getEmail());
                return AuthResponse.error("Email already exists. Please use a different email.");
            }
            
            // Check if display name already exists
            if (userRepository.existsByDisplayName(request.getDisplayName())) {
                System.out.println("Display name already exists: " + request.getDisplayName());
                return AuthResponse.error("Display name already exists. Please choose a different name.");
            }
            
            // Create new user
            User user = new User();
            user.setDisplayName(request.getDisplayName().trim());
            user.setEmail(request.getEmail().toLowerCase().trim());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setProfileImageUrl(request.getProfileImageUrl());
            
            System.out.println("Saving user to database...");
            // Save user to database
            User savedUser = userRepository.save(user);
            System.out.println("User saved with ID: " + savedUser.getId());
            
            // Create user info for response
            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                savedUser.getId(),
                savedUser.getDisplayName(),
                savedUser.getEmail(),
                savedUser.getProfileImageUrl()
            );
            
            return AuthResponse.success("Account created successfully!", null, userInfo);
            
        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return AuthResponse.error("Registration failed: " + e.getMessage());
        }
    }
    
    /**
     * Authenticate user login
     * @param request the login request
     * @return AuthResponse with success/error message and user info
     */
    public AuthResponse login(LoginRequest request) {
        try {
            System.out.println("Login attempt for: " + request.getEmail());
            
            // Find user by email or display name
            Optional<User> userOptional = userRepository.findByEmailOrDisplayName(request.getEmail());
            
            if (userOptional.isEmpty()) {
                System.out.println("User not found: " + request.getEmail());
                return AuthResponse.error("Invalid email/username or password.");
            }
            
            User user = userOptional.get();
            System.out.println("User found: " + user.getEmail() + ", Active: " + user.getIsActive());
            
            // Check if user is active
            if (!user.getIsActive()) {
                System.out.println("User account is inactive");
                return AuthResponse.error("Account is deactivated. Please contact support.");
            }
            
            // Verify password
            System.out.println("Checking password for user: " + user.getEmail());
            System.out.println("Stored hash: " + user.getPasswordHash());
            System.out.println("Input password: " + request.getPassword());
            
            boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
            System.out.println("Password matches: " + passwordMatches);
            
            if (!passwordMatches) {
                System.out.println("Password verification failed");
                return AuthResponse.error("Invalid email/username or password.");
            }
            
            // Generate session token (simple UUID for now)
            String sessionToken = UUID.randomUUID().toString();
            
            // Create user info for response
            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                user.getId(),
                user.getDisplayName(),
                user.getEmail(),
                user.getProfileImageUrl()
            );
            
            return AuthResponse.success("Login successful!", sessionToken, userInfo);
            
        } catch (Exception e) {
            return AuthResponse.error("Login failed. Please try again.");
        }
    }
    
    /**
     * Validate email format
     * @param email the email to validate
     * @return true if valid, false otherwise
     */
    public boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        String emailRegex = "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$";
        return email.matches(emailRegex);
    }
    
    /**
     * Validate password strength
     * @param password the password to validate
     * @return true if valid, false otherwise
     */
    public boolean isValidPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        
        // Check for uppercase letter
        boolean hasUppercase = password.matches(".*[A-Z].*");
        
        // Check for lowercase letter
        boolean hasLowercase = password.matches(".*[a-z].*");
        
        // Check for number
        boolean hasNumber = password.matches(".*\\d.*");
        
        // Check for special character
        boolean hasSpecialChar = password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*");
        
        return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    }
}
