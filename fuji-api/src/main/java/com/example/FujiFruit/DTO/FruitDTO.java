package com.example.FujiFruit.DTO;

import com.example.FujiFruit.models.Category;
import com.example.FujiFruit.models.Fruit;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Schema(description = "DTO cho đối tượng hoa quả trong cửa hàng")
public class FruitDTO {

    @Schema(description = "ID duy nhất của hoa quả", example = "1")
    private Long id;

    @NotBlank(message = "Tên không được để trống")
    @Schema(description = "Tên của hoa quả", example = "Mango", required = true)
    private String name;

    @Positive(message = "Giá phải là số dương")
    @Schema(description = "Giá của hoa quả (USD)", example = "2.5", required = true)
    private double price;

    @PositiveOrZero(message = "Số lượng phải là số không âm")
    @Schema(description = "Số lượng tồn kho", example = "100", required = true)
    private int quantity;

    @Schema(description = "URL hoặc tên file ảnh của hoa quả", example = "mango.jpg")
    private String image;

    @Schema(description = "Mô tả chi tiết về hoa quả", example = "Sweet mangoes")
    private String description;

    @NotEmpty(message = "Danh mục không được để trống")
    @Schema(description = "Danh sách danh mục của hoa quả", example = "[\"Trái cây nhiệt đới\", \"Trái cây nhập khẩu\"]", required = true)
    private List<Category> categories = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public LocalDate getImportDate() {
        return importDate;
    }

    public void setImportDate(LocalDate importDate) {
        this.importDate = importDate;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public Fruit.StockStatus getStockStatus() {
        return stockStatus;
    }

    public void setStockStatus(Fruit.StockStatus stockStatus) {
        this.stockStatus = stockStatus;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }

    @Schema(description = "Danh sách thẻ mô tả hoa quả", example = "[\"ngọt\", \"thơm\"]")
    private List<String> tags;

    @PastOrPresent(message = "Ngày nhập hàng phải là hôm nay hoặc trong quá khứ")
    @Schema(description = "Ngày nhập hàng của hoa quả", example = "2025-04-26")
    private LocalDate importDate;

    @Schema(description = "Nguồn gốc của hoa quả", example = "Thailand")
    private String origin;

    @Positive(message = "Trọng lượng phải là số dương")
    @Schema(description = "Trọng lượng trung bình của hoa quả (kg)", example = "0.5")
    private double weight;

    @NotNull(message = "Trạng thái tồn kho không được để trống")
    @Schema(description = "Trạng thái tồn kho", example = "IN_STOCK", allowableValues = {"IN_STOCK", "OUT_OF_STOCK", "LOW_STOCK"}, required = true)
    private Fruit.StockStatus stockStatus;

    @DecimalMin(value = "0.0", message = "Đánh giá phải từ 0 đến 5")
    @DecimalMax(value = "5.0", message = "Đánh giá phải từ 0 đến 5")
    @Schema(description = "Đánh giá trung bình của hoa quả (0-5)", example = "4.5")
    private double averageRating;

    @DecimalMin(value = "0.0", message = "Giảm giá phải từ 0 đến 1")
    @DecimalMax(value = "1.0", message = "Giảm giá phải từ 0 đến 1")
    @Schema(description = "Phần trăm giảm giá (0-1)", example = "0.1")
    private double discount;
}