package com.example.FujiFruit.controller;

import com.example.FujiFruit.DTO.FruitDTO;
import com.example.FujiFruit.DTO.ResponseDTO;
import com.example.FujiFruit.services.FruitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/fruits")
@Tag(name = "Fruit API", description = "API for managing fruits")
@Slf4j
@Validated
public class FruitController {

    @Value("${upload.dir:uploads/images/}")
    private String uploadDir;

    @Autowired
    private FruitService fruitService;

    @GetMapping
    @Operation(summary = "Get all fruits with pagination", description = "Retrieve a paginated list of fruits")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List of fruits retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid pagination parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ResponseDTO<Page<FruitDTO>>> getAllFruits(
            @RequestParam(defaultValue = "0") @Min(0) @Parameter(description = "Page number, starting from 0") int page,
            @RequestParam(defaultValue = "10") @Min(1) @Parameter(description = "Number of items per page") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FruitDTO> fruitPage = fruitService.getAllFruits(pageable);
        return ResponseEntity.ok(ResponseDTO.success("Lấy danh sách hoa quả thành công", fruitPage));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get fruit by ID", description = "Retrieve detailed information of a fruit by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Fruit retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Fruit not found"),
            @ApiResponse(responseCode = "400", description = "Invalid fruit ID")
    })
    public ResponseEntity<ResponseDTO<FruitDTO>> getFruitById(
            @PathVariable @Min(1) @Parameter(description = "ID of the fruit") Long id) {
        FruitDTO fruit = fruitService.getFruitById(id);
        return ResponseEntity.ok(ResponseDTO.success("Lấy thông tin hoa quả thành công", fruit));
    }

    @GetMapping("/{id}/related")
    @Operation(summary = "Get related fruits by fruit ID", description = "Retrieve a paginated list of fruits in the same category as the specified fruit")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Related fruits retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid fruit ID or pagination parameters"),
            @ApiResponse(responseCode = "404", description = "Fruit or related fruits not found")
    })
    public ResponseEntity<ResponseDTO<Page<FruitDTO>>> getRelatedFruitsByFruitId(
            @PathVariable @Min(1) @Parameter(description = "ID of the fruit") Long id,
            @RequestParam(defaultValue = "0") @Min(0) @Parameter(description = "Page number") int page,
            @RequestParam(defaultValue = "4") @Min(1) @Parameter(description = "Number of items per page") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FruitDTO> relatedFruits = fruitService.getRelatedFruitsByFruitId(id, pageable);
        String message = relatedFruits.isEmpty() ? "Không tìm thấy sản phẩm liên quan trong danh mục" : "Lấy danh sách hoa quả cùng danh mục thành công";
        return ResponseEntity.ok(ResponseDTO.success(message, relatedFruits));
    }

