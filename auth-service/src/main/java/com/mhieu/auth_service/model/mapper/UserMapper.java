package com.mhieu.auth_service.model.mapper;

import org.mapstruct.Mapper;

import com.mhieu.auth_service.model.User;
import com.mhieu.auth_service.model.dto.RegisterRequest;
import com.mhieu.auth_service.model.dto.UserResponse;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
    
    User dtoToEntity(RegisterRequest request);
}
