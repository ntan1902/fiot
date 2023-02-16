package com.iot.server.application.controller.handler;

import com.iot.server.application.controller.request.UpdateRuleNodesRequest;
import com.iot.server.application.controller.response.UpdateRuleNodesResponse;
import com.iot.server.common.enums.RuleType;
import com.iot.server.common.exception.IoTException;
import com.iot.server.dao.dto.RelationDto;
import com.iot.server.dao.dto.RuleNodeDto;
import com.iot.server.dao.dto.RuleNodeRelation;
import com.iot.server.dao.entity.relation.RelationEntity;
import com.iot.server.dao.entity.rule_node.RuleNodeEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class UpdateRuleNodesHandler extends BaseHandler<UpdateRuleNodesRequest, UpdateRuleNodesResponse> {
  @Override
  protected void validate(UpdateRuleNodesRequest request) throws IoTException {

  }

  @Override
  protected UpdateRuleNodesResponse processRequest(UpdateRuleNodesRequest request) {
    UpdateRuleNodesResponse response = new UpdateRuleNodesResponse();

    UUID ruleChainId = toUUID(request.getRuleChainId());
    Integer firstRuleNodeIndex = request.getFirstRuleNodeIndex();
    List<RuleNodeDto> ruleNodeDtos = request.getRuleNodes();
    List<RuleNodeRelation> ruleNodeRelations = request.getRelations();

    List<RuleNodeEntity> ruleNodeEntities = getRuleNodeEntities(ruleNodeDtos, ruleChainId);
    List<RuleNodeDto> updatedRuleNodes = ruleChainService.updateRuleNodes(
            ruleChainId,
            firstRuleNodeIndex,
            ruleNodeEntities
    );
    if (updatedRuleNodes != null && !ruleNodeDtos.isEmpty()) {
      response.setRuleNodes(updatedRuleNodes);
    }

    List<RelationDto> relationDtos = relationService.updateRelations(
            getRelationEntities(ruleNodeRelations, updatedRuleNodes),
            ruleNodeEntities
    );
    if (relationDtos != null && !relationDtos.isEmpty()) {
      response.setRelations(ruleNodeRelations);
    }

    if (response.getRuleNodes() != null && response.getRelations() != null) {
      ruleEngineService.updateRuleChainActor(ruleChainId, updatedRuleNodes, relationDtos);
    }

    return response;
  }

  private List<RuleNodeEntity> getRuleNodeEntities(List<RuleNodeDto> ruleNodeDtos, UUID ruleChainId) {
    List<RuleNodeEntity> ruleNodeEntities = ruleNodeDtos.stream()
            .map(RuleNodeEntity::new)
            .collect(Collectors.toList());
    ruleNodeEntities
            .forEach(ruleNodeEntity -> {
              ruleNodeEntity.setRuleChainId(ruleChainId);
              ruleNodeEntity.setCreateUid(getCurrentUser().getId());
            });
    return ruleNodeEntities;
  }

  private List<RelationEntity> getRelationEntities(List<RuleNodeRelation> ruleNodeRelations, List<RuleNodeDto> ruleNodes) {
    Map<Integer, UUID> ruleNodeIndexMap = getRuleNodeIdsMap(ruleNodes);

    return ruleNodeRelations.stream()
            .map(ruleNodeRelation -> {
              RelationEntity relationEntity = RelationEntity.builder()
                      .fromId(ruleNodeIndexMap.get(ruleNodeRelation.getFromIndex()))
                      .toId(ruleNodeIndexMap.get(ruleNodeRelation.getToIndex()))
                      .name(ruleNodeRelation.getName())
                      .build();

              relationEntity.setFromType(RuleType.RULE_NODE.name());
              relationEntity.setToType(RuleType.RULE_NODE.name());

              return relationEntity;
            })
            .collect(Collectors.toList());
  }

  private Map<Integer, UUID> getRuleNodeIdsMap(List<RuleNodeDto> ruleNodes) {
    List<UUID> ruleNodeIds = ruleNodes.stream()
            .map(RuleNodeDto::getId)
            .collect(Collectors.toList());
    return ruleNodeIds.stream()
            .collect(
                    Collectors.toMap(ruleNodeIds::indexOf, ruleNodeId -> ruleNodeId));
  }
}
