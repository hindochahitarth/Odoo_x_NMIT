package com.hitarth.odoo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/", "/auth", "/login", "/register", "/dashboard", "/html/**", "/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().permitAll() // Allow all requests for now
            )
            .formLogin(form -> form.disable()) // Disable default login form
            .httpBasic(httpBasic -> httpBasic.disable()); // Disable basic auth
        
        return http.build();
    }
}
