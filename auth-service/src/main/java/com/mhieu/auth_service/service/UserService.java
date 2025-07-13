package com.mhieu.auth_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.mhieu.auth_service.model.User;
import com.mhieu.auth_service.model.dto.PaginationResponse;
import com.mhieu.auth_service.model.dto.UserResponse;
import com.mhieu.auth_service.model.mapper.UserMapper;
import com.mhieu.auth_service.repository.UserRepository;
import com.mhieu.auth_service.utils.RoleEnum;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public PaginationResponse findAll(Specification<User> spec, Pageable pageable) {
        Page<User> pageUser = userRepository.findAll(spec, pageable);
        PaginationResponse rs = new PaginationResponse();
        PaginationResponse.Meta mt = new PaginationResponse.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(pageUser.getTotalPages());
        mt.setTotal(pageUser.getTotalElements());

        rs.setMeta(mt);

        // remove sensitive data
        List<UserResponse> listUser = pageUser.getContent()
                .stream().map(userMapper::toResponse)
                .collect(Collectors.toList());

        rs.setResult(listUser);

        return rs;
    }

    public Optional<User> findById(long id) {
        return userRepository.findById(id);
    }

    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    public User getUserByEmail(String email) { return userRepository.getUserByEmail(email); }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public void updateUserToken(String token, String email) {
        User currentUser = this.getUserByEmail(email);
        if (currentUser != null) {
            currentUser.setRefreshToken(token);
            this.userRepository.save(currentUser);
        }
    }

    public User getUserByRefreshTokenAndEmail(String token, String email) {
        return this.userRepository.findByRefreshTokenAndEmail(token, email);
    }

    
    public UserResponse createUser(User user) {
        user.setRole(RoleEnum.USER);
        return userMapper.toResponse(this.userRepository.save(user));
    }

    public UserResponse updateUser(User currentUser, User newUser) {

        return userMapper.toResponse(userRepository.save(currentUser));
    }
}
