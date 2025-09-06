package com.hitarth.odoo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    
    /**
     * Serve the authentication page
     * GET /
     */
    @GetMapping("/")
    public String home() {
        return "redirect:/register";
    }
    
    /**
     * Serve the authentication page
     * GET /auth
     */
    @GetMapping("/auth")
    public String auth() {
        return "forward:/html/auth.html";
    }
    
    /**
     * Serve the authentication page
     * GET /login
     */
    @GetMapping("/login")
    public String login() {
        return "forward:/html/auth.html";
    }
    
    /**
     * Serve the authentication page
     * GET /register
     */
    @GetMapping("/register")
    public String register() {
        return "forward:/html/auth.html";
    }
    
    /**
     * Serve the dashboard page
     * GET /dashboard
     */
    @GetMapping("/dashboard")
    public String dashboard() {
        return "forward:/html/dashboard.html";
    }
}
