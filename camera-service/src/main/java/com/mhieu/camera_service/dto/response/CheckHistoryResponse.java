package com.mhieu.camera_service.dto.response;

import java.time.Instant;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckHistoryResponse {
    String name;
    String status;
    Integer ping;
    Double lastChecked;
    Instant checkedAt;
}
