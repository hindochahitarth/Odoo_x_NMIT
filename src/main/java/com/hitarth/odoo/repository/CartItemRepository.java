package com.hitarth.odoo.repository;

import com.hitarth.odoo.model.CartItem;
import com.hitarth.odoo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    // Find all cart items for a user
    List<CartItem> findByUserOrderByAddedAtDesc(User user);
    
    // Find cart item by user and product
    Optional<CartItem> findByUserAndProduct(User user, com.hitarth.odoo.model.Product product);
    
    // Count cart items for a user
    long countByUser(User user);
    
    // Delete all cart items for a user
    void deleteByUser(User user);
    
    // Find cart items with product details
    @Query("SELECT ci FROM CartItem ci JOIN FETCH ci.product WHERE ci.user = :user ORDER BY ci.addedAt DESC")
    List<CartItem> findByUserWithProduct(@Param("user") User user);
}

