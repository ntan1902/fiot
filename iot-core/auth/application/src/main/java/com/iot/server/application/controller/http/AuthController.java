package com.iot.server.application.controller.http;

import com.iot.server.application.controller.handler.ActivateUserHandler;
import com.iot.server.application.controller.handler.ChangePasswordHandler;
import com.iot.server.application.controller.handler.GetJwkSetHandler;
import com.iot.server.application.controller.handler.RegisterHandler;
import com.iot.server.application.controller.request.ActivateUserRequest;
import com.iot.server.application.controller.request.ChangePasswordRequest;
import com.iot.server.application.controller.request.EmptyRequest;
import com.iot.server.application.controller.request.RegisterRequest;
import com.iot.server.application.controller.response.ActivateUserResponse;
import com.iot.server.application.controller.response.ChangePasswordResponse;
import com.iot.server.application.controller.response.RegisterResponse;
import java.util.Map;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {
    private final RegisterHandler registerHandler;
    private final GetJwkSetHandler getJwkSetHandler;
    private final ChangePasswordHandler changePasswordHandler;
    private final ActivateUserHandler activateUserHandler;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(@RequestBody @Valid RegisterRequest request) {
        return ResponseEntity.ok(registerHandler.handleRequest(request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ChangePasswordResponse> changePassword(@RequestBody @Valid ChangePasswordRequest request ) {
        return ResponseEntity.ok(changePasswordHandler.handleRequest(request));
    }

    @GetMapping("/.well-known/jwks.json")
    public ResponseEntity<Map<String, Object>> getJWKSet() {
        return ResponseEntity.ok(getJwkSetHandler.handleRequest(new EmptyRequest()));
    }

    @PostMapping("/activate-user")
    public ResponseEntity<ActivateUserResponse> activateUser(@RequestBody @Valid ActivateUserRequest request ) {
        return ResponseEntity.ok(activateUserHandler.handleRequest(request));
    }
}
