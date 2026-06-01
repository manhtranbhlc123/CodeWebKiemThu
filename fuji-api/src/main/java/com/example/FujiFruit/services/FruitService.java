package com.example.FujiFruit.services;

import com.example.FujiFruit.DTO.FruitDTO;
import com.example.FujiFruit.models.Category;
import com.example.FujiFruit.models.Fruit;
import com.example.FujiFruit.repositories.CategoryRepository;
import com.example.FujiFruit.repositories.FruitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.module.ResolutionException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FruitService {

    @Autowired
    private FruitRepository fruitRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public Page<FruitDTO> getAllFruits(Pageable pageable) {
        Page<Fruit> fruitPage = fruitRepository.findAll(pageable);
        return fruitPage.map(this::convertToDTO);
    }

    public Page<FruitDTO> getFruitsByName(
            Pageable pageable,
            String keyword,
            Double minPrice,
            Double maxPrice
    ) {
        Page<Fruit> fruitPage = fruitRepository.findByNameAndPrice(
                (keyword == null || keyword.isBlank()) ? null : keyword,
                minPrice,
                maxPrice,
                pageable
        );

        return fruitPage.map(this::convertToDTO);
    }


    public FruitDTO getFruitById(Long id) {
        Fruit fruit = fruitRepository.findById(id)
                .orElseThrow(() -> new ResolutionException("Không tìm thấy hoa quả với ID: " + id));
        return convertToDTO(fruit);
    }

    public FruitDTO createFruit(FruitDTO fruitDTO) {
        Fruit fruit = convertToEntity(fruitDTO);
        fruit = fruitRepository.save(fruit);
        return convertToDTO(fruit);
    }

    public FruitDTO updateImage(Long id, String imagePath){
        Fruit existingFruit = fruitRepository.findById(id)
                .orElseThrow(() -> new ResolutionException("Không tìm thấy hoa quả với ID: " + id));
        existingFruit.setImage(imagePath);
        Fruit updatedFruit = fruitRepository.save(existingFruit);
        return convertToDTO(updatedFruit);
    }

    public FruitDTO updateFruit(Long id, FruitDTO fruitDTO) {
        Fruit existingFruit = fruitRepository.findById(id)
                .orElseThrow(() -> new ResolutionException("Không tìm thấy hoa quả với ID: " + id));

        existingFruit.setName(fruitDTO.getName());
        existingFruit.setPrice(fruitDTO.getPrice());
        existingFruit.setQuantity(fruitDTO.getQuantity());
        existingFruit.setImage(fruitDTO.getImage());
        existingFruit.setDescription(fruitDTO.getDescription());
        existingFruit.setCategories(fruitDTO.getCategories());
        existingFruit.setTags(fruitDTO.getTags());
        existingFruit.setImportDate(fruitDTO.getImportDate());
        existingFruit.setOrigin(fruitDTO.getOrigin());
        existingFruit.setWeight(fruitDTO.getWeight());
        existingFruit.setStockStatus(fruitDTO.getStockStatus());
        existingFruit.setAverageRating(fruitDTO.getAverageRating());
        existingFruit.setDiscount(fruitDTO.getDiscount());

        Fruit updatedFruit = fruitRepository.save(existingFruit);
        return convertToDTO(updatedFruit);
    }

    public void deleteFruit(Long id) {
        Fruit fruit = fruitRepository.findById(id)
                .orElseThrow(() -> new ResolutionException("Không tìm thấy hoa quả với ID: " + id));
        fruitRepository.delete(fruit);
    }


    public Page<FruitDTO> getFruitsByCategory(Long id, Pageable pageable) {
        Page<Fruit> fruitPage = fruitRepository.findByCategories_Id(id, pageable);
        return fruitPage.map(this::convertToDTO);
    }
    public boolean categoryExists(String categoryName) {
        return categoryRepository.existsByName(categoryName);
    }
    public Page<FruitDTO> getRelatedFruitsByFruitId(Long fruitId, Pageable pageable) {
        Fruit fruit = fruitRepository.findById(fruitId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm với ID: " + fruitId));

        String categoryName = fruit.getCategories().stream()
                .findFirst()
                .map(Category::getName)
                .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không thuộc danh mục nào"));
        Page<Fruit> relatedFruits = fruitRepository.findByCategories_NameAndIdNot(categoryName, fruitId, pageable);
        return relatedFruits.map(this::convertToDTO);
    }
    private FruitDTO convertToDTO(Fruit fruit) {
        FruitDTO fruitDTO = new FruitDTO();
        fruitDTO.setId(fruit.getId());
        fruitDTO.setName(fruit.getName());
        fruitDTO.setPrice(fruit.getPrice());
        fruitDTO.setQuantity(fruit.getQuantity());
        fruitDTO.setImage(fruit.getImage());
        fruitDTO.setDescription(fruit.getDescription());
        fruitDTO.setCategories(fruit.getCategories());
        fruitDTO.setTags(fruit.getTags());
        fruitDTO.setImportDate(fruit.getImportDate());
        fruitDTO.setOrigin(fruit.getOrigin());
        fruitDTO.setWeight(fruit.getWeight());
        fruitDTO.setStockStatus(fruit.getStockStatus());
        fruitDTO.setAverageRating(fruit.getAverageRating());
        fruitDTO.setDiscount(fruit.getDiscount());
        return fruitDTO;
    }

    private Fruit convertToEntity(FruitDTO fruitDTO) {
        Fruit fruit = new Fruit();
        fruit.setId(fruitDTO.getId());
        fruit.setName(fruitDTO.getName());
        fruit.setPrice(fruitDTO.getPrice());
        fruit.setQuantity(fruitDTO.getQuantity());
        fruit.setImage(fruitDTO.getImage());
        fruit.setDescription(fruitDTO.getDescription());
        fruit.setCategories(fruitDTO.getCategories());
        fruit.setTags(fruitDTO.getTags());
        fruit.setImportDate(fruitDTO.getImportDate());
        fruit.setOrigin(fruitDTO.getOrigin());
        fruit.setWeight(fruitDTO.getWeight());
        fruit.setStockStatus(fruitDTO.getStockStatus());
        fruit.setAverageRating(fruitDTO.getAverageRating());
        fruit.setDiscount(fruitDTO.getDiscount());
        return fruit;
    }

    private List<Category> convertCategories(List<String> categoryNames) {
        if (categoryNames == null) return new ArrayList<>();
        return categoryNames.stream()
                .map(name -> categoryRepository.findByName(name)
                        .orElseGet(() -> {
                            Category newCategory = new Category();
                            newCategory.setName(name);
                            return categoryRepository.save(newCategory);
                        }))
                .collect(Collectors.toList());
    }
}