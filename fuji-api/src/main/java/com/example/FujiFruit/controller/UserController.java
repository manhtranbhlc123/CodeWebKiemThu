package com.example.FujiFruit.controller;

import com.example.FujiFruit.DTO.*;
import com.example.FujiFruit.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Users API", description = "API for managing Users")
@Slf4j
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Existing APIs
    @GetMapping("/me")
    @Operation(summary = "Get user profile", description = "Fetch the profile of the authenticated user")
    public ResponseEntity<ResponseDTO<UserDTO>> getUserProfile(
            @Parameter(description = "Authenticated user details") Authentication authentication) {
        String username = authentication.getName();
        UserDTO user = userService.getUserProfile(username);
        return ResponseEntity.ok(ResponseDTO.success("Lấy thông tin cá nhân thành công", user));
    }

    @PutMapping("/me")
    @Operation(summary = "Update user profile", description = "Update the profile of the authenticated user")
    public ResponseEntity<ResponseDTO<UserDTO>> updateUserProfile(
            @Parameter(description = "Authenticated user details") Authentication authentication,
            @Valid @RequestBody UpdateUserRequest request) {
        String username = authentication.getName();
        UserDTO updatedUser = userService.updateUserProfile(username, request);
        return ResponseEntity.ok(ResponseDTO.success("Cập nhật thông tin cá nhân thành công", updatedUser));
    }

    @GetMapping("/orders")
    @Operation(summary = "Get user orders", description = "Fetch the order history of the authenticated user")
    public ResponseEntity<ResponseDTO<List<OrderDTO>>> getUserOrders(
            @Parameter(description = "Authenticated user details") Authentication authentication) {
        String username = authentication.getName();
        List<OrderDTO> orders = userService.getUserOrders(username);
        return ResponseEntity.ok(ResponseDTO.success("Lấy lịch sử đơn hàng thành công", orders));
    }

    @PutMapping("/change-password")
    @Operation(summary = "Change user password", description = "Change the password of the authenticated user")
    public ResponseEntity<ResponseDTO<String>> changePassword(
            @Parameter(description = "Authenticated user details") Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        String username = authentication.getName();
        userService.changePassword(username, request);
        return ResponseEntity.ok(ResponseDTO.success("Đổi mật khẩu thành công", null));
    }

    // New Admin APIs
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ROLE_ADMIN')")

    @Operation(summary = "Get all users", description = "Fetch a paginated list of all users (Admin only)")
    public ResponseEntity<ResponseDTO<List<UserDTO>>> getAllUsers(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of users per page") @RequestParam(defaultValue = "10") int size) {
        List<UserDTO> users = userService.getAllUsers(page, size);
        return ResponseEntity.ok(ResponseDTO.success("Lấy danh sách người dùng thành công", users));
    }

    @PutMapping("/admin/{id}/reset-password")
    @PreAuthorize("hasRole('ROLE_ADMIN')")

    @Operation(summary = "Reset user password", description = "Reset the password of a user by ID (Admin only)")
    public ResponseEntity<ResponseDTO<String>> resetPassword(
            @Parameter(description = "ID of the user to reset password") @PathVariable Long id) {
        String newPassword = userService.resetPassword(id);
        return ResponseEntity.ok(ResponseDTO.success("Đặt lại mật khẩu thành công", newPassword));
    }

    @GetMapping("/admin/search")
    @PreAuthorize("hasRole('ROLE_ADMIN')")

    @Operation(summary = "Search users", description = "Search users by name, email, or phone number (Admin only)")
    public ResponseEntity<ResponseDTO<List<UserDTO>>> searchUsers(
            @Parameter(description = "Search term (name, email, or phone)") @RequestParam String query) {
        List<UserDTO> users = userService.searchUsers(query);
        return ResponseEntity.ok(ResponseDTO.success("Tìm kiếm người dùng thành công", users));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")

    @Operation(summary = "Delete user account", description = "Delete a user account by ID (Admin only)")
    public ResponseEntity<ResponseDTO<String>> deleteUser(
            @Parameter(description = "ID of the user to delete") @PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ResponseDTO.success("Xóa tài khoản thành công", null));
    }
    @GetMapping("/admin/orders/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Get user orders by ID", description = "Fetch the order history of a user by ID (Admin only)")
    public ResponseEntity<ResponseDTO<List<OrderDTO>>> getUserOrdersById(
            @Parameter(description = "ID of the user to fetch orders") @PathVariable Long id) {
        List<OrderDTO> orders = userService.getUserOrdersById(id);
        return ResponseEntity.ok(ResponseDTO.success("Lấy lịch sử đơn hàng thành công", orders));
    }
}