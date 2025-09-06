package com.hitarth.odoo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public class RegisterRequest {
    
    @NotBlank(message = "Display name is required")
    @Size(min = 3, max = 100, message = "Display name must be between 3 and 100 characters")
    private String displayName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$", 
             message = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    private String password;
    
    private String profileImageUrl;
    
    // Constructors
    public RegisterRequest() {}
    
    public RegisterRequest(String displayName, String email, String password) {
        this.displayName = displayName;
        this.email = email;
        this.password = password;
    }
    
    // Getters and Setters
    public String getDisplayName() {
        return displayName;
    }
    
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getProfileImageUrl() {
        return profileImageUrl;
    }
    
    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
    
    @Override
    public String toString() {
        return "RegisterRequest{" +
                "displayName='" + displayName + '\'' +
                ", email='" + email + '\'' +
                ", password='[PROTECTED]'" +
                ", profileImageUrl='" + profileImageUrl + '\'' +
                '}';
    }
}
