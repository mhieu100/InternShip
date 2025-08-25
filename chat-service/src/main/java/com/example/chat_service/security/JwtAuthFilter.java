package com.example.chat_service.security;

import com.example.chat_service.dto.response.ApiResponse;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureException;

import java.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

public class JwtAuthFilter extends OncePerRequestFilter {

        private static final String SECRET_KEY = "my-very-long-and-secure-jwt-secret-key-123456";

        @Override
        protected void doFilterInternal(@NonNull HttpServletRequest request,
                        @NonNull HttpServletResponse response,
                        @NonNull FilterChain filterChain) throws ServletException, IOException {

                String authHeader = request.getHeader("Authorization");
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                        filterChain.doFilter(request, response);
                        return;
                }
                try {
                        String token = authHeader.substring(7);
                        processToken(token);
                } catch (ExpiredJwtException e) {
                        writeErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "JWT token has expired");
                        return;
                } catch (SignatureException e) {
                        writeErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT signature");
                        return;
                } catch (Exception e) {
                        writeErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
                        return;
                }
                filterChain.doFilter(request, response);
        }

        public void processToken(String token) {
                Claims claims = Jwts.parserBuilder()
                                .setSigningKey(SECRET_KEY.getBytes())
                                .build()
                                .parseClaimsJws(token)
                                .getBody();

                Long userId = claims.get("userId", Long.class);
                String role = claims.get("role", String.class);

                List<SimpleGrantedAuthority> authorities = List.of(
                                new SimpleGrantedAuthority("ROLE_" + role));
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userId, null,
                                authorities);

                SecurityContextHolder.getContext().setAuthentication(auth);
        }

        private void writeErrorResponse(HttpServletResponse response, int statusCode, String message)
                        throws IOException {

                ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                                .statusCode(statusCode)
                                .message(message)
                                .data(null)
                                .build();
                ObjectMapper objectMapper = new ObjectMapper();
                response.setStatus(statusCode);
                response.setContentType("application/json");
                response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
        }
}