//    @GetMapping("/search")
//    @Operation(summary = "Search fruits by name", description = "Retrieve a paginated list of fruits matching the given name")
//    @ApiResponses({
//            @ApiResponse(responseCode = "200", description = "Fruits retrieved successfully",
//                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
//            @ApiResponse(responseCode = "400", description = "Invalid search parameters"),
//            @ApiResponse(responseCode = "500", description = "Internal server error")
//    })
//    public ResponseEntity<ResponseDTO<Page<FruitDTO>>> searchFruits(
//            @RequestParam @Parameter(description = "Name to search for") String name,
//            @RequestParam(defaultValue = "0") @Min(0) @Parameter(description = "Page number") int page,
//            @RequestParam(defaultValue = "10") @Min(1) @Parameter(description = "Number of items per page") int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        Page<FruitDTO> fruits = fruitService.getFruitsByName(pageable, name);
//        return ResponseEntity.ok(ResponseDTO.success("Tìm kiếm hoa quả thành công", fruits));
//    }

    @GetMapping("/search")
    @Operation(summary = "Search fruits", description = "Search fruits by name and optional price range"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Fruits retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid search parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ResponseDTO<Page<FruitDTO>>> searchFruits(
            @RequestParam(required = false)
            @Parameter(description = "Name to search for")
            String name,

            @RequestParam(required = false)
            @Parameter(description = "Minimum price")
            Double minPrice,

            @RequestParam(required = false)
            @Parameter(description = "Maximum price")
            Double maxPrice,

            @RequestParam(defaultValue = "0")
            @Min(0)
            @Parameter(description = "Page number")
            int page,

            @RequestParam(defaultValue = "10")
            @Min(1)
            @Parameter(description = "Number of items per page")
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size);

        Page<FruitDTO> fruits = fruitService.getFruitsByName(
                pageable,
                name,
                minPrice,
                maxPrice
        );

        return ResponseEntity.ok(
                ResponseDTO.success("Tìm kiếm hoa quả thành công", fruits)
        );
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Filter fruits by category", description = "Retrieve a paginated list of fruits belonging to the specified category")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Fruits retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid category ID or pagination parameters"),
            @ApiResponse(responseCode = "404", description = "Category not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ResponseDTO<Page<FruitDTO>>> getFruitsByCategory(
            @PathVariable @Min(1) @Parameter(description = "ID of the category") Long categoryId,
            @RequestParam(defaultValue = "0") @Min(0) @Parameter(description = "Page number") int page,
            @RequestParam(defaultValue = "10") @Min(1) @Parameter(description = "Number of items per page") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FruitDTO> fruits = fruitService.getFruitsByCategory(categoryId, pageable);
        String message = fruits.isEmpty() ? "Không tìm thấy hoa quả trong danh mục" : "Lấy danh sách hoa quả theo danh mục thành công";
        return ResponseEntity.ok(ResponseDTO.success(message, fruits));
    }

    @PostMapping
    @Operation(summary = "Create a new fruit", description = "Create a new fruit and save it to the database")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Fruit created successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ResponseDTO<FruitDTO>> createFruit(
            @Valid @RequestBody @Parameter(description = "Fruit details") FruitDTO fruitDTO) {
        FruitDTO savedFruit = fruitService.createFruit(fruitDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResponseDTO.success("Tạo hoa quả thành công", savedFruit));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a fruit", description = "Update the details of an existing fruit by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Fruit updated successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data or ID"),
            @ApiResponse(responseCode = "404", description = "Fruit not found")
    })
    public ResponseEntity<ResponseDTO<FruitDTO>> updateFruit(
            @PathVariable @Min(1) @Parameter(description = "ID of the fruit") Long id,
            @Valid @RequestBody @Parameter(description = "Updated fruit details") FruitDTO fruitDTO) {
        FruitDTO updatedFruit = fruitService.updateFruit(id, fruitDTO);
        return ResponseEntity.ok(ResponseDTO.success("Cập nhật hoa quả thành công", updatedFruit));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a fruit", description = "Delete a fruit by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Fruit deleted successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid fruit ID"),
            @ApiResponse(responseCode = "404", description = "Fruit not found")
    })
    public ResponseEntity<ResponseDTO<Void>> deleteFruit(
            @PathVariable @Min(1) @Parameter(description = "ID of the fruit") Long id) {
        fruitService.deleteFruit(id);
        return ResponseEntity.ok(ResponseDTO.success("Xóa hoa quả thành công", null));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload fruit image", description = "Upload an image file for a fruit")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Image uploaded successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid or empty file"),
            @ApiResponse(responseCode = "500", description = "Error saving file")
    })
    public ResponseEntity<ResponseDTO<String>> uploadImage(
            @RequestPart("file") @Parameter(description = "Image file (PNG, JPEG)") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ResponseDTO.error("Tệp hình ảnh không được để trống"));
        }
        if (isImageFile(file)) {
            return ResponseEntity.badRequest()
                    .body(ResponseDTO.error("Chỉ hỗ trợ tệp PNG hoặc JPEG"));
        }

        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());

            String imageUrl = "/images/" + fileName;
            return ResponseEntity.ok(ResponseDTO.success("Tải lên hình ảnh thành công", imageUrl));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDTO.error("Lỗi khi lưu tệp: " + e.getMessage()));
        }
    }

    @PutMapping(value = "/upload/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update fruit image", description = "Upload a new image for an existing fruit by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Image updated successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid or empty file or ID"),
            @ApiResponse(responseCode = "404", description = "Fruit not found"),
            @ApiResponse(responseCode = "500", description = "Error saving file")
    })
    public ResponseEntity<ResponseDTO<String>> updateImage(
            @PathVariable @Min(1) @Parameter(description = "ID of the fruit") Long id,
            @RequestPart("file") @Parameter(description = "New image file (PNG, JPEG)") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ResponseDTO.error("Tệp hình ảnh không được để trống"));
        }
        if (isImageFile(file)) {
            return ResponseEntity.badRequest()
                    .body(ResponseDTO.error("Chỉ hỗ trợ tệp PNG hoặc JPEG"));
        }

        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());

            String imageUrl = "/images/" + fileName;
            fruitService.updateImage(id, imageUrl);
            return ResponseEntity.ok(ResponseDTO.success("Cập nhật hình ảnh thành công", imageUrl));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDTO.error("Lỗi khi lưu tệp: " + e.getMessage()));
        }
    }

    private boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType == null || (!contentType.equals("image/png") && !contentType.equals("image/jpeg"));
    }
}