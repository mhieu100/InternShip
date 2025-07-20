package com.mhieu.boiler_template_service.service;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhieu.boiler_template_service.dto.request.UserRequest;
import com.mhieu.boiler_template_service.dto.response.PaginationResponse;
import com.mhieu.boiler_template_service.dto.response.UserResponse;
import com.mhieu.boiler_template_service.exception.AppException;
import com.mhieu.boiler_template_service.exception.ErrorCode;
import com.mhieu.boiler_template_service.model.User;
import com.mhieu.boiler_template_service.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.DUPLICATE_RESOURCE);
        }
        User user = modelMapper.map(request, User.class);
        user = userRepository.save(user);
        return modelMapper.map(user, UserResponse.class);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DATA_NOT_FOUND));
        return modelMapper.map(user, UserResponse.class);
    }

    @Transactional(readOnly = true)
    public PaginationResponse getAllUsers(Specification<User> specification, Pageable pageable) {

        Page<User> pageUser = userRepository.findAll(specification, pageable);
        PaginationResponse response = new PaginationResponse();
        PaginationResponse.Meta meta = new PaginationResponse.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());

        meta.setPages(pageUser.getTotalPages());
        meta.setTotal(pageUser.getTotalElements());

        response.setMeta(meta);

        List<UserResponse> listUser = pageUser.getContent()
                .stream().map(user -> modelMapper.map(user, UserResponse.class))
                .collect(Collectors.toList());

        response.setResult(listUser);
        return response;
    }

    @Transactional
    public UserResponse updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DATA_NOT_FOUND));
        modelMapper.map(request, user);
        user = userRepository.save(user);
        return modelMapper.map(user, UserResponse.class);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new AppException(ErrorCode.DATA_NOT_FOUND);
        }
        userRepository.deleteById(id);
    }
}