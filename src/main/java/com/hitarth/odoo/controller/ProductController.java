package com.hitarth.odoo.controller;

import com.hitarth.odoo.dto.ProductRequest;
import com.hitarth.odoo.dto.ProductResponse;
import com.hitarth.odoo.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    /**
     * Get all active products
     * GET /api/products
     */
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        try {
            List<ProductResponse> products = productService.getAllProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.err.println("Error fetching products: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get products by category
     * GET /api/products/category/{category}
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(@PathVariable String category) {
        try {
            List<ProductResponse> products = productService.getProductsByCategory(category);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.err.println("Error fetching products by category: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Search products
     * GET /api/products/search?keyword={keyword}&category={category}
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category) {
        try {
            List<ProductResponse> products;
            
            if (keyword != null && !keyword.trim().isEmpty() && category != null && !category.trim().isEmpty()) {
                products = productService.searchProducts(keyword.trim(), category);
            } else if (keyword != null && !keyword.trim().isEmpty()) {
                products = productService.searchProducts(keyword.trim());
            } else if (category != null && !category.trim().isEmpty()) {
                products = productService.getProductsByCategory(category);
            } else {
                products = productService.getAllProducts();
            }
            
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.err.println("Error searching products: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get product by ID
     * GET /api/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable Long id) {
        try {
            ProductResponse product = productService.getProductById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("product", product);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            System.err.println("Error fetching product: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch product");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get user's products
     * GET /api/products/user/{sellerId}
     */
    @GetMapping("/user/{sellerId}")
    public ResponseEntity<List<ProductResponse>> getUserProducts(@PathVariable Long sellerId) {
        try {
            List<ProductResponse> products = productService.getUserProducts(sellerId);
            return ResponseEntity.ok(products);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            System.err.println("Error fetching user products: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Create new product
     * POST /api/products
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createProduct(
            @Valid @RequestBody ProductRequest request, 
            BindingResult bindingResult,
            @RequestParam Long sellerId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                StringBuilder errorMessage = new StringBuilder("Validation failed: ");
                bindingResult.getFieldErrors().forEach(error -> {
                    errorMessage.append(error.getField()).append(" - ").append(error.getDefaultMessage()).append("; ");
                });
                response.put("success", false);
                response.put("message", errorMessage.toString());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            ProductResponse product = productService.createProduct(request, sellerId);
            
            response.put("success", true);
            response.put("message", "Product created successfully");
            response.put("product", product);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            System.err.println("Error creating product: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to create product: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Update product
     * PUT /api/products/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request,
            BindingResult bindingResult,
            @RequestParam Long sellerId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                StringBuilder errorMessage = new StringBuilder("Validation failed: ");
                bindingResult.getFieldErrors().forEach(error -> {
                    errorMessage.append(error.getField()).append(" - ").append(error.getDefaultMessage()).append("; ");
                });
                response.put("success", false);
                response.put("message", errorMessage.toString());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            ProductResponse product = productService.updateProduct(id, request, sellerId);
            
            response.put("success", true);
            response.put("message", "Product updated successfully");
            response.put("product", product);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            System.err.println("Error updating product: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to update product: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Delete product
     * DELETE /api/products/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(
            @PathVariable Long id,
            @RequestParam Long sellerId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean deleted = productService.deleteProduct(id, sellerId);
            
            if (deleted) {
                response.put("success", true);
                response.put("message", "Product deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Failed to delete product");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
            
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            System.err.println("Error deleting product: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to delete product: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get available categories
     * GET /api/products/categories
     */
    @GetMapping("/categories")
    public ResponseEntity<String[]> getCategories() {
        try {
            String[] categories = productService.getCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            System.err.println("Error fetching categories: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get available condition types
     * GET /api/products/conditions
     */
    @GetMapping("/conditions")
    public ResponseEntity<String[]> getConditionTypes() {
        try {
            String[] conditionTypes = productService.getConditionTypes();
            return ResponseEntity.ok(conditionTypes);
        } catch (Exception e) {
            System.err.println("Error fetching condition types: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Health check endpoint
     * GET /api/products/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Product service is running");
    }
}
