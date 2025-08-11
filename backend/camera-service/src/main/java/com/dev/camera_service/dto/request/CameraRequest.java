package com.dev.camera_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import com.dev.camera_service.model.Camera;
import com.fasterxml.jackson.annotation.JsonProperty;

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

    @NotBlank(message = "StreamURL không được để trống")
    @Pattern(regexp = "^rtsp://[a-zA-Z0-9\\-._~:/?#\\[\\]@!$&'()*+,;=]+$", message = "StreamURL phải là định dạng RTSP hợp lệ (ví dụ: rtsp://ip:port/stream)")
    @Size(max = 255, message = "StreamURL không được vượt quá 255 ký tự")
    String streamUrl;

    @NotNull(message = "Trạng thái trực tuyến không được để trống")
    Camera.Type type;

    @JsonProperty("isPublic")
    boolean isPublic;
}