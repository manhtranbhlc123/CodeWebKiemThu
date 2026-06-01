package com.example.FujiFruit.controller;

import com.example.FujiFruit.DTO.CategoryNew;
import com.example.FujiFruit.DTO.NewsDTO;
import com.example.FujiFruit.DTO.ResponseDTO;
import com.example.FujiFruit.services.NewsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Objects;
@Tag(name = "News API", description = "API for managing News")
@Slf4j
@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @GetMapping
    @Operation(summary = "Get paginated news articles", description = "Fetch news articles with optional category filter")
    public ResponseEntity<ResponseDTO<Page<NewsDTO>>> getNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(required = false) String category) {
        Page<NewsDTO> newsPage = newsService.getNews(page, size, category);
        return ResponseEntity.ok(ResponseDTO.success("Lấy danh sách tin tức thành công", newsPage));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get news article by slug", description = "Fetch a single news article by its slug")
    public ResponseEntity<ResponseDTO<NewsDTO>> getNewsBySlug(
            @PathVariable(required = false) String slug) {
        NewsDTO newsDTO = newsService.getNewsBySlug(slug);
        return ResponseEntity.ok(ResponseDTO.success("Lấy tin tức thành công", newsDTO));
    }

    @GetMapping("/related")
    @Operation(summary = "Get related news articles", description = "Fetch related news articles by category, excluding the article with the provided slug")
    public ResponseEntity<ResponseDTO<List<NewsDTO>>> getRelatedNews(
            @RequestParam String category,
            @RequestParam(required = false) String slug,
            @RequestParam(defaultValue = "3") int limit) {
        List<NewsDTO> relatedNews = newsService.getRelatedNews(category, slug, limit);
        return ResponseEntity.ok(ResponseDTO.success("Lấy danh sách tin tức liên quan thành công", relatedNews));
    }

    @PostMapping("/admin")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a news article", description = "Create a new news article (Admin only)")
    public ResponseEntity<ResponseDTO<NewsDTO>> createNews(@RequestBody NewsDTO newsDTO) {
        NewsDTO createdNews = newsService.createNews(newsDTO);
        return ResponseEntity.ok(ResponseDTO.success("Tạo tin tức thành công", createdNews));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update a news article", description = "Update an existing news article (Admin only)")
    public ResponseEntity<ResponseDTO<NewsDTO>> updateNews(@PathVariable Long id, @RequestBody NewsDTO newsDTO) {
        NewsDTO updatedNews = newsService.updateNews(id, newsDTO);
        return ResponseEntity.ok(ResponseDTO.success("Cập nhật tin tức thành công", updatedNews));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete a news article", description = "Delete a news article by ID (Admin only)")
    public ResponseEntity<ResponseDTO<String>> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.ok(ResponseDTO.success("Xóa tin tức thành công", null));
    }

    @GetMapping("/admin/search")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Search news articles", description = "Search news articles by title (Admin only)")
    public ResponseEntity<ResponseDTO<Page<NewsDTO>>> searchNews(
            @RequestParam String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<NewsDTO> newsPage = newsService.searchNews(title, page, size);
        return ResponseEntity.ok(ResponseDTO.success("Tìm kiếm tin tức thành công", newsPage));
    }

    @PostMapping("/admin/upload")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResponseDTO<String>> uploadNewsImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ResponseDTO.error("File không được để trống"));
        }
        if (!Objects.requireNonNull(file.getContentType()).startsWith("image/")) {
            return ResponseEntity.badRequest()
                    .body(ResponseDTO.error("Chỉ chấp nhận file ảnh"));
        }
        String imagePath = newsService.uploadImage(file);
        return ResponseEntity.ok(ResponseDTO.success("Tải ảnh lên thành công", imagePath));
    }
    @GetMapping("/categories")
    public ResponseEntity<ResponseDTO<Page<Map<String, Object>>>> getCategoriesInNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Map<String, Object>> pageCategories = newsService.getCategoryInNews(page, size);
        return ResponseEntity.ok(ResponseDTO.success("Lấy danh sách danh mục thành công", pageCategories));
    }
}