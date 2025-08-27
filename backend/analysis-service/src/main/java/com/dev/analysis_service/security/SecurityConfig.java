 package com.dev.analysis_service.security;

 import org.springframework.context.annotation.Bean;
 import org.springframework.context.annotation.Configuration;
 import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
 import org.springframework.security.config.annotation.web.builders.HttpSecurity;
 import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
 import org.springframework.security.web.SecurityFilterChain;
 import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

 @Configuration
 @EnableMethodSecurity
 public class SecurityConfig {

     private final JwtAuthenticationEntryPoint jwtAuthEntryPoint;
     private final JwtAccessDeniedHandler jwtAccessHandler;

     public SecurityConfig(JwtAuthenticationEntryPoint jwtAuthEntryPoint,
             JwtAccessDeniedHandler jwtAccessHandler) {
         this.jwtAuthEntryPoint = jwtAuthEntryPoint;
         this.jwtAccessHandler = jwtAccessHandler;
     }

     @Bean
     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
         return http
                 .csrf(AbstractHttpConfigurer::disable)
                 .exceptionHandling(ex -> ex
                         .authenticationEntryPoint(jwtAuthEntryPoint)
                         .accessDeniedHandler(jwtAccessHandler))
                 .authorizeHttpRequests(auth -> auth
                         .requestMatchers("/api/analysis/**").permitAll()
                         .requestMatchers("/data-stream").permitAll()
                         .anyRequest().authenticated())
                 .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class)
                 .build();
     }

     @Bean
     public JwtAuthFilter jwtAuthFilter() {
         return new JwtAuthFilter();
     }
 }
