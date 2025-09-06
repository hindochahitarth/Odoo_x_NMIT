package com.hitarth.odoo.controller;

import com.hitarth.odoo.dto.PurchaseResponse;
import com.hitarth.odoo.service.PurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "*")
public class PurchaseController {

    @Autowired
    private PurchaseService purchaseService;

    // Create purchase from cart
    @PostMapping("/checkout/{userId}")
    public ResponseEntity<Map<String, Object>> checkout(@PathVariable Long userId) {
        try {
            PurchaseResponse purchase = purchaseService.createPurchaseFromCart(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Purchase completed successfully");
            response.put("purchase", purchase);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get user's purchase history
    @GetMapping("/history/{userId}")
    public ResponseEntity<Map<String, Object>> getPurchaseHistory(@PathVariable Long userId) {
        try {
            List<PurchaseResponse> purchases = purchaseService.getPurchaseHistory(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("purchases", purchases);
            response.put("count", purchases.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get purchase by ID
    @GetMapping("/{purchaseId}")
    public ResponseEntity<Map<String, Object>> getPurchaseById(
            @PathVariable Long purchaseId,
            @RequestParam Long userId) {
        
        try {
            PurchaseResponse purchase = purchaseService.getPurchaseById(userId, purchaseId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("purchase", purchase);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

