package com.iot.server.application.actor.rule_chain;

import akka.actor.typed.javadsl.ActorContext;
import com.iot.server.application.actor.ctx.RuleNodeContext;
import com.iot.server.application.actor.ctx.SystemContext;
import com.iot.server.application.actor.rule_node.RuleNodeActor;
import com.iot.server.application.message.*;
import com.iot.server.dao.dto.RelationDto;
import com.iot.server.dao.dto.RuleChainDto;
import com.iot.server.dao.dto.RuleNodeDto;
import com.iot.server.domain.relation.RelationService;
import com.iot.server.domain.rule_chain.RuleChainService;

import java.util.*;
import java.util.stream.Collectors;

public class RuleChainActorProcessor {
  private final Map<UUID, RuleNodeContext> ruleNodeCtxMap = new HashMap<>();
  private final Map<UUID, List<RelationDto>> ruleNodeRelationsMap = new HashMap<>();
  private final RuleChainService ruleChainService;
  private final RelationService relationService;
  private final ActorContext<ActorMsg> context;
  private final SystemContext systemContext;

  private RuleNodeContext firstRuleNodeContext;
  private RuleChainDto ruleChainDto;

  public RuleChainActorProcessor(ActorContext<ActorMsg> context, SystemContext systemContext, UUID ruleChainId) {
    this.ruleChainService = systemContext.getRuleChainService();
    this.relationService = systemContext.getRelationService();
    this.context = context;
    this.systemContext = systemContext;
    init(ruleChainId);
  }

  private void init(UUID ruleChainId) {
    ruleChainDto = ruleChainService.findRuleChainById(ruleChainId);

    List<RuleNodeDto> ruleNodeDtos =
            ruleChainService.findRuleNodesById(ruleChainId);
    List<RelationDto> relationDtos = getRelations(ruleNodeDtos);

    initRuleNodeCtxMap(ruleNodeDtos);
    initRuleNodeRelationMap(relationDtos);
  }

  private void initRuleNodeCtxMap(List<RuleNodeDto> ruleNodeDtos) {
    ruleNodeDtos.forEach(ruleNodeDto ->
            ruleNodeCtxMap.put(
                    ruleNodeDto.getId(),
                    RuleNodeContext.builder()
                            .self(ruleNodeDto)
                            .ruleChainActor(context.getSelf())
                            .selfActor(
                                    context.spawn(
                                            RuleNodeActor.create(systemContext, ruleNodeDto, context.getSelf()),
                                            ruleNodeDto.getId().toString()
                                    )
                            )
                            .build()
            )
    );

    this.firstRuleNodeContext = ruleNodeCtxMap.get(ruleChainDto.getFirstRuleNodeId());
  }

  private void initRuleNodeRelationMap(List<RelationDto> relationDtos) {
    ruleNodeRelationsMap.clear();
    relationDtos.forEach(relationDto ->
            ruleNodeRelationsMap
                    .computeIfAbsent(relationDto.getFromId(), k -> new ArrayList<>())
                    .add(relationDto));
  }

  private List<RelationDto> getRelations(List<RuleNodeDto> ruleNodes) {
    return relationService.findRelationsByFromIds(
            ruleNodes.stream()
                    .map(RuleNodeDto::getId)
                    .collect(Collectors.toList())
    );
  }


  public void onRuleEngineToRuleChainMsg(RuleEngineToRuleChainMsg envelope) {
    RuleNodeMsg msg = envelope.getMsg();

    if (this.firstRuleNodeContext != null) {
      this.firstRuleNodeContext.getSelfActor().tell(new RuleChainToRuleNodeMsg(msg));
    }
  }

  public void onRuleNodeToRuleChainMsg(RuleNodeToRuleChainMsg envelope) {
    RuleNodeMsg msg = envelope.getMsg();
    Set<String> relationNames = envelope.getRelationNames();

    List<RelationDto> relationDtos = ruleNodeRelationsMap.get(envelope.getPrevRuleNodeId());
    if (relationDtos == null) {
      relationDtos = Collections.emptyList();
    }

    List<RelationDto> relationsByName = relationDtos.stream()
            .filter(r -> contains(relationNames, r.getName()))
            .collect(Collectors.toList());

    for (RelationDto relationDto : relationsByName) {
      RuleNodeContext toRuleNodeContext = ruleNodeCtxMap.get(relationDto.getToId());
      toRuleNodeContext.getSelfActor().tell(new RuleChainToRuleNodeMsg(msg));
    }
  }


  public void onRuleEngineToRuleChainUpdateMsg(RuleEngineToRuleChainUpdateMsg envelope) {
    // Update rule nodes
    for (RuleNodeDto ruleNodeDto : envelope.getRuleNodeDtos()) {
      RuleNodeContext ruleNodeContext = ruleNodeCtxMap.get(ruleNodeDto.getId());
      if (ruleNodeContext == null) {
        ruleNodeCtxMap.put(
                ruleNodeDto.getId(),
                RuleNodeContext.builder()
                        .self(ruleNodeDto)
                        .ruleChainActor(context.getSelf())
                        .selfActor(
                                context.spawn(
                                        RuleNodeActor.create(systemContext, ruleNodeDto, context.getSelf()),
                                        ruleNodeDto.getId().toString()))
                        .build());
      } else {
        ruleNodeContext.setSelf(ruleNodeDto);
        ruleNodeContext.getSelfActor().tell(new RuleChainToRuleNodeUpdateMsg(ruleNodeDto));
      }
    }

    List<UUID> existingRuleNodeIds = envelope.getRuleNodeDtos().stream().map(ruleNodeDto -> ruleNodeDto.getId()).collect(Collectors.toList());
    List<UUID> removedRuleNodeIds = ruleNodeCtxMap.keySet().stream().filter(ruleNodeId -> !existingRuleNodeIds.contains(ruleNodeId)).collect(Collectors.toList());

    removedRuleNodeIds.forEach(ruleNodeId -> {
      RuleNodeContext removedRuleNodeCtx = ruleNodeCtxMap.remove(ruleNodeId);
      removedRuleNodeCtx.getSelfActor().tell(new DeleteActorMsg());

    });

    // Update relations
    initRuleNodeRelationMap(envelope.getRelationDtos());
  }

  public boolean contains(Set<String> relationNames, String name) {
    if (relationNames == null) {
      return true;
    }
    for (String relationType : relationNames) {
      if (relationType.equalsIgnoreCase(name)) {
        return true;
      }
    }
    return false;
  }

  public void onDeleteActorMsg(DeleteActorMsg envelope) {
    ruleNodeCtxMap.values()
                    .forEach(ruleNodeContext -> ruleNodeContext.getSelfActor().tell(envelope));
  }
}
