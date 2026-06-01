package com.example.FujiFruit.services;

import com.example.FujiFruit.DTO.CategoryDTO;
import com.example.FujiFruit.DTO.CategoryNew;
import com.example.FujiFruit.DTO.NewsDTO;
import com.example.FujiFruit.models.Category;
import com.example.FujiFruit.models.News;
import com.example.FujiFruit.repositories.CategoryRepository;
import com.example.FujiFruit.repositories.FruitRepository;
import com.example.FujiFruit.repositories.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class NewsService {

    @Autowired
    private NewsRepository newsRepository;


    public Page<NewsDTO> getNews(int page, int size, String category) {
        Pageable pageable = PageRequest.of(page, size);
        Page<News> newsPage = category != null
                ? newsRepository.findByCategory(category, pageable)
                : newsRepository.findAll(pageable);
        return newsPage.map(this::mapToNewsDTO);
    }

    public Page<Map<String, Object>> getCategoryInNews(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Object[]> categoryPage = newsRepository.getCategoryInNews(pageable);

        List<Map<String, Object>> categoryList = categoryPage.getContent().stream()
                .map(objects -> {
                    Map<String, Object> categoryMap = new HashMap<>();
                    categoryMap.put("name", objects[0]);
                    categoryMap.put("count", objects[1]);
                    return categoryMap;
                })
                .collect(Collectors.toList());
        return new PageImpl<>(categoryList, pageable, categoryPage.getTotalElements());
    }
    public  NewsDTO getNewsBySlug(String slug){
        News news = newsRepository.findBySlug(slug);
        return this.mapToNewsDTO(news);
    }
    public List<NewsDTO> getRelatedNews(String category, String slug, int limit) {
        return newsRepository.findByCategoryAndSlugNot(category, slug, PageRequest.of(0, limit))
                .stream()
                .map(this::mapToNewsDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public NewsDTO createNews(NewsDTO newsDTO) {
        News news = new News();
        news.setTitle(newsDTO.getTitle());
        news.setSlug(newsDTO.getSlug());
        news.setExcerpt(newsDTO.getExcerpt());
        news.setContent(newsDTO.getContent());
        news.setImage(newsDTO.getImage());
        news.setDate(newsDTO.getDate() != null ? newsDTO.getDate() : LocalDate.now());
        if (newsDTO.getCategory() != null) {
            news.setCategory(newsDTO.getCategory());
        }
        News savedNews = newsRepository.save(news);
        return mapToNewsDTO(savedNews);
    }

    @Transactional
    public NewsDTO updateNews(Long id, NewsDTO newsDTO) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tin tức với ID: " + id));
        news.setTitle(newsDTO.getTitle());
        news.setSlug(newsDTO.getSlug());
        news.setExcerpt(newsDTO.getExcerpt());
        news.setContent(newsDTO.getContent());
        news.setImage(newsDTO.getImage());
        news.setDate(newsDTO.getDate());
        if (newsDTO.getCategory() != null) {
            news.setCategory(newsDTO.getCategory());
        }
        News updatedNews = newsRepository.save(news);
        return mapToNewsDTO(updatedNews);
    }

    @Transactional
    public void deleteNews(Long id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tin tức với ID: " + id));
        newsRepository.delete(news);
    }

    public Page<NewsDTO> searchNews(String title, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<News> newsPage = newsRepository.findByTitleContainingIgnoreCase(title, pageable);
        return newsPage.map(this::mapToNewsDTO);
    }

    public String uploadImage(MultipartFile file) {
        try {
            String uploadDir = "uploads/images/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, file.getBytes());
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi tải ảnh lên: " + e.getMessage());
        }
    }

    private NewsDTO mapToNewsDTO(News news) {
        NewsDTO dto = new NewsDTO();
        dto.setId(news.getId());
        dto.setTitle(news.getTitle());
        dto.setSlug(news.getSlug());
        dto.setExcerpt(news.getExcerpt());
        dto.setContent(news.getContent());
        dto.setImage(news.getImage());
        dto.setDate(news.getDate());
        dto.setCategory(news.getCategory() != null ? news.getCategory() : null);
        return dto;
    }
}