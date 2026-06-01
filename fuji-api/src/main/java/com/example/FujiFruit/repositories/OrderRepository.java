package com.example.FujiFruit.repositories;

import com.example.FujiFruit.models.Order;
import com.example.FujiFruit.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o WHERE " +
            "(:username IS NULL OR o.user.username LIKE %:username%) AND " +
            "(:status IS NULL OR o.status = :status) AND " +
            "(:startDate IS NULL OR o.orderDate >= :startDate) AND " +
            "(:endDate IS NULL OR o.orderDate <= :endDate)")
    Page<Order> searchOrders(
            @Param("username") String username,
            @Param("status") String status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    List<Order> findByUserUsername(String username);
    List<Order> findByUser(User user);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status IN ('SHIPPED', 'DELIVERED') AND (:startDate IS NULL OR o.orderDate >= :startDate) AND (:endDate IS NULL OR o.orderDate < :endDate)")
    double sumRevenueByStatus(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT o FROM Order o ORDER BY o.orderDate DESC")
    Page<Order> findTopRecentOrders(Pageable pageable);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status IN ('SHIPPED', 'DELIVERED') AND (:startDate IS NULL OR o.orderDate >= :startDate) AND (:endDate IS NULL OR o.orderDate < :endDate)")
    long countOrdersByStatus(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);


}
