package com.hitarth.odoo.controller;

import com.hitarth.odoo.dto.AuthResponse;
import com.hitarth.odoo.model.User;
import com.hitarth.odoo.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    /**
     * Get user profile data
     * GET /api/dashboard/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<AuthResponse> getProfile(@RequestParam String userId) {
        try {
            AuthResponse response = dashboardService.getUserProfile(Long.parseLong(userId));
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (Exception e) {
            System.err.println("Get profile error: " + e.getMessage());
            e.printStackTrace();
            AuthResponse errorResponse = AuthResponse.error("Failed to fetch profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Update user profile
     * PUT /api/dashboard/profile
     */
    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(@RequestBody Map<String, Object> profileData) {
        try {
            Long userId = Long.parseLong(profileData.get("userId").toString());
            String displayName = (String) profileData.get("displayName");
            String email = (String) profileData.get("email");
            String profileImageUrl = (String) profileData.get("profileImageUrl");
            
            AuthResponse response = dashboardService.updateUserProfile(userId, displayName, email, profileImageUrl);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
        } catch (Exception e) {
            System.err.println("Update profile error: " + e.getMessage());
            e.printStackTrace();
            AuthResponse errorResponse = AuthResponse.error("Failed to update profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Health check endpoint
     * GET /api/dashboard/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Dashboard service is running");
    }
}
