package com.dev.analysis_service.controller;

import com.dev.analysis_service.anotation.Message;
import com.dev.analysis_service.dto.request.PotentialLossRequest;
import com.dev.analysis_service.dto.response.*;
import com.dev.analysis_service.model.Shelve;
import com.dev.analysis_service.service.ShelveService;
import com.turkraft.springfilter.boot.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class ShelfController {
    private final ShelveService shelveService;

    @GetMapping("/shelves")
    public ResponseEntity<Pagination> getAllShelves(@Filter Specification<Shelve> specification, Pageable pageable) {
        return ResponseEntity.ok(shelveService.getAllShelves(specification, pageable));
    }
    
    @PostMapping("/average-shortage-rate")
    @Message("Average Shortage Rate")
    public ResponseEntity<List<ShortageRateResponse>> getAverageShortageRate(@RequestBody PotentialLossRequest request) {
        System.out.println(request);
        return ResponseEntity.ok(shelveService.getAverageShortageRate(request));
    }

    @PostMapping("/average-recovery-rate")
    @Message("Average Recovery Rate")
    public ResponseEntity<List<RecoveryRateResponse>> getAverageRecoveryRate(@RequestBody PotentialLossRequest request) {
        return ResponseEntity.ok(shelveService.getAverageRecoveryRate(request));
    }

    @PostMapping("/shortage-status-by-each")
    public ResponseEntity<List<TotalShortageStatusResponse>> getShortageStatusByEach(@RequestBody PotentialLossRequest request) {
        return ResponseEntity.ok(shelveService.getShortageStatusByEach(request));
    }

    @PostMapping("/recovery-status-by-each")
    public ResponseEntity<List<TotalRecoveryStatusResponse>> getRecoveryStatusByEach(@RequestBody PotentialLossRequest request) {
        return ResponseEntity.ok(shelveService.getRecoveryStatusByEach(request));
    }

    @PostMapping("/data-tree")
    public ResponseEntity<List<TreeDataResponse>> getDataTree(@RequestBody PotentialLossRequest request) {
        return ResponseEntity.ok(shelveService.getDataTree(request));
    }
}
