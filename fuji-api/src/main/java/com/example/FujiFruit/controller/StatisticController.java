package com.example.FujiFruit.controller;

import com.example.FujiFruit.DTO.OrderDTO;
import com.example.FujiFruit.DTO.RevenueDTO;
import com.example.FujiFruit.DTO.ResponseDTO;
import com.example.FujiFruit.services.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@Tag(name = "Statistics", description = "APIs for statistical data")
public class StatisticController {
    private final OrderService orderService;

    @Autowired
    public StatisticController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/revenue")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Calculate revenue", description = "Calculates total revenue, order count, average order value, and revenue change for orders with SHIPPED or DELIVERED status")
    public ResponseEntity<ResponseDTO<RevenueDTO>> getRevenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        RevenueDTO revenue = orderService.calculateRevenue(startDate, endDate);
        return ResponseEntity.ok(ResponseDTO.success("Lấy dữ liệu doanh thu thành công", revenue));
    }

    @GetMapping("/recent-orders")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get recent orders", description = "Fetches the top 10 most recent orders")
    public ResponseEntity<ResponseDTO<List<OrderDTO>>> getRecentOrders() {
        List<OrderDTO> recentOrders = orderService.getRecentOrders();
        return ResponseEntity.ok(ResponseDTO.success("Lấy danh sách đơn hàng gần đây thành công", recentOrders));
    }
}