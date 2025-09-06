package com.hitarth.odoo.dto;

public class AuthResponse {
    
    private boolean success;
    private String message;
    private String token;
    private UserInfo user;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public AuthResponse(boolean success, String message, String token, UserInfo user) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user;
    }
    
    // Static factory methods
    public static AuthResponse success(String message) {
        return new AuthResponse(true, message);
    }
    
    public static AuthResponse success(String message, String token, UserInfo user) {
        return new AuthResponse(true, message, token, user);
    }
    
    public static AuthResponse error(String message) {
        return new AuthResponse(false, message);
    }
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public UserInfo getUser() {
        return user;
    }
    
    public void setUser(UserInfo user) {
        this.user = user;
    }
    
    // Inner class for user information
    public static class UserInfo {
        private Long id;
        private String displayName;
        private String email;
        private String profileImageUrl;
        
        public UserInfo() {}
        
        public UserInfo(Long id, String displayName, String email) {
            this.id = id;
            this.displayName = displayName;
            this.email = email;
        }
        
        public UserInfo(Long id, String displayName, String email, String profileImageUrl) {
            this.id = id;
            this.displayName = displayName;
            this.email = email;
            this.profileImageUrl = profileImageUrl;
        }
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
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
        
        public String getProfileImageUrl() {
            return profileImageUrl;
        }
        
        public void setProfileImageUrl(String profileImageUrl) {
            this.profileImageUrl = profileImageUrl;
        }
        
        @Override
        public String toString() {
            return "UserInfo{" +
                    "id=" + id +
                    ", displayName='" + displayName + '\'' +
                    ", email='" + email + '\'' +
                    ", profileImageUrl='" + profileImageUrl + '\'' +
                    '}';
        }
    }
    
    @Override
    public String toString() {
        return "AuthResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", token='" + (token != null ? "[PROTECTED]" : "null") + '\'' +
                ", user=" + user +
                '}';
    }
}
