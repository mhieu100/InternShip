package com.mhieu.camera_service.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mhieu.camera_service.model.Camera;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CameraRequest {

    @NotBlank(message = "Tên camera không được để trống")
    String name;

    @NotBlank(message = "Vị trí không được để trống")
    String location;

    @NotNull(message = "Trạng thái không được để trống")
    Camera.Status status = Camera.Status.ONLINE;

    @NotBlank(message = "StreamURL không được để trống")
    @Pattern(
        regexp = "^rtsp://[a-zA-Z0-9\\-._~:/?#\\[\\]@!$&'()*+,;=]+$",
        message = "StreamURL phải là định dạng RTSP hợp lệ (ví dụ: rtsp://ip:port/stream)"
    )
    @Size(
        max = 255,
        message = "StreamURL không được vượt quá 255 ký tự"
    )
    String streamUrl;

    @NotNull(message = "Trạng thái trực tuyến không được để trống")
    Camera.Type type;

    @JsonProperty("isPublic")
    boolean isPublic;
}