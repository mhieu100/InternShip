package com.dev.chatbot_service.dto.response;

import java.time.LocalDate;
import java.util.List;

public record VaccineItem (
        String id,
        String imageUrl,
        String name,
        String manufacturer,
        List<String> targetDiseases,
        int requiredDoses,
        LocalDate approvalDate,
        boolean isActive,
        double efficacyRate
) {};
