package com.example.FujiFruit.controller;

import com.example.FujiFruit.DTO.CategoryDTO;
import com.example.FujiFruit.DTO.ResponseDTO;
import com.example.FujiFruit.services.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "Category API", description = "API for managing fruit categories")
@Validated
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get all categories with pagination", description = "Retrieve a paginated list of fruit categories")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List of categories retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid pagination parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ResponseDTO<Page<CategoryDTO>>> getAllCategories(
            @RequestParam(defaultValue = "0") @Min(0) @Parameter(description = "Page number, starting from 0") int page,
            @RequestParam(defaultValue = "10") @Min(1) @Parameter(description = "Number of items per page") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CategoryDTO> categoryPage = categoryService.getAllCategories(pageable);
        return ResponseEntity.ok(ResponseDTO.success("Lấy danh sách danh mục thành công", categoryPage));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID", description = "Retrieve detailed information of a category by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Category retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid category ID"),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<ResponseDTO<CategoryDTO>> getCategoryById(
            @PathVariable @Min(1) @Parameter(description = "ID of the category") Long id) {
        CategoryDTO category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ResponseDTO.success("Lấy thông tin danh mục thành công", category));
    }

    @PostMapping
    @Operation(summary = "Create a new category", description = "Create a new fruit category and save it to the database")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Category created successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ResponseDTO<CategoryDTO>> createCategory(
            @Valid @RequestBody @Parameter(description = "Category details") CategoryDTO categoryDTO) {
        CategoryDTO savedCategory = categoryService.createCategory(categoryDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResponseDTO.success("Tạo danh mục thành công", savedCategory));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a category", description = "Update the details of an existing category by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Category updated successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data or ID"),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<ResponseDTO<CategoryDTO>> updateCategory(
            @PathVariable @Min(1) @Parameter(description = "ID of the category") Long id,
            @Valid @RequestBody @Parameter(description = "Updated category details") CategoryDTO categoryDTO) {
        CategoryDTO updatedCategory = categoryService.updateCategory(id, categoryDTO);
        return ResponseEntity.ok(ResponseDTO.success("Cập nhật danh mục thành công", updatedCategory));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a category", description = "Delete a category by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Category deleted successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid category ID"),
            @ApiResponse(responseCode = "404", description = "Category not found"),
            @ApiResponse(responseCode = "409", description = "Category cannot be deleted due to associated fruits")
    })
    public ResponseEntity<ResponseDTO<Void>> deleteCategory(
            @PathVariable @Min(1) @Parameter(description = "ID of the category") Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ResponseDTO.success("Xóa danh mục thành công", null));
    }
}