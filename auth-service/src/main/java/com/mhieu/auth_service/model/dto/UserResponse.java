package com.mhieu.auth_service.model.dto;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mhieu.auth_service.utils.RoleEnum;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {
    private long id;
    private String name;
    private String email;

    private int age;
    private String address;
    private RoleEnum role;
    private Instant createdAt;
    private Instant updatedAt;

}
