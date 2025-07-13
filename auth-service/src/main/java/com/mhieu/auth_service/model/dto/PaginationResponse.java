package com.mhieu.auth_service.model.dto;

import lombok.Data;

@Data
public class PaginationResponse {
    private Meta meta;
    private Object result;

    @Data
    public static class Meta {
        private int page;
        private int pageSize;
        private int pages;
        private long total;
    }
}
