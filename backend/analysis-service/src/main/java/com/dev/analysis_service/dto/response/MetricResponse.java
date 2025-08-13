package com.dev.analysis_service.dto.response;

import java.time.LocalTime;

import lombok.*;

@Data
@Builder

public class MetricResponse {

    String shelveName;
    String date;
    LocalTime time;
    Double osaRate;

}