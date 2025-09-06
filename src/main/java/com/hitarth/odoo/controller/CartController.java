package com.hitarth.odoo.controller;

import com.hitarth.odoo.dto.CartItemResponse;
import com.hitarth.odoo.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    // Add item to cart
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addToCart(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") Integer quantity) {
        
        try {
            CartItemResponse cartItem = cartService.addToCart(userId, productId, quantity);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Item added to cart successfully");
            response.put("cartItem", cartItem);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get user's cart items
    @GetMapping("/items/{userId}")
    public ResponseEntity<Map<String, Object>> getCartItems(@PathVariable Long userId) {
        try {
            List<CartItemResponse> cartItems = cartService.getCartItems(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("cartItems", cartItems);
            response.put("count", cartItems.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Update cart item quantity
    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<Map<String, Object>> updateCartItemQuantity(
            @PathVariable Long cartItemId,
            @RequestParam Long userId,
            @RequestParam Integer quantity) {
        
        try {
            CartItemResponse cartItem = cartService.updateCartItemQuantity(userId, cartItemId, quantity);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cart item updated successfully");
            response.put("cartItem", cartItem);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Remove item from cart
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<Map<String, Object>> removeFromCart(
            @PathVariable Long cartItemId,
            @RequestParam Long userId) {
        
        try {
            cartService.removeFromCart(userId, cartItemId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Item removed from cart successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Clear user's cart
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<Map<String, Object>> clearCart(@PathVariable Long userId) {
        try {
            cartService.clearCart(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cart cleared successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get cart item count
    @GetMapping("/count/{userId}")
    public ResponseEntity<Map<String, Object>> getCartItemCount(@PathVariable Long userId) {
        try {
            long count = cartService.getCartItemCount(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

