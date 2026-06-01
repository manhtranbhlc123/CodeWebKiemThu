package com.example.FujiFruit.controller;

import com.example.FujiFruit.DTO.*;
import com.example.FujiFruit.models.Order;
import com.example.FujiFruit.services.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Cart API", description = "API for managing shopping cart and checkout")
@SecurityRequirement(name = "bearerAuth")
@Validated
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    @Operation(summary = "Get user's cart", description = "Retrieve the shopping cart details for the authenticated user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cart retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized or invalid token"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResponseDTO<CartDTO>> getCart(
            @Parameter(description = "Authenticated user details") Authentication authentication) {
        String username = authentication.getName();
        CartDTO cart = cartService.getCart(username);
        return ResponseEntity.ok(ResponseDTO.success("Lấy giỏ hàng thành công", cart));
    }

    @PostMapping("/add")
    @Operation(summary = "Add item to cart", description = "Add a fruit with specified quantity to the user's cart")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Item added to cart successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data or fruit not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized or invalid token"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResponseDTO<String>> addToCart(
            @Parameter(description = "Authenticated user details") Authentication authentication,
            @Valid @RequestBody @Parameter(description = "Cart item details (fruit ID and quantity)") CartItemRequest request) {
        String username = authentication.getName();
        cartService.addToCart(username, request);
        return ResponseEntity.ok(ResponseDTO.success("Thêm sản phẩm vào giỏ hàng thành công", null));
    }

    @PutMapping("/plus/{fruitId}")
    @Operation(summary = "Increase item quantity", description = "Increase the quantity of a fruit in the cart by 1")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Quantity increased successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid fruit ID or item not in cart"),
            @ApiResponse(responseCode = "401", description = "Unauthorized or invalid token"),
            @ApiResponse(responseCode = "404", description = "User or fruit not found")
    })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResponseDTO<String>> plusCartItem(
            @Parameter(description = "Authenticated user details") Authentication authentication,
            @PathVariable @Min(1) @Parameter(description = "ID of the fruit") Long fruitId) {
        String username = authentication.getName();
        cartService.plusCartItem(username, fruitId);
        return ResponseEntity.ok(ResponseDTO.success("Tăng số lượng sản phẩm thành công", null));
    }

    @PutMapping("/minus/{fruitId}")
    @Operation(summary = "Decrease item quantity", description = "Decrease the quantity of a fruit in the cart by 1")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Quantity decreased successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid fruit ID or item not in cart"),
            @ApiResponse(responseCode = "401", description = "Unauthorized or invalid token"),
            @ApiResponse(responseCode = "404", description = "User or fruit not found")
    })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResponseDTO<String>> minusCartItem(
            @Parameter(description = "Authenticated user details") Authentication authentication,
            @PathVariable @Min(1) @Parameter(description = "ID of the fruit") Long fruitId) {
        String username = authentication.getName();
        cartService.minusCartItem(username, fruitId);
        return ResponseEntity.ok(ResponseDTO.success("Giảm số lượng sản phẩm thành công", null));
    }

    @DeleteMapping("/remove/{fruitId}")
    @Operation(summary = "Remove item from cart", description = "Remove a fruit from the user's cart")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Item removed successfully",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid fruit ID or item not in cart"),
            @ApiResponse(responseCode = "401", description = "Unauthorized or invalid token"),
            @ApiResponse(responseCode = "404", description = "User or fruit not found")
    })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResponseDTO<String>> removeCartItem(
            @Parameter(description = "Authenticated user details") Authentication authentication,
            @PathVariable @Min(1) @Parameter(description = "ID of the fruit") Long fruitId) {
        String username = authentication.getName();
        cartService.removeCartItem(username, fruitId);
        return ResponseEntity.ok(ResponseDTO.success("Xóa sản phẩm khỏi giỏ hàng thành công", null));
    }

    @PostMapping("/checkout")
    @PreAuthorize("isAuthenticated()")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Checkout successful, order created",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Cart is empty or invalid data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized or invalid token"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @Operation(summary = "Checkout cart", description = "Create an order from the cart and clear the cart items")
    public ResponseEntity<ResponseDTO<OrderDTO>> checkout(
            @Parameter(description = "Authenticated user details") Authentication authentication,
            @Valid @RequestBody CheckoutRequest checkoutRequest,
            HttpServletRequest request
    ) {
        String username = authentication.getName();
        OrderDTO order = cartService.checkout(username, checkoutRequest, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResponseDTO.success("Thanh toán thành công", order));
    }
    @DeleteMapping("/clear")
    @PreAuthorize("isAuthenticated()")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Checkout successful, order created",
                    content = @Content(schema = @Schema(implementation = ResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Cart is empty or invalid data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized or invalid token"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @Operation(summary = "Checkout cart", description = "Create an order from the cart and clear the cart items")
    public ResponseEntity<ResponseDTO<Boolean>> clearCart(
            @Parameter(description = "Authenticated user details") Authentication authentication
    ) {
        String username = authentication.getName();
        boolean order = cartService.clearCart(username);
        if (order){
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ResponseDTO.success("Xóa thành công", true));
        }else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDTO.success("Xóa thất bại", false));
        }
    }
}