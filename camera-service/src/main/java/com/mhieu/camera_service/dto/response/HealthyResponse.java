package com.mhieu.camera_service.dto.response;

import java.time.Instant;

import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class HealthyResponse {
    boolean isLive;
    Integer ping;
    Instant lastChecked;
}
