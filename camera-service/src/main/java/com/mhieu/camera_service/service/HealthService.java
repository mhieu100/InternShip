package com.mhieu.camera_service.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;

import com.mhieu.camera_service.dto.response.CameraResponse;
import com.mhieu.camera_service.dto.response.CheckHistoryResponse;
import com.mhieu.camera_service.dto.response.HealthyResponse;
import com.mhieu.camera_service.dto.response.PictureResponse;
import com.mhieu.camera_service.model.Camera;
import com.mhieu.camera_service.model.CheckHistory;
import com.mhieu.camera_service.repository.CameraRepository;
import com.mhieu.camera_service.repository.CheckHistoryRepository;
import com.mhieu.camera_service.util.FFmpegUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HealthService {

    private final CameraRepository cameraRepository;
    private final CheckHistoryRepository checkHistoryRepository;
    private final FFmpegUtil ffmpegUtil;
    private final ModelMapper modelMapper;

    public HealthyResponse checkHealthCamera(Long cameraId) {
        Camera camera = cameraRepository.findById(cameraId).get();

        return HealthyResponse.builder().name(camera.getName()).status(camera.getStatus()).lastChecked(Instant.now())
                .ping(ffmpegUtil.checkRtspPing(camera.getStreamUrl())).build();
    }

    public CheckHistoryResponse saveHistory(CheckHistory checkHistory) {
        checkHistory.setCheckedAt(Instant.now());
        return modelMapper.map(checkHistoryRepository.save(checkHistory), CheckHistoryResponse.class);
    }

    public List<CheckHistoryResponse> getHistoryCheck() {
        List<CheckHistoryResponse> list = checkHistoryRepository.findAll().stream()
                .map((item) -> modelMapper.map(item, CheckHistoryResponse.class)).collect(Collectors.toList());
        return list;
    }

    public PictureResponse screenShot(Long cameraId) {
        Camera camera = cameraRepository.findById(cameraId).orElse(null);
        String pictureUrl = ffmpegUtil.takePicture(camera.getStreamUrl());
        return PictureResponse.builder().cameraId(cameraId).pictureUrl(pictureUrl).build();
    }
}
