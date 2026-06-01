package com.example.FujiFruit.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;

@Data
@Schema(description = "DTO cho danh mục hoa quả")
public class CategoryDTO {

    private Long id;

    private String description;

    @NotBlank(message = "Tên danh mục không được để trống")
    @Schema(description = "Tên danh mục", example = "Trái cây nhiệt đới")
    private String name;

    public CategoryDTO() {
    }

    public CategoryDTO(Long id, String description, String name) {
        this.id = id;
        this.description = description;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}