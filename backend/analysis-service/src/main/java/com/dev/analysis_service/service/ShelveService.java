package com.dev.analysis_service.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.dev.analysis_service.dto.response.Pagination;
import com.dev.analysis_service.dto.response.ShelveResponse;
import com.dev.analysis_service.model.Shelve;
import com.dev.analysis_service.repository.ShelveRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShelveService {
    private final ShelveRepository shelveRepository;

    public ShelveResponse toResponse(Shelve shelve) {
        ShelveResponse response = new ShelveResponse();
        response.setShelfId(shelve.getShelfId());
        response.setName(shelve.getName());
        return response;
    }

    public Pagination getAllShelves(Specification<Shelve> specification, Pageable pageable) {
        Page<Shelve> pageShelve = shelveRepository.findAll(specification, pageable);
        Pagination pagination = new Pagination();
        Pagination.Meta meta = new Pagination.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageShelve.getTotalPages());
        meta.setTotal(pageShelve.getTotalElements());

        pagination.setMeta(meta);

        List<ShelveResponse> listShelve = pageShelve.getContent()
                .stream().map(this::toResponse)
                .collect(Collectors.toList());
        pagination.setResult(listShelve);

        return pagination;
    }


    public Pagination getTotalDetail(Specification<Shelve> specification, Pageable pageable) {
        Page<Shelve> pageShelve = shelveRepository.findAll(specification, pageable);
        Pagination pagination = new Pagination();
        Pagination.Meta meta = new Pagination.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageShelve.getTotalPages());
        meta.setTotal(pageShelve.getTotalElements());

        pagination.setMeta(meta);

        List<ShelveResponse> listShelve = pageShelve.getContent()
                .stream().map(this::toResponse)
                .collect(Collectors.toList());
        pagination.setResult(listShelve);

        return pagination;
    }

}
