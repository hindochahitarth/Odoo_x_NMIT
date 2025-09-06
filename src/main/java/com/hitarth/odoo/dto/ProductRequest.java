package com.hitarth.odoo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class ProductRequest {
    
    @NotBlank(message = "Product title is required")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be a positive number")
    private BigDecimal price;
    
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be a positive number")
    private Integer quantity = 1;
    
    private String conditionType;
    private String brand;
    private String model;
    private Integer yearManufactured;
    private String dimensions;
    private BigDecimal weight;
    private String material;
    private String color;
    private Boolean originalPackaging = false;
    private Boolean manualIncluded = false;
    private String workingCondition;
    private String imageUrl;
    
    // Constructors
    public ProductRequest() {}
    
    public ProductRequest(String title, String description, String category, BigDecimal price) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.price = price;
    }
    
    // Getters and Setters
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
    
    @Override
    public String toString() {
        return "ProductRequest{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", category='" + category + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                '}';
    }
}
