package com.hitarth.odoo.service;

import com.hitarth.odoo.dto.PurchaseItemResponse;
import com.hitarth.odoo.dto.PurchaseResponse;
import com.hitarth.odoo.model.*;
import com.hitarth.odoo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PurchaseService {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private PurchaseItemRepository purchaseItemRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // Create purchase from cart
    public PurchaseResponse createPurchaseFromCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<CartItem> cartItems = cartItemRepository.findByUserWithProduct(user);
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        // Calculate total amount
        BigDecimal totalAmount = cartItems.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Create purchase
        Purchase purchase = new Purchase(user, totalAmount);
        purchase = purchaseRepository.save(purchase);
        
        // Create purchase items and clear cart
        for (CartItem cartItem : cartItems) {
            PurchaseItem purchaseItem = new PurchaseItem(
                    purchase,
                    cartItem.getProduct(),
                    cartItem.getQuantity(),
                    cartItem.getProduct().getPrice()
            );
            purchaseItemRepository.save(purchaseItem);
        }
        
        // Clear cart
        cartItemRepository.deleteByUser(user);
        
        // Load purchase with items for response
        purchase = purchaseRepository.findById(purchase.getId()).orElse(purchase);
        return convertToResponse(purchase);
    }

    // Get user's purchase history
    public List<PurchaseResponse> getPurchaseHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Purchase> purchases = purchaseRepository.findByUserWithItems(user);
        return purchases.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get purchase by ID
    public PurchaseResponse getPurchaseById(Long userId, Long purchaseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));
        
        if (!purchase.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to purchase");
        }
        
        return convertToResponse(purchase);
    }

    // Convert Purchase to PurchaseResponse
    private PurchaseResponse convertToResponse(Purchase purchase) {
        List<PurchaseItemResponse> itemResponses = purchase.getItems().stream()
                .map(this::convertItemToResponse)
                .collect(Collectors.toList());
        
        return new PurchaseResponse(
                purchase.getId(),
                purchase.getTotalAmount(),
                purchase.getPurchaseDate(),
                purchase.getStatus(),
                itemResponses
        );
    }

    // Convert PurchaseItem to PurchaseItemResponse
    private PurchaseItemResponse convertItemToResponse(PurchaseItem item) {
        Product product = item.getProduct();
        return new PurchaseItemResponse(
                item.getId(),
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getCategory(),
                product.getImageUrl(),
                item.getQuantity(),
                item.getPriceAtPurchase()
        );
    }
}

