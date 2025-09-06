package com.hitarth.odoo.service;

import com.hitarth.odoo.dto.AuthResponse;
import com.hitarth.odoo.model.User;
import com.hitarth.odoo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DashboardService {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Get user profile by ID
     * @param userId the user ID
     * @return AuthResponse with user info
     */
    public AuthResponse getUserProfile(Long userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            
            if (userOptional.isEmpty()) {
                return AuthResponse.error("User not found");
            }
            
            User user = userOptional.get();
            
            // Create user info for response
            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                user.getId(),
                user.getDisplayName(),
                user.getEmail(),
                user.getProfileImageUrl()
            );
            
            return AuthResponse.success("Profile retrieved successfully", null, userInfo);
            
        } catch (Exception e) {
            System.err.println("Get profile error: " + e.getMessage());
            e.printStackTrace();
            return AuthResponse.error("Failed to retrieve profile: " + e.getMessage());
        }
    }
    
    /**
     * Update user profile
     * @param userId the user ID
     * @param displayName the new display name
     * @param email the new email
     * @param profileImageUrl the new profile image URL
     * @return AuthResponse with updated user info
     */
    public AuthResponse updateUserProfile(Long userId, String displayName, String email, String profileImageUrl) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            
            if (userOptional.isEmpty()) {
                return AuthResponse.error("User not found");
            }
            
            User user = userOptional.get();
            
            // Check if email is being changed and if it already exists
            if (!user.getEmail().equals(email)) {
                if (userRepository.existsByEmail(email)) {
                    return AuthResponse.error("Email already exists. Please use a different email.");
                }
            }
            
            // Check if display name is being changed and if it already exists
            if (!user.getDisplayName().equals(displayName)) {
                if (userRepository.existsByDisplayName(displayName)) {
                    return AuthResponse.error("Display name already exists. Please choose a different name.");
                }
            }
            
            // Update user fields
            user.setDisplayName(displayName);
            user.setEmail(email);
            if (profileImageUrl != null && !profileImageUrl.trim().isEmpty()) {
                user.setProfileImageUrl(profileImageUrl);
            }
            
            // Save updated user
            User updatedUser = userRepository.save(user);
            
            // Create user info for response
            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                updatedUser.getId(),
                updatedUser.getDisplayName(),
                updatedUser.getEmail(),
                updatedUser.getProfileImageUrl()
            );
            
            return AuthResponse.success("Profile updated successfully", null, userInfo);

        } catch (Exception e) {
            System.err.println("Update profile error: " + e.getMessage());
            e.printStackTrace();
            return AuthResponse.error("Failed to update profile: " + e.getMessage());
        }
    }
}
