package com.hitarth.odoo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static resources from templates directory
        registry.addResourceHandler("/html/**")
                .addResourceLocations("classpath:/templates/html/");
        
        registry.addResourceHandler("/css/**")
                .addResourceLocations("classpath:/templates/css/");
        
        registry.addResourceHandler("/js/**")
                .addResourceLocations("classpath:/templates/js/");
        
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/templates/images/");
    }
}


