package com.iot.server.application.controller.handler;

import com.iot.server.application.controller.request.GetRuleNodesByRuleChainIdRequest;
import com.iot.server.application.controller.response.GetRuleNodesByRuleChainIdResponse;
import com.iot.server.common.exception.IoTException;
import com.iot.server.dao.dto.RelationDto;
import com.iot.server.dao.dto.RuleChainDto;
import com.iot.server.dao.dto.RuleNodeDto;
import com.iot.server.dao.dto.RuleNodeRelation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
public class GetRuleNodesByRuleChainIdHandler extends BaseHandler<GetRuleNodesByRuleChainIdRequest, GetRuleNodesByRuleChainIdResponse> {
    @Override
    protected void validate(GetRuleNodesByRuleChainIdRequest request) throws IoTException {
        validateNotNull("ruleChainId", request.getRuleChainId());
        validateNotEmpty("ruleChainId", request.getRuleChainId());
    }

    @Override
    protected GetRuleNodesByRuleChainIdResponse processRequest(GetRuleNodesByRuleChainIdRequest request) {
        GetRuleNodesByRuleChainIdResponse response = new GetRuleNodesByRuleChainIdResponse();

        UUID ruleChainId = toUUID(request.getRuleChainId());

        RuleChainDto ruleChain = ruleChainService.findRuleChainById(ruleChainId);
        List<RuleNodeDto> ruleNodes = ruleChainService.findRuleNodesById(ruleChainId);

        if (ruleNodes != null && !ruleNodes.isEmpty()) {
            response.setRuleNodes(ruleNodes);

            List<UUID> ruleNodeIds = getRuleNodeIds(ruleNodes);
            Map<UUID, Integer> ruleNodeIndexMap = getRuleNodeIndexMap(ruleNodeIds);

            getFirstRuleNodeIndex(ruleChain.getFirstRuleNodeId(), ruleNodeIndexMap)
                    .ifPresent(response::setFirstRuleNodeIndex);

            List<RelationDto> relationDtos = relationService.findRelationsByFromIds(ruleNodeIds);

            if (relationDtos != null && !relationDtos.isEmpty()) {
                List<RuleNodeRelation> relations = getRuleNodeRelations(ruleNodeIndexMap, relationDtos);

                if (relations != null && !relations.isEmpty()) {
                    response.setRelations(relations);
                }
            }
        }

        return response;
    }

    private List<UUID> getRuleNodeIds(List<RuleNodeDto> ruleNodes) {
        return ruleNodes.stream()
                .map(RuleNodeDto::getId)
                .collect(Collectors.toList());
    }

    private List<RuleNodeRelation> getRuleNodeRelations(Map<UUID, Integer> ruleNodeIndexMap, List<RelationDto> relationDtos) {
        return relationDtos.stream()
                .map(relationDto -> RuleNodeRelation.builder()
                        .fromIndex(ruleNodeIndexMap.get(relationDto.getFromId()))
                        .toIndex(ruleNodeIndexMap.get(relationDto.getToId()))
                        .name(relationDto.getName())
                        .build())
                .collect(Collectors.toList());
    }

    private Map<UUID, Integer> getRuleNodeIndexMap(List<UUID> ruleNodeIds) {
        return ruleNodeIds.stream()
                .collect(
                        Collectors.toMap(ruleNodeId -> ruleNodeId, ruleNodeId -> ruleNodeIds.indexOf(ruleNodeId)));
    }

    private Optional<Integer> getFirstRuleNodeIndex(UUID firstRuleNodeId, Map<UUID, Integer> ruleNodeIndexMap) {
        return ruleNodeIndexMap.entrySet()
                .stream()
                .filter(entry -> Objects.equals(entry.getKey(), firstRuleNodeId))
                .map(entry -> entry.getValue())
                .findAny();
    }
}
