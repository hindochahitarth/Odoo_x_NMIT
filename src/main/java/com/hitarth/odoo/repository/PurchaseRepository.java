package com.hitarth.odoo.repository;

import com.hitarth.odoo.model.Purchase;
import com.hitarth.odoo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    
    // Find all purchases for a user
    List<Purchase> findByUserOrderByPurchaseDateDesc(User user);
    
    // Find purchases with items
    @Query("SELECT p FROM Purchase p LEFT JOIN FETCH p.items WHERE p.user = :user ORDER BY p.purchaseDate DESC")
    List<Purchase> findByUserWithItems(@Param("user") User user);
}

