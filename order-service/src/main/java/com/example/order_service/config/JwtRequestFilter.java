// package com.example.order_service.config;

// import java.io.IOException;

// import org.springframework.http.*;
// import org.springframework.stereotype.Component;
// import org.springframework.web.client.HttpClientErrorException;
// import org.springframework.web.client.RestTemplate;
// import org.springframework.web.filter.OncePerRequestFilter;

// import com.example.order_service.model.dto.ErrorResponse;
// import com.fasterxml.jackson.databind.ObjectMapper;

// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.*;

// @Component
// public class JwtRequestFilter extends OncePerRequestFilter {

//     private final ObjectMapper objectMapper = new ObjectMapper();

//     @Override
//     protected void doFilterInternal(HttpServletRequest request,
//             HttpServletResponse response,
//             FilterChain filterChain) throws ServletException, IOException {

//         String authHeader = request.getHeader("Authorization");
//         if (authHeader != null && authHeader.startsWith("Bearer ")) {
//             String token = authHeader.substring(7);

//             try {
//                 RestTemplate restTemplate = new RestTemplate();

//                 HttpHeaders headers = new HttpHeaders();
//                 headers.set("Authorization", "Bearer " + token);
//                 HttpEntity<String> entity = new HttpEntity<>(headers);

//                 ResponseEntity<String> authResponse = restTemplate.exchange(
//                         "http://localhost:8080/auth/validate",
//                         HttpMethod.GET,
//                         entity,
//                         String.class);

//                 if (authResponse.getStatusCode().is2xxSuccessful()) {
//                     request.setAttribute("username", authResponse.getBody());
//                 }

//             } catch (HttpClientErrorException ex) {
//                 response.setStatus(ex.getStatusCode().value());
//                 response.setContentType("application/json");

//                 String message = extractMessageFromAuthResponse(ex.getResponseBodyAsString());
//                 ErrorResponse errorResponse = new ErrorResponse(
//                         ex.getStatusCode().value(),
//                         message,
//                         request.getRequestURI());

//                 String json = objectMapper.writeValueAsString(errorResponse);
//                 response.getWriter().write(json);
//                 return;
//             }

//         } else {
//             response.setStatus(HttpStatus.UNAUTHORIZED.value());
//             response.setContentType("application/json");

//             ErrorResponse errorResponse = new ErrorResponse(
//                     401,
//                     "Missing Authorization header",
//                     request.getRequestURI());

//             String json = objectMapper.writeValueAsString(errorResponse);
//             response.getWriter().write(json);
//             return;
//         }

//         filterChain.doFilter(request, response);
//     }

//     private String extractMessageFromAuthResponse(String responseBody) {
//         try {
//             return objectMapper.readTree(responseBody).get("error").asText();
//         } catch (Exception e) {
//             return "Invalid JWT token"; 
//         }
//     }
// }
