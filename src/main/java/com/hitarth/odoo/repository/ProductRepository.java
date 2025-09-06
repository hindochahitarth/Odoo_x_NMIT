package com.hitarth.odoo.repository;

import com.hitarth.odoo.model.Product;
import com.hitarth.odoo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Find all active products
    List<Product> findByIsActiveTrueAndIsSoldFalseOrderByCreatedAtDesc();
    
    // Find products by category
    List<Product> findByCategoryAndIsActiveTrueAndIsSoldFalseOrderByCreatedAtDesc(String category);
    
    // Find products by seller
    List<Product> findBySellerAndIsActiveTrueOrderByCreatedAtDesc(User seller);
    
    // Find products by seller (including inactive)
    List<Product> findBySellerOrderByCreatedAtDesc(User seller);
    
    // Search products by title
    @Query("SELECT p FROM Product p WHERE p.title LIKE %:keyword% AND p.isActive = true AND p.isSold = false ORDER BY p.createdAt DESC")
    List<Product> findByTitleContainingIgnoreCase(@Param("keyword") String keyword);
    
    // Search products by title and category
    @Query("SELECT p FROM Product p WHERE p.title LIKE %:keyword% AND p.category = :category AND p.isActive = true AND p.isSold = false ORDER BY p.createdAt DESC")
    List<Product> findByTitleContainingIgnoreCaseAndCategory(@Param("keyword") String keyword, @Param("category") String category);
    
    // Find product by ID and seller (for ownership verification)
    Optional<Product> findByIdAndSeller(Long id, User seller);
    
    // Find active product by ID
    Optional<Product> findByIdAndIsActiveTrue(Long id);
    
    // Count products by seller
    long countBySeller(User seller);
    
    // Count active products by seller
    long countBySellerAndIsActiveTrue(User seller);
    
    // Find products with pagination
    Page<Product> findByIsActiveTrueAndIsSoldFalseOrderByCreatedAtDesc(Pageable pageable);
    
    // Find products by category with pagination
    Page<Product> findByCategoryAndIsActiveTrueAndIsSoldFalseOrderByCreatedAtDesc(String category, Pageable pageable);
}
