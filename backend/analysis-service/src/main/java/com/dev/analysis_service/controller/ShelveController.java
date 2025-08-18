 package com.dev.analysis_service.controller;

 import com.dev.analysis_service.dto.response.MetricResponse;
 import org.springframework.web.bind.annotation.RequestMapping;
 import org.springframework.web.bind.annotation.RestController;

 import com.dev.analysis_service.anotation.Message;
 import com.dev.analysis_service.dto.response.Pagination;
 import com.dev.analysis_service.dto.response.SummaryDailyResponse;
 import com.dev.analysis_service.model.Metric;
 import com.dev.analysis_service.model.Shelve;
 import com.dev.analysis_service.model.SummaryDaily;
 import com.dev.analysis_service.service.ShelveService;
 import com.turkraft.springfilter.boot.Filter;

 import lombok.RequiredArgsConstructor;

 import java.util.List;

 import org.springframework.data.domain.Pageable;
 import org.springframework.data.jpa.domain.Specification;
 import org.springframework.http.ResponseEntity;
 import org.springframework.web.bind.annotation.GetMapping;


 @RestController
 @RequestMapping("/api/analysis")
 @RequiredArgsConstructor
 public class ShelveController {

     private final ShelveService shelveService;

     @GetMapping
     @Message("get all shelfs")
     public ResponseEntity<Pagination> getAllShelf(@Filter Specification<Shelve> specification, Pageable Pageable) {
         return ResponseEntity.ok(shelveService.getAllShelves(specification, Pageable));
     }

     @GetMapping("/total-detail")
     @Message("get total detail")
     public ResponseEntity<Pagination> getTotalDetail(@Filter Specification<SummaryDaily> specification,
             Pageable Pageable) {
         specification = Specification.where(specification).and((root, query, criteriaBuilder) -> criteriaBuilder
                 .equal(root.get("date"), "2025-08-11"));
         return ResponseEntity.ok(shelveService.getTotalDetail(specification, Pageable));
     }

     @GetMapping("/data")
     @Message("get data")
     public ResponseEntity<Pagination> getMetrics(@Filter Specification<Metric> specification,
             Pageable Pageable) {

         specification = Specification.where(specification).and((root, query, criteriaBuilder) -> criteriaBuilder
                 .equal(root.get("date"), "2025-08-11"));
         return ResponseEntity.ok(shelveService.getMetrics(specification, Pageable));
     }


     @GetMapping("/test")
     @Message("chi test thoi")
     public ResponseEntity<List<SummaryDailyResponse>> getMethodName() {
         return ResponseEntity.ok(shelveService.getTotalByDate());
     }

     @GetMapping("/demo")
     @Message("chi test thoi")
     public ResponseEntity<List<MetricResponse>> getDemo() {
         return ResponseEntity.ok(shelveService.getDemo());
     }
    
 }
