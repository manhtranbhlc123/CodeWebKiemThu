package com.example.FujiFruit.repositories;

import com.example.FujiFruit.models.Cart;
import com.example.FujiFruit.models.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository  extends JpaRepository<CartItem, Long> {
    void deleteAllByCart(Cart cart);
}
