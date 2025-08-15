package com.dev.user_service.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class VerifyCodeService {

    private final StringRedisTemplate redisTemplate;

    /**
     * Lưu verify code với thời hạn
     * @param key - Thường là email hoặc số điện thoại
     * @param value - Mã xác nhận
     * @param timeout - Thời gian hết hạn (phút)
     */
    public void saveVerifyCode(String key, String value, long timeout) {
        redisTemplate.opsForValue().set(key, value, timeout, TimeUnit.MINUTES);
    }

    /**
     * Lấy verify code
     * @param key - Thường là email hoặc số điện thoại
     * @return Mã xác nhận hoặc null nếu không tồn tại/hết hạn
     */
    public String getVerifyCode(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    /**
     * Xóa verify code
     * @param key - Thường là email hoặc số điện thoại
     */
    public void deleteVerifyCode(String key) {
        redisTemplate.delete(key);
    }

    /**
     * Kiểm tra verify code có hợp lệ không
     * @param key - Thường là email hoặc số điện thoại
     * @param code - Mã xác nhận cần kiểm tra
     * @return true nếu hợp lệ, false nếu không
     */
    public boolean validateVerifyCode(String key, String code) {
        String storedCode = getVerifyCode(key);
        return storedCode != null && storedCode.equals(code);
    }
}