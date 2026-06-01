package com.example.FujiFruit.services;

import com.example.FujiFruit.DTO.*;
import com.example.FujiFruit.models.Order;
import com.example.FujiFruit.models.User;
import com.example.FujiFruit.repositories.OrderRepository;
import com.example.FujiFruit.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public UserDTO getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng: " + username));

        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setFullName(user.getFull_name());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setAddress(user.getAddress());
        userDTO.setBirthdate(user.getBirthdate());
        return userDTO;
    }

    @Transactional
    public UserDTO updateUserProfile(String username, UpdateUserRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng: " + username));

        user.setFull_name(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setBirthdate(request.getBirthdate());

        User updatedUser = userRepository.save(user);

        UserDTO userDTO = new UserDTO();
        userDTO.setId(updatedUser.getId());
        userDTO.setUsername(updatedUser.getUsername());
        userDTO.setEmail(updatedUser.getEmail());
        userDTO.setFullName(updatedUser.getFull_name());
        userDTO.setPhoneNumber(updatedUser.getPhoneNumber());
        userDTO.setAddress(updatedUser.getAddress());
        userDTO.setBirthdate(updatedUser.getBirthdate());
        return userDTO;
    }

    public List<OrderDTO> getUserOrders(String username) {
        List<Order> orders = orderRepository.findByUserUsername(username);
        return orders.stream().map(order -> {
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
            orderDTO.setVnpTxnRef(order.getVnpTxnRef());
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
        }).collect(Collectors.toList());
    }
    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng: " + username));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không đúng");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Mật khẩu xác nhận không khớp");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }


    public List<UserDTO> getAllUsers(int page, int size) {
        return userRepository.findAllByRoleNot("ADMIN", PageRequest.of(page, size))
                .stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }
    public List<OrderDTO> getUserOrdersById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return orderRepository.findByUser(user).stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

    public String resetPassword(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        String newPassword = "User@123"; // password khi reset
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return newPassword;
    }

    public List<UserDTO> searchUsers(String query) {
        return userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneNumberContaining(
                        query, query, query)
                .stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        userRepository.delete(user);
    }

    private UserDTO convertToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFull_name());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        return dto;
    }
    private  OrderDTO convertToOrderDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setRecipientName(order.getRecipientName());
        dto.setPhoneNumber(order.getPhoneNumber());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setTotalPrice(order.getTotalAmount());
        return  dto;
    }
}