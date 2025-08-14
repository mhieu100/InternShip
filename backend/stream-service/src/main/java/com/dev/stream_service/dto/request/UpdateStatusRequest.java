package com.dev.stream_service.dto.request;

import com.dev.stream_service.dto.response.CameraResponse;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UpdateStatusRequest {
    CameraResponse.Status status;
    String fps;
    String resolution;
    Integer viewerCount;
}
