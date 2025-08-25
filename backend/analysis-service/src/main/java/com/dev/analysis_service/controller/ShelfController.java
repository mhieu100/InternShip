package com.dev.analysis_service.controller;

import com.dev.analysis_service.dto.request.ShortageRateRequest;
import com.dev.analysis_service.dto.response.ShortageRateResponse;
import com.dev.analysis_service.dto.response.TotalRateByShelfResponse;
import com.dev.analysis_service.service.ShelveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class ShelfController {
    private final ShelveService shelveService;

    @PostMapping("/data-chart_1")
    public ResponseEntity<List<ShortageRateResponse>> getData(@RequestBody ShortageRateRequest request) {
        return ResponseEntity.ok(shelveService.getData());
    }

    @PostMapping("/data-chart_2")
    public ResponseEntity<List<TotalRateByShelfResponse>> getData_1(@RequestBody ShortageRateRequest request) {
        return ResponseEntity.ok(shelveService.getData_1());
    }
}
