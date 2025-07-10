package com.example.jjwt.model.mapper;

import org.mapstruct.Mapper;

import com.example.jjwt.model.User;
import com.example.jjwt.model.dto.UserResponse;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
}
