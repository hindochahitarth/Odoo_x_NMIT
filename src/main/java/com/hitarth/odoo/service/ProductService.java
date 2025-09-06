package com.hitarth.odoo.service;

import com.hitarth.odoo.dto.ProductRequest;
import com.hitarth.odoo.dto.ProductResponse;
import com.hitarth.odoo.model.Product;
import com.hitarth.odoo.model.User;
import com.hitarth.odoo.repository.ProductRepository;
import com.hitarth.odoo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Available categories
    public static final String[] CATEGORIES = {
        "Electronics", "Clothing", "Furniture", "Books", "Sports", 
        "Home & Garden", "Toys", "Automotive", "Beauty", "Other"
    };
    
    // Available condition types
    public static final String[] CONDITION_TYPES = {
        "New", "Like New", "Good", "Fair", "Poor"
    };
    
    /**
     * Create a new product
     */
    public ProductResponse createProduct(ProductRequest request, Long sellerId) {
        try {
            // Find seller
            Optional<User> sellerOptional = userRepository.findById(sellerId);
            if (sellerOptional.isEmpty()) {
                throw new RuntimeException("Seller not found");
            }
            
            User seller = sellerOptional.get();
            
            // Create product
            Product product = new Product();
            product.setTitle(request.getTitle().trim());
            product.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
            product.setCategory(request.getCategory());
            product.setPrice(request.getPrice());
            product.setQuantity(request.getQuantity());
            product.setConditionType(request.getConditionType());
            product.setBrand(request.getBrand());
            product.setModel(request.getModel());
            product.setYearManufactured(request.getYearManufactured());
            product.setDimensions(request.getDimensions());
            product.setWeight(request.getWeight());
            product.setMaterial(request.getMaterial());
            product.setColor(request.getColor());
            product.setOriginalPackaging(request.getOriginalPackaging());
            product.setManualIncluded(request.getManualIncluded());
            product.setWorkingCondition(request.getWorkingCondition());
            product.setImageUrl(request.getImageUrl());
            product.setSeller(seller);
            
            // Save product
            Product savedProduct = productRepository.save(product);
            
            return new ProductResponse(savedProduct);
            
        } catch (Exception e) {
            System.err.println("Error creating product: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create product: " + e.getMessage());
        }
    }
    
    /**
     * Get all active products
     */
    public List<ProductResponse> getAllProducts() {
        try {
            List<Product> products = productRepository.findByIsActiveTrueAndIsSoldFalseOrderByCreatedAtDesc();
            return products.stream()
                    .map(ProductResponse::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching products: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch products: " + e.getMessage());
        }
    }
    
    /**
     * Get products by category
     */
    public List<ProductResponse> getProductsByCategory(String category) {
        try {
            List<Product> products = productRepository.findByCategoryAndIsActiveTrueAndIsSoldFalseOrderByCreatedAtDesc(category);
            return products.stream()
                    .map(ProductResponse::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching products by category: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch products: " + e.getMessage());
        }
    }
    
    /**
     * Search products by title
     */
    public List<ProductResponse> searchProducts(String keyword) {
        try {
            List<Product> products = productRepository.findByTitleContainingIgnoreCase(keyword);
            return products.stream()
                    .map(ProductResponse::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error searching products: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to search products: " + e.getMessage());
        }
    }
    
    /**
     * Search products by title and category
     */
    public List<ProductResponse> searchProducts(String keyword, String category) {
        try {
            List<Product> products = productRepository.findByTitleContainingIgnoreCaseAndCategory(keyword, category);
            return products.stream()
                    .map(ProductResponse::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error searching products: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to search products: " + e.getMessage());
        }
    }
    
    /**
     * Get product by ID
     */
    public ProductResponse getProductById(Long id) {
        try {
            Optional<Product> productOptional = productRepository.findByIdAndIsActiveTrue(id);
            if (productOptional.isEmpty()) {
                throw new RuntimeException("Product not found");
            }
            
            return new ProductResponse(productOptional.get());
        } catch (Exception e) {
            System.err.println("Error fetching product: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch product: " + e.getMessage());
        }
    }
    
    /**
     * Get user's products
     */
    public List<ProductResponse> getUserProducts(Long sellerId) {
        try {
            Optional<User> sellerOptional = userRepository.findById(sellerId);
            if (sellerOptional.isEmpty()) {
                throw new RuntimeException("Seller not found");
            }
            
            User seller = sellerOptional.get();
            List<Product> products = productRepository.findBySellerOrderByCreatedAtDesc(seller);
            return products.stream()
                    .map(ProductResponse::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching user products: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch user products: " + e.getMessage());
        }
    }
    
    /**
     * Update product
     */
    public ProductResponse updateProduct(Long productId, ProductRequest request, Long sellerId) {
        try {
            // Find seller
            Optional<User> sellerOptional = userRepository.findById(sellerId);
            if (sellerOptional.isEmpty()) {
                throw new RuntimeException("Seller not found");
            }
            
            User seller = sellerOptional.get();
            
            // Find product and verify ownership
            Optional<Product> productOptional = productRepository.findByIdAndSeller(productId, seller);
            if (productOptional.isEmpty()) {
                throw new RuntimeException("Product not found or you don't have permission to edit it");
            }
            
            Product product = productOptional.get();
            
            // Update fields
            product.setTitle(request.getTitle().trim());
            product.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
            product.setCategory(request.getCategory());
            product.setPrice(request.getPrice());
            product.setQuantity(request.getQuantity());
            product.setConditionType(request.getConditionType());
            product.setBrand(request.getBrand());
            product.setModel(request.getModel());
            product.setYearManufactured(request.getYearManufactured());
            product.setDimensions(request.getDimensions());
            product.setWeight(request.getWeight());
            product.setMaterial(request.getMaterial());
            product.setColor(request.getColor());
            product.setOriginalPackaging(request.getOriginalPackaging());
            product.setManualIncluded(request.getManualIncluded());
            product.setWorkingCondition(request.getWorkingCondition());
            product.setImageUrl(request.getImageUrl());
            
            // Save updated product
            Product updatedProduct = productRepository.save(product);
            
            return new ProductResponse(updatedProduct);
            
        } catch (Exception e) {
            System.err.println("Error updating product: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to update product: " + e.getMessage());
        }
    }
    
    /**
     * Delete product (soft delete)
     */
    public boolean deleteProduct(Long productId, Long sellerId) {
        try {
            // Find seller
            Optional<User> sellerOptional = userRepository.findById(sellerId);
            if (sellerOptional.isEmpty()) {
                throw new RuntimeException("Seller not found");
            }
            
            User seller = sellerOptional.get();
            
            // Find product and verify ownership
            Optional<Product> productOptional = productRepository.findByIdAndSeller(productId, seller);
            if (productOptional.isEmpty()) {
                throw new RuntimeException("Product not found or you don't have permission to delete it");
            }
            
            Product product = productOptional.get();
            product.setIsActive(false);
            productRepository.save(product);
            
            return true;
            
        } catch (Exception e) {
            System.err.println("Error deleting product: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete product: " + e.getMessage());
        }
    }
    
    /**
     * Get available categories
     */
    public String[] getCategories() {
        return CATEGORIES;
    }
    
    /**
     * Get available condition types
     */
    public String[] getConditionTypes() {
        return CONDITION_TYPES;
    }
}

