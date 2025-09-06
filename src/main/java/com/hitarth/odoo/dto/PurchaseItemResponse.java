package com.hitarth.odoo.dto;

import java.math.BigDecimal;

public class PurchaseItemResponse {
    private Long id;
    private Long productId;
    private String productTitle;
    private String productDescription;
    private String productCategory;
    private String productImageUrl;
    private Integer quantity;
    private BigDecimal priceAtPurchase;

    // Constructors
    public PurchaseItemResponse() {}

    public PurchaseItemResponse(Long id, Long productId, String productTitle, String productDescription, 
                               String productCategory, String productImageUrl, Integer quantity, 
                               BigDecimal priceAtPurchase) {
        this.id = id;
        this.productId = productId;
        this.productTitle = productTitle;
        this.productDescription = productDescription;
        this.productCategory = productCategory;
        this.productImageUrl = productImageUrl;
        this.quantity = quantity;
        this.priceAtPurchase = priceAtPurchase;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductTitle() {
        return productTitle;
    }

    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }

    public String getProductImageUrl() {
        return productImageUrl;
    }

    public void setProductImageUrl(String productImageUrl) {
        this.productImageUrl = productImageUrl;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPriceAtPurchase() {
        return priceAtPurchase;
    }

    public void setPriceAtPurchase(BigDecimal priceAtPurchase) {
        this.priceAtPurchase = priceAtPurchase;
    }
}
