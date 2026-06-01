package com.example.FujiFruit.controller;

import com.example.FujiFruit.DTO.JwtResponse;
import com.example.FujiFruit.DTO.LoginRequest;
import com.example.FujiFruit.DTO.RegisterRequest;
import com.example.FujiFruit.DTO.ResponseDTO;
import com.example.FujiFruit.DTO.VerifyResponse;
import com.example.FujiFruit.security.JwtUtil;
import com.example.FujiFruit.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth API", description = "API for user registration and authentication")
@Validated
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Create a new user account with username, password, and email")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User registered successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data or username/email already exists"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ResponseDTO<String>> register(
            @Valid @RequestBody @Parameter(description = "User registration details") RegisterRequest registerRequest) {
        authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResponseDTO.success("Đăng ký người dùng thành công", null));
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return a JWT token")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login successful, JWT token returned"),
            @ApiResponse(responseCode = "401", description = "Invalid username or password")
    })
    public ResponseEntity<?> login(
            @Valid @RequestBody @Parameter(description = "User login credentials") LoginRequest loginRequest) {
        
        try {
            // Thử xác thực người dùng
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            
            // Nếu thành công -> tạo token
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtil.generateToken(authentication);
            return ResponseEntity.ok(ResponseDTO.success("Đăng nhập thành công", new JwtResponse(jwt)));
            
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            // NẾU SAI MẬT KHẨU HOẶC TÀI KHOẢN KHÔNG TỒN TẠI
            // Trả về HTTP 401 thay vì để Spring tự văng lỗi 403
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseDTO.error("Sai tên đăng nhập hoặc mật khẩu!"));
                    
        } catch (Exception e) {
            // Bắt các lỗi hệ thống khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDTO.error("Lỗi đăng nhập: " + e.getMessage()));
        }
    }

    @GetMapping("/verify")
    @Operation(summary = "Verify JWT token", description = "Validate JWT token and return username and roles")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token is valid, user info returned",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Invalid or expired token"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResponseDTO<VerifyResponse>> verifyToken(
            @Parameter(description = "Authenticated user details") Authentication authentication) {
        String username = authentication.getName();
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        VerifyResponse verifyResponse = new VerifyResponse(username, roles);
        return ResponseEntity.ok(ResponseDTO.success("Xác minh token thành công", verifyResponse));
    }
}