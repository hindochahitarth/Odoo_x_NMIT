package com.hitarth.odoo.service;

import com.hitarth.odoo.dto.CartItemResponse;
import com.hitarth.odoo.model.CartItem;
import com.hitarth.odoo.model.Product;
import com.hitarth.odoo.model.User;
import com.hitarth.odoo.repository.CartItemRepository;
import com.hitarth.odoo.repository.ProductRepository;
import com.hitarth.odoo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // Add item to cart
    public CartItemResponse addToCart(Long userId, Long productId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository.findByUserAndProduct(user, product);
        
        if (existingItem.isPresent()) {
            // Update quantity
            CartItem cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            cartItemRepository.save(cartItem);
            return convertToResponse(cartItem);
        } else {
            // Create new cart item
            CartItem cartItem = new CartItem(user, product, quantity);
            cartItemRepository.save(cartItem);
            return convertToResponse(cartItem);
        }
    }

    // Get user's cart items
    public List<CartItemResponse> getCartItems(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<CartItem> cartItems = cartItemRepository.findByUserWithProduct(user);
        return cartItems.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Update cart item quantity
    public CartItemResponse updateCartItemQuantity(Long userId, Long cartItemId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to cart item");
        }
        
        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }
        
        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        return convertToResponse(cartItem);
    }

    // Remove item from cart
    public void removeFromCart(Long userId, Long cartItemId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to cart item");
        }
        
        cartItemRepository.delete(cartItem);
    }

    // Clear user's cart
    public void clearCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        cartItemRepository.deleteByUser(user);
    }

    // Get cart item count
    public long getCartItemCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return cartItemRepository.countByUser(user);
    }

    // Convert CartItem to CartItemResponse
    private CartItemResponse convertToResponse(CartItem cartItem) {
        Product product = cartItem.getProduct();
        return new CartItemResponse(
                cartItem.getId(),
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getCategory(),
                product.getPrice(),
                product.getImageUrl(),
                cartItem.getQuantity(),
                cartItem.getAddedAt()
        );
    }
}
