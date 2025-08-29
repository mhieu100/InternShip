package com.dev.analysis_service.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PotentialLossRequest {
    LocalDate startDate;
    LocalDate endDate;
    String[] includeShelf;
}
