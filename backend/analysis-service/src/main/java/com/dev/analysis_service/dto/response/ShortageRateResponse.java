package com.dev.analysis_service.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ShortageRateResponse {
    LocalDate date;
    Integer shortageRate;
}
