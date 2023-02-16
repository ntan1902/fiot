package com.iot.server.application.controller.http;

import com.iot.server.application.controller.handler.*;
import com.iot.server.application.controller.request.*;
import com.iot.server.application.controller.response.*;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final GetUserByIdHandler getUserByIdHandler;
    private final CreateUserHandler createUserHandler;
    private final DeleteUserHandler deleteUserHandler;
    private final UpdateUserHandler updateUserHandler;
    private final GetUsersHandler getUsersHandler;

    @GetMapping("/user/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TENANT', 'CUSTOMER')")
    public ResponseEntity<GetUserByIdResponse> getUserById(@PathVariable("id") String id) {
        GetUserByIdRequest request = new GetUserByIdRequest();
        request.setUserId(id);
        return ResponseEntity.ok(getUserByIdHandler.handleRequest(request));
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<GetUsersResponse> getUsers(@PathVariable("id") String id) {
        GetUsersRequest request = new GetUsersRequest();
        request.setUserId(id);
        return ResponseEntity.ok(getUsersHandler.handleRequest(request));
    }

    @PostMapping("/user")
    @PreAuthorize("hasAnyAuthority('TENANT', 'CUSTOMER')")
    public ResponseEntity<CreateUserResponse> createUser(@RequestBody @Valid CreateUserRequest request) {
        return ResponseEntity.ok(createUserHandler.handleRequest(request));
    }

    @DeleteMapping("/user/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TENANT', 'CUSTOMER')")
    public ResponseEntity<DeleteUserResponse> deleteUser(@PathVariable("id") String id) {
        DeleteUserRequest request = new DeleteUserRequest();
        request.setUserId(id);
        return ResponseEntity.ok(deleteUserHandler.handleRequest(request));
    }

    @PutMapping("/user/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TENANT', 'CUSTOMER')")
    public ResponseEntity<UpdateUserResponse> updateUser(@PathVariable("id") String id,
                                                         @RequestBody @Valid UpdateUserRequest request) {
        if (request.getId() == null || request.getId().isEmpty()) {
            request.setId(id);
        }
        return ResponseEntity.ok(updateUserHandler.handleRequest(request));
    }
}
