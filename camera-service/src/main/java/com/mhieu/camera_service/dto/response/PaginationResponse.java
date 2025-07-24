package com.mhieu.camera_service.dto.response;


import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaginationResponse  {
    Meta meta;
    Object result;

    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Meta  {
        Integer page;
        Integer pageSize;
        Integer pages;
        Long total;
    }
}
