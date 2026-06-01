package com.example.FujiFruit.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartItemRequest {

    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NotNull(message = "ID sản phẩm không được để trống")
    private Long fruitId;

    @Min(value = 1, message = "Số lượng phải lớn hơn hoặc bằng 1")
    private int quantity;

    private String fruitName;
    private Double fruitPrice;
    private  Double fruitDiscount;
    private String image;

    public String getFruitName() {
        return fruitName;
    }

    public void setFruitName(String fruitName) {
        this.fruitName = fruitName;
    }

    public Double getFruitDiscount() {
        return fruitDiscount;
    }

    public void setFruitDiscount(Double fruitDiscount) {
        this.fruitDiscount = fruitDiscount;
    }

    public Double getFruitPrice() {
        return fruitPrice;
    }

    public void setFruitPrice(Double fruitPrice) {
        this.fruitPrice = fruitPrice;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Long getFruitId() {
        return fruitId;
    }

    public void setFruitId(Long fruitId) {
        this.fruitId = fruitId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
