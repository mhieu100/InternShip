package com.dev.stream_service.service.httpClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.dev.stream_service.dto.response.ApiResponse;
import com.dev.stream_service.dto.response.CameraResponse;


@FeignClient(name = "camera-service", url = "http://localhost:8084")
public interface CameraClient {

    @GetMapping("/api/cameras/{id}")
    ApiResponse<CameraResponse> getCameraById(@PathVariable("id") Long id);
}
