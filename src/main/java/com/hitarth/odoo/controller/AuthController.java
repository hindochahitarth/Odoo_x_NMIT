package com.hitarth.odoo.controller;

import com.hitarth.odoo.dto.AuthResponse;
import com.hitarth.odoo.dto.LoginRequest;
import com.hitarth.odoo.dto.RegisterRequest;
import com.hitarth.odoo.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow CORS for frontend integration
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * User registration endpoint
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request, BindingResult bindingResult) {
        try {
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                StringBuilder errorMessage = new StringBuilder("Validation failed: ");
                bindingResult.getFieldErrors().forEach(error -> {
                    errorMessage.append(error.getField()).append(" - ").append(error.getDefaultMessage()).append("; ");
                });
                AuthResponse errorResponse = AuthResponse.error(errorMessage.toString());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
            
            AuthResponse response = authService.register(request);
            
            if (response.isSuccess()) {
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            AuthResponse errorResponse = AuthResponse.error("Registration failed due to server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * User login endpoint
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, BindingResult bindingResult) {
        try {
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                StringBuilder errorMessage = new StringBuilder("Validation failed: ");
                bindingResult.getFieldErrors().forEach(error -> {
                    errorMessage.append(error.getField()).append(" - ").append(error.getDefaultMessage()).append("; ");
                });
                AuthResponse errorResponse = AuthResponse.error(errorMessage.toString());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
            
            AuthResponse response = authService.login(request);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            AuthResponse errorResponse = AuthResponse.error("Login failed due to server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Health check endpoint
     * GET /api/auth/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth service is running");
    }
}


