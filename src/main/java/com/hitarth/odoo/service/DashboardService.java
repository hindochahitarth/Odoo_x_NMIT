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
            System.out.println("Update profile request - userId: " + userId + ", displayName: " + displayName + ", email: " + email);
            
            Optional<User> userOptional = userRepository.findById(userId);
            
            if (userOptional.isEmpty()) {
                System.out.println("User not found with ID: " + userId);
                return AuthResponse.error("User not found");
            }
            
            User user = userOptional.get();
            System.out.println("Found user: " + user.getEmail() + ", current displayName: " + user.getDisplayName());
            
            // Check if email is being changed and if it already exists
            if (!user.getEmail().equals(email)) {
                System.out.println("Email is being changed from " + user.getEmail() + " to " + email);
                if (userRepository.existsByEmail(email)) {
                    System.out.println("Email already exists: " + email);
                    return AuthResponse.error("Email already exists. Please use a different email.");
                }
            }
            
            // Check if display name is being changed and if it already exists
            if (!user.getDisplayName().equals(displayName)) {
                System.out.println("Display name is being changed from " + user.getDisplayName() + " to " + displayName);
                if (userRepository.existsByDisplayName(displayName)) {
                    System.out.println("Display name already exists: " + displayName);
                    return AuthResponse.error("Display name already exists. Please choose a different name.");
                }
            }
            
            // Update user fields
            user.setDisplayName(displayName);
            user.setEmail(email);
            if (profileImageUrl != null && !profileImageUrl.trim().isEmpty()) {
                user.setProfileImageUrl(profileImageUrl);
            }
            
            System.out.println("Saving updated user...");
            // Save updated user
            User updatedUser = userRepository.save(user);
            System.out.println("User saved successfully with ID: " + updatedUser.getId());
            
            // Create user info for response
            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                updatedUser.getId(),
                updatedUser.getDisplayName(),
                updatedUser.getEmail(),
                updatedUser.getProfileImageUrl()
            );
            
            System.out.println("Returning success response");
            return AuthResponse.success("Profile updated successfully", null, userInfo);

        } catch (Exception e) {
            System.err.println("Update profile error: " + e.getMessage());
            e.printStackTrace();
            return AuthResponse.error("Failed to update profile: " + e.getMessage());
        }
    }
}

