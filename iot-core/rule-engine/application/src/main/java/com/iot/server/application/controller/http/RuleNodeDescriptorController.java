package com.iot.server.application.controller.http;

import com.iot.server.application.controller.handler.GetRuleNodeDescriptorsHandler;
import com.iot.server.application.controller.request.GetRuleNodeDescriptorsRequest;
import com.iot.server.application.controller.response.GetRuleNodeDescriptorsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RuleNodeDescriptorController {

    private final GetRuleNodeDescriptorsHandler getRuleNodeDescriptorsHandler;

    @GetMapping("/rule-node-descriptors")
    @PreAuthorize("hasAnyAuthority('TENANT')")
    public ResponseEntity<GetRuleNodeDescriptorsResponse> getRuleNodeDescriptors() {
        return ResponseEntity.ok(
            getRuleNodeDescriptorsHandler.handleRequest(GetRuleNodeDescriptorsRequest.builder().build())
        );
    }
}
