package com.mhieu.auth_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mhieu.auth_service.exception.AppException;
import com.mhieu.auth_service.exception.ErrorCode;
import com.mhieu.auth_service.model.User;
import com.mhieu.auth_service.model.dto.PaginationResponse;
import com.mhieu.auth_service.model.dto.UserChatResponse;
import com.mhieu.auth_service.model.dto.UserResponse;
import com.mhieu.auth_service.model.mapper.UserMapper;
import com.mhieu.auth_service.repository.UserRepository;
import com.mhieu.auth_service.utils.RoleEnum;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
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

        List<UserResponse> listUser = pageUser.getContent()
                .stream().map(userMapper::toResponse)
                .collect(Collectors.toList());

        rs.setResult(listUser);

        return rs;
    }

    public Optional<User> findById(long id) {
        return userRepository.findById(id);
    }

    public void deleteUser(Long id) {
        Optional<User> user = this.userRepository.findById(id);
        if (user.isEmpty()) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        userRepository.delete(user.get());
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

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
        if (this.userRepository.existsByEmail(user.getEmail())) {
            throw new AppException(
                    ErrorCode.EMAIL_EXISTS);
        }
        String hashPassword = this.passwordEncoder.encode(user.getPassword());
        user.setPassword(hashPassword);
        user.setRole(RoleEnum.USER);
        return userMapper.toResponse(this.userRepository.save(user));
    }

    public UserResponse getUserById(Long id) {
        Optional<User> user = this.userRepository.findById(id);
        if (user.isEmpty()) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        return this.userMapper.toResponse(user.get());
    }

    public UserResponse updateUser(User user) {
        Optional<User> currentUser = this.userRepository.findById(user.getId());
        if (currentUser.isEmpty()) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        currentUser.get().setAddress(user.getAddress());
        currentUser.get().setAge(user.getAge());
        currentUser.get().setName(user.getName());
        return userMapper.toResponse(userRepository.save(currentUser.get()));
    }

    public List<UserChatResponse> getAllUserChat() {
        List<UserChatResponse> listUserChats = new ArrayList<>();
        List<User> listUsers = this.userRepository.findAll();
        for (User user : listUsers) {
            UserChatResponse userChatResponse = new UserChatResponse();
            userChatResponse.setUserId(user.getId());
            userChatResponse.setName(user.getName());
            listUserChats.add(userChatResponse);
        }
        return listUserChats;
    }
}
