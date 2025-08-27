package com.dev.user_service.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dev.user_service.dto.request.UserRequest;
import com.dev.user_service.dto.response.Pagination;
import com.dev.user_service.dto.response.UserResponse;
import com.dev.user_service.exception.AppException;
import com.dev.user_service.exception.ErrorCode;
import com.dev.user_service.model.User;
import com.dev.user_service.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .address(user.getAddress())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public Pagination getAllUsers(Specification<User> specification, Pageable pageable) {
        Page<User> pageUser = userRepository.findAll(specification, pageable);
        Pagination pagination = new Pagination();
        Pagination.Meta meta = new Pagination.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageUser.getTotalPages());
        meta.setTotal(pageUser.getTotalElements());

        pagination.setMeta(meta);

        List<UserResponse> listUser = pageUser.getContent()
                .stream().map(this::toResponse)
                .collect(Collectors.toList());
        pagination.setResult(listUser);

        return pagination;
    }

    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTS);
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(this.passwordEncoder.encode("123456"))
                .address(request.getAddress())
                .role(request.getRole())
                .build();
        return toResponse(userRepository.save(user));
    }

    public UserResponse updateUser(Long id, UserRequest request) {
        Optional<User> currentUser = this.userRepository.findById(id);
        if (currentUser.isEmpty()) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        currentUser.get().setAddress(request.getAddress());
        currentUser.get().setName(request.getName());
        currentUser.get().setRole(request.getRole());
        return toResponse(userRepository.save(currentUser.get()));
    }

    public void deleteUser(Long id) {
        Optional<User> user = this.userRepository.findById(id);
        if (user.isEmpty()) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        userRepository.delete(user.get());
    }

    public UserResponse getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if(user.isEmpty()) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        return UserResponse.builder().name(user.get().getName()).email(user.get().getEmail()).address(user.get().getAddress()).role(user.get().getRole()).build();
    }
}
