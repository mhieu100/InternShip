package com.dev.stream_service.service.httpClient;

import com.dev.stream_service.dto.request.UpdateStatusRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.dev.stream_service.dto.response.ApiResponse;
import com.dev.stream_service.dto.response.CameraResponse;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;


@FeignClient(name = "camera-service", url = "http://localhost:8084")
public interface CameraClient {

    @GetMapping("/api/cameras/{id}")
    ApiResponse<CameraResponse> getCameraById(@PathVariable("id") Long id);

    @GetMapping("/api/cameras/cameras-for-stream")
    ApiResponse<List<CameraResponse>> getAllCamerasForStream();

    @PutMapping("/api/cameras/{id}/status")
    void updateStatusCamera(@PathVariable("id") Long id,@RequestBody UpdateStatusRequest  request);
}
