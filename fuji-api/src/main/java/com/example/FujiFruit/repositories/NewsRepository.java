package com.example.FujiFruit.repositories;

import com.example.FujiFruit.DTO.CategoryNew;
import com.example.FujiFruit.models.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NewsRepository extends JpaRepository<News, Long> {
    Page<News> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Page<News> findByCategory(String category, Pageable pageable);
    News findBySlug(String slug);
    Page<News> findByCategoryAndSlugNot(String category, String slug, Pageable pageable);
    @Query("SELECT n.category, COUNT(n) FROM News n WHERE n.category IS NOT NULL GROUP BY n.category ORDER BY n.category")
    Page<Object[]> getCategoryInNews(Pageable pageable);
}