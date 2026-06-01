package com.example.FujiFruit.controller;

import com.example.FujiFruit.DTO.OrderDTO;
import com.example.FujiFruit.DTO.ResponseDTO;
import com.example.FujiFruit.models.Order;
import com.example.FujiFruit.services.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.util.Map;

@Tag(name = "Orders API", description = "API for managing Orders")
@Slf4j
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get order details", description = "Fetch details of a specific order by ID")
    public ResponseEntity<ResponseDTO<OrderDTO>> getOrderDetails(
            @Parameter(description = "Authenticated user details") Authentication authentication,
            @PathVariable Long orderId) {
        String username = authentication.getName();
        OrderDTO order = orderService.getOrderDetails(username, orderId);
        return ResponseEntity.ok(ResponseDTO.success("Lấy chi tiết đơn hàng thành công", order));
    }

    @PutMapping("/{orderId}/cancel")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Cancel an order", description = "Cancel an order by ID")
    public ResponseEntity<ResponseDTO<String>> cancelOrder(@PathVariable Long orderId) {
        boolean success = orderService.cancelOrder(orderId);
        if (success) {
            return ResponseEntity.ok(ResponseDTO.success("Hủy đơn hàng thành công", null));
        } else {
            return ResponseEntity.badRequest().body(ResponseDTO.error("Không thể hủy đơn hàng"));
        }
    }
    @GetMapping("/admin/search")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Search orders", description = "Search orders by username, status, and date range (Admin only)")
    public ResponseEntity<ResponseDTO<Page<OrderDTO>>> searchOrders(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<OrderDTO> orderPage = orderService.searchOrders(username, status, startDate, endDate, page, size);
        return ResponseEntity.ok(ResponseDTO.success("Tìm kiếm đơn hàng thành công", orderPage));
    }

    @GetMapping("/admin")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "List all orders", description = "Fetch all orders with pagination (Admin only)")
    public ResponseEntity<ResponseDTO<Page<OrderDTO>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<OrderDTO> orderPage = orderService.getAllOrders(page, size);
        return ResponseEntity.ok(ResponseDTO.success("Lấy danh sách đơn hàng thành công", orderPage));
    }
    @PutMapping("/admin/{orderId}/status")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update order status", description = "Update the status of an order (Admin only)")
    public ResponseEntity<ResponseDTO<OrderDTO>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        try {
            OrderDTO updatedOrder = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(ResponseDTO.success("Cập nhật trạng thái đơn hàng thành công", updatedOrder));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ResponseDTO.error(e.getMessage()));
        }
    }
    @DeleteMapping("/admin/{orderId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete an order", description = "Delete an order by ID (Admin only)")
    public ResponseEntity<ResponseDTO<String>> deleteOrder(@PathVariable Long orderId) {
        boolean success = orderService.deleteOrder(orderId);
        if (success) {
            return ResponseEntity.ok(ResponseDTO.success("Xóa đơn hàng thành công", null));
        } else {
            return ResponseEntity.badRequest().body(ResponseDTO.error("Không thể xóa đơn hàng"));
        }
    }
    @GetMapping("/admin/{orderId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get detail order", description = "Get detail order(admin only)")
    public ResponseEntity<ResponseDTO<OrderDTO>> getOrderById(@PathVariable Long orderId) {
        OrderDTO order = orderService.getOrderById( orderId);
        return ResponseEntity.ok(ResponseDTO.success("Lấy chi tiết đơn hàng thành công", order));
    }

    @GetMapping("/admin/export")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<InputStreamResource> exportOrdersToExcel() {

        ByteArrayInputStream excelFile = orderService.exportOrdersToExcel();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=orders.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(excelFile));
    }
}