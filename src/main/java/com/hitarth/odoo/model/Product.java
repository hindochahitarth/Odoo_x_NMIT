package com.hitarth.odoo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "title", nullable = false, length = 100)
    private String title;
    
    @Column(name = "description", length = 500)
    private String description;
    
    @Column(name = "category", nullable = false, length = 50)
    private String category;
    
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;
    
    @Column(name = "condition_type", length = 20)
    private String conditionType;
    
    @Column(name = "brand", length = 50)
    private String brand;
    
    @Column(name = "model", length = 50)
    private String model;
    
    @Column(name = "year_manufactured")
    private Integer yearManufactured;
    
    @Column(name = "dimensions", length = 100)
    private String dimensions;
    
    @Column(name = "weight", precision = 8, scale = 2)
    private BigDecimal weight;
    
    @Column(name = "material", length = 50)
    private String material;
    
    @Column(name = "color", length = 30)
    private String color;
    
    @Column(name = "original_packaging")
    private Boolean originalPackaging = false;
    
    @Column(name = "manual_included")
    private Boolean manualIncluded = false;
    
    @Column(name = "working_condition", length = 200)
    private String workingCondition;
    
    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "is_sold")
    private Boolean isSold = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;
    
    // Constructors
    public Product() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Product(String title, String description, String category, BigDecimal price, User seller) {
        this();
        this.title = title;
        this.description = description;
        this.category = category;
        this.price = price;
        this.seller = seller;
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
    
    public User getSeller() {
        return seller;
    }
    
    public void setSeller(User seller) {
        this.seller = seller;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", category='" + category + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                ", isActive=" + isActive +
                ", isSold=" + isSold +
                ", createdAt=" + createdAt +
                '}';
    }
}
