package com.hitarth.odoo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    
    /**
     * Serve the home page
     * GET /
     */
    @GetMapping("/")
    public String home() {
        return "forward:/html/index.html";
    }
    
    /**
     * Serve the home page
     * GET /index
     */
    @GetMapping("/index")
    public String indexRoot() {
        return "forward:/html/index.html";
    }
    
    /**
     * Serve the index page
     * GET /index.html
     */
    @GetMapping("/index.html")
    public String index() {
        return "forward:/html/index.html";
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
     * Serve the authentication page
     * GET /auth.html
     */
    @GetMapping("/auth.html")
    public String authHtml() {
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
    
    /**
     * Serve the dashboard page
     * GET /dashboard.html
     */
    @GetMapping("/dashboard.html")
    public String dashboardHtml() {
        return "forward:/html/dashboard.html";
    }
    
    /**
     * Serve the marketplace page
     * GET /marketplace.html
     */
    @GetMapping("/marketplace.html")
    public String marketplace() {
        return "forward:/html/marketplace.html";
    }
    
    /**
     * Serve the add product page
     * GET /add-product.html
     */
    @GetMapping("/add-product.html")
    public String addProduct() {
        return "forward:/html/add-product.html";
    }
    
    /**
     * Serve the my listings page
     * GET /my-listings.html
     */
    @GetMapping("/my-listings.html")
    public String myListings() {
        return "forward:/html/my-listings.html";
    }
    
    /**
     * Serve the product detail page
     * GET /product-detail.html
     */
    @GetMapping("/product-detail.html")
    public String productDetail() {
        return "forward:/html/product-detail.html";
    }
    
    /**
     * Serve the cart page
     * GET /cart.html
     */
    @GetMapping("/cart.html")
    public String cart() {
        return "forward:/html/cart.html";
    }
    
    /**
     * Serve the purchases page
     * GET /purchases.html
     */
    @GetMapping("/purchases.html")
    public String purchases() {
        return "forward:/html/purchases.html";
    }
}
