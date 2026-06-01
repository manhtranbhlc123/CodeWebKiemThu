package com.example.FujiFruit.services;


import com.example.FujiFruit.DTO.*;
//import com.example.FujiFruit.config.VNPayService;
import com.example.FujiFruit.models.*;
import com.example.FujiFruit.repositories.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private FruitRepository fruitRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartItemRepository cartItemRepository;

//    @Autowired
//    private VNPayService vnPayService;
    @Autowired
    private OrderRepository orderRepository;
    public CartDTO getCart(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng"));
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        CartDTO cartDTO = new CartDTO();
        cartDTO.setId(cart.getId());

        List<CartItemRequest> itemDTOs = cart.getItems().stream().map(item -> {
            CartItemRequest itemDTO = new CartItemRequest();
            itemDTO.setId(item.getId());
            itemDTO.setFruitId(item.getFruit().getId());
            itemDTO.setFruitName(item.getFruit().getName());
            itemDTO.setFruitPrice(item.getFruit().getPrice());
            itemDTO.setImage(item.getFruit().getImage());
            itemDTO.setFruitDiscount(item.getFruit().getDiscount());
            itemDTO.setQuantity(item.getQuantity());
            return itemDTO;
        }).collect(Collectors.toList());

        cartDTO.setItems(itemDTOs);
        return cartDTO;
    }
    public void addToCart(String username, CartItemRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng"));
        Fruit fruit = fruitRepository.findById(request.getFruitId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm"));

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getFruit().getId().equals(request.getFruitId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setFruit(fruit);
            newItem.setQuantity(request.getQuantity());
            cart.getItems().add(newItem);
        }

        cartRepository.save(cart);
    }

    public void plusCartItem(String username, Long fruitId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng"));
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Giỏ hàng không tồn tại"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getFruit().getId().equals(fruitId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Mặt hàng không tồn tại trong giỏ hàng"));

        item.setQuantity(item.getQuantity() + 1);
        cartRepository.save(cart);
    }

    public void minusCartItem(String username, Long fruitId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng"));
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Giỏ hàng không tồn tại"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getFruit().getId().equals(fruitId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Mặt hàng không tồn tại trong giỏ hàng"));

        if (item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
        } else {
            cart.getItems().remove(item);
        }
        cartRepository.save(cart);
    }

    public void removeCartItem(String username, Long fruitId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng"));
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Giỏ hàng không tồn tại"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getFruit().getId().equals(fruitId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Mặt hàng không tồn tại trong giỏ hàng"));

        cart.getItems().remove(item);
        cartRepository.save(cart);
    }
    public boolean clearCart(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    return new IllegalArgumentException("Không tìm thấy người dùng");
                });
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> {
                    return new IllegalArgumentException("Không tìm thấy giỏ hàng cho người dùng: " + username);
                });

        if (cart == null) {
            return false;
        }
        cartItemRepository.deleteAllByCart(cart);
        return true;
    }

    @Transactional
    public OrderDTO checkout(String username, CheckoutRequest checkoutRequest, HttpServletRequest request) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    return new IllegalArgumentException("Không tìm thấy người dùng");
                });

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> {
                    return new IllegalArgumentException("Không tìm thấy giỏ hàng cho người dùng: " + username);
                });

        if (cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Giỏ hàng trống");
        }

        Order order = new Order();
        order.setUser(user);
        order.setItems(cart.getItems().stream()
                .map(item -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setFruit(item.getFruit());
                    orderItem.setQuantity(item.getQuantity());
                    orderItem.setPrice(item.getFruit().getPrice() - (item.getFruit().getPrice()*item.getFruit().getDiscount()));
                    orderItem.setOrder(order);
                    return orderItem;
                })
                .collect(Collectors.toList()));
        order.setTotalAmount(cart.getItems().stream()
                .mapToDouble(i -> (i.getFruit().getPrice() - (i.getFruit().getDiscount()*i.getFruit().getPrice())) * i.getQuantity())
                .sum());
        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());
        order.setShippingAddress(checkoutRequest.getShippingAddress());
        order.setPaymentMethod(checkoutRequest.getPaymentMethod());
        order.setRecipientName(checkoutRequest.getRecipientName());
        order.setPhoneNumber(checkoutRequest.getPhoneNumber());
        order.setPaymentStatus("PENDING");


        Order savedOrder = orderRepository.save(order);
        cart.getItems().clear();
        cartRepository.save(cart);

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(savedOrder.getId());
        orderDTO.setOrderDate(savedOrder.getOrderDate());
        orderDTO.setTotalAmount(savedOrder.getTotalAmount());
        orderDTO.setStatus(savedOrder.getStatus());
        orderDTO.setShippingAddress(savedOrder.getShippingAddress());
        orderDTO.setPaymentMethod(savedOrder.getPaymentMethod());
        orderDTO.setRecipientName(savedOrder.getRecipientName());
        orderDTO.setPhoneNumber(savedOrder.getPhoneNumber());
        orderDTO.setPaymentStatus(savedOrder.getPaymentStatus());

        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        orderDTO.setUser(userDTO);

        orderDTO.setItems(savedOrder.getItems().stream()
                .map(item -> {
                    OrderItemDTO itemDTO = new OrderItemDTO();
                    itemDTO.setId(item.getId());
                    itemDTO.setQuantity(item.getQuantity());
                    itemDTO.setPrice(item.getPrice());
                    FruitDTO fruitDTO = new FruitDTO();
                    fruitDTO.setId(item.getFruit().getId());
                    fruitDTO.setName(item.getFruit().getName());
                    fruitDTO.setPrice(item.getFruit().getPrice());
                    itemDTO.setFruit(fruitDTO);
                    return itemDTO;
                })
                .collect(Collectors.toList()));

        return orderDTO;
    }
    public boolean cancelOrder(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order with ID " + orderId + " not found"));

            if (!isCancellable(order)) {
                return false;
            }
            order.setStatus("CANCEL");
            orderRepository.save(order);
            return true;
        } catch (IllegalArgumentException e) {
            System.err.println("Error cancelling order: " + e.getMessage());
            return false;
        }
    }

    private boolean isCancellable(Order order) {
        return "PENDING".equalsIgnoreCase(order.getStatus()) ||
                "PROCESSING".equalsIgnoreCase(order.getStatus());
    }
}