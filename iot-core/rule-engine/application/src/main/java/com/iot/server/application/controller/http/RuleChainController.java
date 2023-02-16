package com.iot.server.application.controller.http;

import com.iot.server.application.controller.handler.*;
import com.iot.server.application.controller.request.*;
import com.iot.server.application.controller.response.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RuleChainController {

  private final GetRuleChainByIdHandler getRuleChainByIdHandler;
  private final GetRuleChainsHandler getRuleChainsHandler;
  private final GetRuleNodesByRuleChainIdHandler getRuleNodesByRuleChainIdHandler;
  private final UpdateRuleNodesHandler updateRuleNodesHandler;
  private final CreateRuleChainHandler createRuleChainHandler;
  private final DeleteRuleChainHandler deleteRuleChainHandler;

  @GetMapping("/rule-chain/{ruleChainId}")
  @PreAuthorize("hasAnyAuthority('TENANT')")
  public ResponseEntity<GetRuleChainByIdResponse> getRuleChainById(@PathVariable("ruleChainId") String ruleChainId) {
    return ResponseEntity.ok(
            getRuleChainByIdHandler.handleRequest(GetRuleChainByIdRequest.builder()
                    .ruleChainId(ruleChainId)
                    .build())
    );
  }

  @GetMapping("/rule-chains")
  @PreAuthorize("hasAnyAuthority('TENANT')")
  public ResponseEntity<GetRuleChainsResponse> getRuleChains(@RequestParam(value = "page", defaultValue = "0") int page,
                                                             @RequestParam(value = "size", defaultValue = "10") int size,
                                                             @RequestParam(value = "order", defaultValue = "DESC") String order,
                                                             @RequestParam(value = "property", defaultValue = "createdAt") String property) {
    return ResponseEntity.ok(
            getRuleChainsHandler.handleRequest(
                    GetRuleChainsRequest.builder()
                            .page(page)
                            .size(size)
                            .order(order)
                            .property(property)
                            .build()
            )
    );
  }

  @GetMapping("/rule-chain/{ruleChainId}/rule-nodes")
  @PreAuthorize("hasAnyAuthority('TENANT')")
  public ResponseEntity<GetRuleNodesByRuleChainIdResponse> getRuleNodes(@PathVariable("ruleChainId") String ruleChainId) {
    return ResponseEntity.ok(
            getRuleNodesByRuleChainIdHandler.handleRequest(GetRuleNodesByRuleChainIdRequest.builder()
                    .ruleChainId(ruleChainId)
                    .build())
    );
  }

  @PostMapping("/rule-chain")
  @PreAuthorize("hasAnyAuthority('TENANT')")
  public ResponseEntity<CreateRuleChainResponse> createRuleChain(@RequestBody @Valid CreateRuleChainRequest request) {
    return ResponseEntity.ok(
            createRuleChainHandler.handleRequest(request)
    );
  }

  @PostMapping("/rule-chain/rule-nodes")
  @PreAuthorize("hasAnyAuthority('TENANT')")
  public ResponseEntity<UpdateRuleNodesResponse> updateRuleNodes(@RequestBody UpdateRuleNodesRequest request) {
    return ResponseEntity.ok(
            updateRuleNodesHandler.handleRequest(request)
    );
  }

  @DeleteMapping("/rule-chain/{ruleChainId}")
  @PreAuthorize("hasAnyAuthority('TENANT')")
  public ResponseEntity<DeleteRuleChainResponse> deleteRuleChain(@PathVariable("ruleChainId") String ruleChainId) {
    return ResponseEntity.ok(
            deleteRuleChainHandler.handleRequest(DeleteRuleChainRequest.builder()
                    .ruleChainId(ruleChainId)
                    .build())
    );
  }
}
