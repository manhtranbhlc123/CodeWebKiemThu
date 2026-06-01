package com.example.FujiFruit.repositories;

import com.example.FujiFruit.models.Fruit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FruitRepository extends JpaRepository<Fruit, Long> {
    Page<Fruit> findByCategories_Name(String categoryName, Pageable pageable);
    Page<Fruit> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Fruit> findByCategories_NameAndIdNot(String categoryName, Long id, Pageable pageable);
    Page<Fruit> findByCategories_Id(Long categoryID, Pageable pageable);

    @Query("""
        SELECT f FROM Fruit f
        WHERE (:keyword IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:minPrice IS NULL OR f.price >= :minPrice)
        AND (:maxPrice IS NULL OR f.price <= :maxPrice)
    """)
    Page<Fruit> findByNameAndPrice(
            @Param("keyword") String keyword,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            Pageable pageable
    );
}