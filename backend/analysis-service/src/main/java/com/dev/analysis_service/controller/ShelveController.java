package com.dev.analysis_service.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.analysis_service.anotation.Message;
import com.dev.analysis_service.dto.response.Pagination;
import com.dev.analysis_service.model.Shelve;
import com.dev.analysis_service.service.ShelveService;
import com.turkraft.springfilter.boot.Filter;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class ShelveController {

    private final ShelveService shelveService;

    @GetMapping
    @Message("get all shelfs")
    public ResponseEntity<Pagination> getAllShelf(@Filter Specification<Shelve> specification ,Pageable Pageable) {
        return ResponseEntity.ok(shelveService.getAllShelves(specification, Pageable));
    }
    
    @GetMapping("total-detail")
    public ResponseEntity<Pagination> getTotalDetail(@Filter Specification<Shelve> specification ,Pageable Pageable) {
        return ResponseEntity.ok(shelveService.getTotalDetail(specification, Pageable));
    }
    
}
