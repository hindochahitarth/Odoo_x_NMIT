package com.hitarth.odoo.repository;

import com.hitarth.odoo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find user by email
     * @param email the email to search for
     * @return Optional containing the user if found
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Find user by email or display name (for login flexibility)
     * @param emailOrUsername the email or username to search for
     * @return Optional containing the user if found
     */
    @Query("SELECT u FROM User u WHERE u.email = :emailOrUsername OR u.displayName = :emailOrUsername")
    Optional<User> findByEmailOrDisplayName(@Param("emailOrUsername") String emailOrUsername);
    
    /**
     * Check if email already exists
     * @param email the email to check
     * @return true if email exists, false otherwise
     */
    boolean existsByEmail(String email);
    
    /**
     * Check if display name already exists
     * @param displayName the display name to check
     * @return true if display name exists, false otherwise
     */
    boolean existsByDisplayName(String displayName);
    
    /**
     * Find active user by email
     * @param email the email to search for
     * @return Optional containing the active user if found
     */
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isActive = true")
    Optional<User> findActiveUserByEmail(@Param("email") String email);
}





