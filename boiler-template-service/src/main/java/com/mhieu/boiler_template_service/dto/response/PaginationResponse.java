package com.mhieu.boiler_template_service.dto.response;

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
