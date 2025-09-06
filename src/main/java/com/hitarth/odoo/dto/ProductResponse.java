package com.hitarth.odoo.dto;

import com.hitarth.odoo.model.Product;
import com.hitarth.odoo.model.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductResponse {
    
    private Long id;
    private String title;
    private String description;
    private String category;
    private BigDecimal price;
    private Integer quantity;
    private String conditionType;
    private String brand;
    private String model;
    private Integer yearManufactured;
    private String dimensions;
    private BigDecimal weight;
    private String material;
    private String color;
    private Boolean originalPackaging;
    private Boolean manualIncluded;
    private String workingCondition;
    private String imageUrl;
    private Boolean isActive;
    private Boolean isSold;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private SellerInfo seller;
    
    // Constructors
    public ProductResponse() {}
    
    public ProductResponse(Product product) {
        this.id = product.getId();
        this.title = product.getTitle();
        this.description = product.getDescription();
        this.category = product.getCategory();
        this.price = product.getPrice();
        this.quantity = product.getQuantity();
        this.conditionType = product.getConditionType();
        this.brand = product.getBrand();
        this.model = product.getModel();
        this.yearManufactured = product.getYearManufactured();
        this.dimensions = product.getDimensions();
        this.weight = product.getWeight();
        this.material = product.getMaterial();
        this.color = product.getColor();
        this.originalPackaging = product.getOriginalPackaging();
        this.manualIncluded = product.getManualIncluded();
        this.workingCondition = product.getWorkingCondition();
        this.imageUrl = product.getImageUrl();
        this.isActive = product.getIsActive();
        this.isSold = product.getIsSold();
        this.createdAt = product.getCreatedAt();
        this.updatedAt = product.getUpdatedAt();
        
        if (product.getSeller() != null) {
            this.seller = new SellerInfo(product.getSeller());
        }
    }
    
    // Inner class for seller information
    public static class SellerInfo {
        private Long id;
        private String displayName;
        private String email;
        private String profileImageUrl;
        
        public SellerInfo() {}
        
        public SellerInfo(User user) {
            this.id = user.getId();
            this.displayName = user.getDisplayName();
            this.email = user.getEmail();
            this.profileImageUrl = user.getProfileImageUrl();
        }
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getDisplayName() {
            return displayName;
        }
        
        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getProfileImageUrl() {
            return profileImageUrl;
        }
        
        public void setProfileImageUrl(String profileImageUrl) {
            this.profileImageUrl = profileImageUrl;
        }
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public String getConditionType() {
        return conditionType;
    }
    
    public void setConditionType(String conditionType) {
        this.conditionType = conditionType;
    }
    
    public String getBrand() {
        return brand;
    }
    
    public void setBrand(String brand) {
        this.brand = brand;
    }
    
    public String getModel() {
        return model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }
    
    public Integer getYearManufactured() {
        return yearManufactured;
    }
    
    public void setYearManufactured(Integer yearManufactured) {
        this.yearManufactured = yearManufactured;
    }
    
    public String getDimensions() {
        return dimensions;
    }
    
    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }
    
    public BigDecimal getWeight() {
        return weight;
    }
    
    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }
    
    public String getMaterial() {
        return material;
    }
    
    public void setMaterial(String material) {
        this.material = material;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public Boolean getOriginalPackaging() {
        return originalPackaging;
    }
    
    public void setOriginalPackaging(Boolean originalPackaging) {
        this.originalPackaging = originalPackaging;
    }
    
    public Boolean getManualIncluded() {
        return manualIncluded;
    }
    
    public void setManualIncluded(Boolean manualIncluded) {
        this.manualIncluded = manualIncluded;
    }
    
    public String getWorkingCondition() {
        return workingCondition;
    }
    
    public void setWorkingCondition(String workingCondition) {
        this.workingCondition = workingCondition;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public Boolean getIsSold() {
        return isSold;
    }
    
    public void setIsSold(Boolean isSold) {
        this.isSold = isSold;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public SellerInfo getSeller() {
        return seller;
    }
    
    public void setSeller(SellerInfo seller) {
        this.seller = seller;
    }
}
