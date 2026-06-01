package com.example.FujiFruit.repositories;

import com.example.FujiFruit.models.Order;
import com.example.FujiFruit.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    long count();
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE LOWER(u.full_name) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR u.phoneNumber LIKE CONCAT('%', :query, '%')")
    List<User> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneNumberContaining(
            String query, String query2, String query3);

    @Query("SELECT u FROM User u WHERE u NOT IN " +
            "(SELECT u2 FROM User u2 JOIN u2.roles r WHERE r.name = :roleName)")
    Page<User> findAllByRoleNot(String roleName, Pageable pageable);
}