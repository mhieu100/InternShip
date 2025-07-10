package com.example.jjwt.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Component;

import java.util.Date;

import javax.crypto.SecretKey;

@Component
public class JwtUtil {

    SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);


    private long expirationTime = 1000 * 60 * 60; // Thời gian hết hạn: 8 giây (đơn vị: milli  seconds)

    // Tạo token
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username) // Đặt thông tin người dùng vào token
                .setIssuedAt(new Date()) // Thời gian phát hành
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime)) // Thời gian hết hạn
                .signWith(SignatureAlgorithm.HS512, key) // Ký token bằng thuật toán HS512
                .compact();
    }

    // Lấy username từ token
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Xác thực token
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(key).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false; // Token không hợp lệ
        }
    }
}
