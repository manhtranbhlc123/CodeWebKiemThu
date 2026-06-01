package com.example.FujiFruit.services;

import com.example.FujiFruit.DTO.*;
import com.example.FujiFruit.models.Order;
import com.example.FujiFruit.repositories.OrderRepository;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<OrderDTO> getRecentOrders() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "orderDate"));
        return orderRepository.findTopRecentOrders(pageable).getContent().stream()
                .map(this::mapToOrderDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderDetails(String username, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + orderId));
        if (!order.getUser().getUsername().equals(username)) {
            throw new IllegalAccessError("Bạn không có quyền xem đơn hàng này");
        }
        return mapToOrderDTO(order);
    }

    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + orderId));
        return mapToOrderDTO(order);
    }

    public boolean cancelOrder(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order with ID " + orderId + " not found"));
            if (!isCancellable(order)) {
                return false;
            }
            order.setStatus("CANCELLED");
            orderRepository.save(order);
            return true;
        } catch (IllegalArgumentException e) {
            System.err.println("Error cancelling order: " + e.getMessage());
            return false;
        }
    }

    public RevenueDTO calculateRevenue(LocalDateTime startDate, LocalDateTime endDate) {
        LocalDateTime adjustedStartDate = startDate != null
                ? startDate.withHour(0).withMinute(0).withSecond(0).withNano(0)
                : null;
        LocalDateTime adjustedEndDate = endDate != null
                ? endDate.withHour(23).withMinute(59).withSecond(59).withNano(999_999_999)
                : null;

        double totalRevenue = orderRepository.sumRevenueByStatus(adjustedStartDate, adjustedEndDate);
        long orderCount = orderRepository.countOrdersByStatus(adjustedStartDate, adjustedEndDate);
        double averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
        double previousRevenue = 0;
        if (adjustedStartDate != null && adjustedEndDate != null) {
            long days = java.time.temporal.ChronoUnit.DAYS.between(adjustedStartDate, adjustedEndDate);
            LocalDateTime prevStartDate = adjustedStartDate.minusDays(days)
                    .withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime prevEndDate = adjustedEndDate.minusDays(days)
                    .withHour(23).withMinute(59).withSecond(59).withNano(999_999_999);
            previousRevenue = orderRepository.sumRevenueByStatus(prevStartDate, prevEndDate);
        }
        String revenueChange = calculatePercentageChange(totalRevenue, previousRevenue);
        String formattedRevenue = formatCurrency(totalRevenue);
        String formattedAverageOrderValue = formatCurrency(averageOrderValue);
        String formattedStartDate = adjustedStartDate != null
                ? adjustedStartDate.format(DateTimeFormatter.ISO_LOCAL_DATE)
                : null;
        String formattedEndDate = adjustedEndDate != null
                ? adjustedEndDate.format(DateTimeFormatter.ISO_LOCAL_DATE)
                : null;
        return new RevenueDTO(formattedRevenue, formattedStartDate, formattedEndDate, orderCount, formattedAverageOrderValue, revenueChange);
    }

    public Page<OrderDTO> searchOrders(String username, String status, LocalDateTime startDate, LocalDateTime endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orderPage = orderRepository.searchOrders(username, status, startDate, endDate, pageable);
        return orderPage.map(this::mapToOrderDTO);
    }

    public Page<OrderDTO> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orderPage = orderRepository.findAll(pageable);
        return orderPage.map(this::mapToOrderDTO);
    }

    public OrderDTO updateOrderStatus(Long orderId, String newStatus) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order with ID " + orderId + " not found"));
            if (!isValidStatus(newStatus)) {
                throw new IllegalArgumentException("Invalid status: " + newStatus);
            }
            order.setStatus(newStatus.toUpperCase());
            Order updatedOrder = orderRepository.save(order);
            return mapToOrderDTO(updatedOrder);
        } catch (IllegalArgumentException e) {
            System.err.println("Error updating order status: " + e.getMessage());
            throw e;
        }
    }

    public boolean deleteOrder(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order with ID " + orderId + " not found"));
            orderRepository.delete(order);
            return true;
        } catch (IllegalArgumentException e) {
            System.err.println("Error deleting order: " + e.getMessage());
            return false;
        }
    }

    private boolean isCancellable(Order order) {
        return "PENDING".equalsIgnoreCase(order.getStatus()) ||
                "PROCESSING".equalsIgnoreCase(order.getStatus());
    }

    private boolean isValidStatus(String status) {
        return List.of("PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED")
                .contains(status.toUpperCase());
    }

    private String calculatePercentageChange(double current, double previous) {
        if (previous == 0) {
            return current > 0 ? "+100%" : "0%";
        }
        double change = ((current - previous) / previous) * 100;
        DecimalFormat df = new DecimalFormat("+0.0;-0.0");
        return df.format(change) + "%";
    }

    private String formatCurrency(double amount) {
        DecimalFormat df = new DecimalFormat("#,### ₫");
        return df.format(amount);
    }

    private OrderDTO mapToOrderDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(order.getId());
        orderDTO.setOrderDate(order.getOrderDate());
        orderDTO.setTotalAmount(order.getTotalAmount());
        orderDTO.setStatus(order.getStatus());
        orderDTO.setShippingAddress(order.getShippingAddress());
        orderDTO.setPaymentMethod(order.getPaymentMethod());
        orderDTO.setRecipientName(order.getRecipientName());
        orderDTO.setPhoneNumber(order.getPhoneNumber());
        orderDTO.setPaymentStatus(order.getPaymentStatus());
        UserDTO userDTO = new UserDTO();
        userDTO.setId(order.getUser().getId());
        userDTO.setUsername(order.getUser().getUsername());
        userDTO.setEmail(order.getUser().getEmail());
        orderDTO.setUser(userDTO);

        orderDTO.setItems(order.getItems().stream()
                .map(item -> {
                    OrderItemDTO itemDTO = new OrderItemDTO();
                    itemDTO.setId(item.getId());
                    itemDTO.setQuantity(item.getQuantity());
                    itemDTO.setPrice(item.getPrice());

                    FruitDTO fruitDTO = new FruitDTO();
                    fruitDTO.setId(item.getFruit().getId());
                    fruitDTO.setName(item.getFruit().getName());
                    fruitDTO.setPrice(item.getFruit().getPrice());
                    fruitDTO.setImage(item.getFruit().getImage());
                    itemDTO.setFruit(fruitDTO);
                    return itemDTO;
                })
                .collect(Collectors.toList()));

        return orderDTO;
    }

    private String mapStatusToVietnamese(String status) {
        switch (status.toUpperCase()) {
            case "PENDING":
                return "Đang xử lý";
            case "PROCESSING":
                return "Đang xử lý";
            case "SHIPPED":
                return "Đang giao";
            case "DELIVERED":
                return "Hoàn thành";
            case "CANCELLED":
                return "Đã hủy";
            default:
                return status;
        }
    }

    public ByteArrayInputStream exportOrdersToExcel() {
        List<OrderDTO> orders = orderRepository.findAll()
                .stream()
                .map(this::mapToOrderDTO)
                .toList();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Orders");

            // ===== Header =====
            Row headerRow = sheet.createRow(0);
            String[] headers = {
                    "Order ID",
                    "Order Date",
                    "Payment Method",
                    "Phone Number",
                    "Recipient Name",
                    "Shipping Address",
                    "Status",
                    "Total Amount",
            };

            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            // ===== Data =====
            int rowIdx = 1;
            for (OrderDTO order : orders) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(order.getId());
                row.createCell(1).setCellValue(order.getOrderDate().toString());
                row.createCell(2).setCellValue(order.getPaymentMethod());
                row.createCell(3).setCellValue(order.getPhoneNumber());
                row.createCell(4).setCellValue(order.getRecipientName());
                row.createCell(5).setCellValue(order.getShippingAddress());
                row.createCell(6).setCellValue(order.getStatus());
                row.createCell(7).setCellValue(order.getTotalAmount());
            }

            // Auto size
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi xuất file Excel", e);
        }
    }
}