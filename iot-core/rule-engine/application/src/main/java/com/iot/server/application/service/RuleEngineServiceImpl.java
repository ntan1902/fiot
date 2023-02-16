package com.iot.server.application.service;

import akka.actor.typed.ActorSystem;
import com.iot.server.application.actor.ctx.SystemContext;
import com.iot.server.application.actor.rule_chain.RuleChainActor;
import com.iot.server.application.message.*;
import com.iot.server.dao.dto.RelationDto;
import com.iot.server.dao.dto.RuleNodeDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class RuleEngineServiceImpl implements RuleEngineService {

  private final SystemContext systemContext;
  private final Map<UUID, ActorSystem<ActorMsg>> actorSystemMap = new HashMap<>();

  @Override
  public void process(RuleNodeMsg msg) {
    log.trace("{}", msg);

    UUID ruleChainId = msg.getRuleChainId();
    ActorSystem<ActorMsg> ruleChainActor = actorSystemMap.getOrDefault(ruleChainId, null);
    if (ruleChainActor == null) {
      ruleChainActor = ActorSystem.create(RuleChainActor.create(systemContext, ruleChainId), ruleChainId.toString());
      actorSystemMap.put(ruleChainId, ruleChainActor);
    }
    ruleChainActor.tell(new RuleEngineToRuleChainMsg(msg));

  }

  @Override
  public void initRuleChainActor(UUID ruleChainId) {
    log.info("Initialize rule engine with rule chain id {}", ruleChainId);
    ActorSystem<ActorMsg> ruleChainActor = ActorSystem.create(RuleChainActor.create(systemContext, ruleChainId), ruleChainId.toString());
    actorSystemMap.put(ruleChainId, ruleChainActor);
  }

  @Override
  public void updateRuleChainActor(UUID ruleChainId, List<RuleNodeDto> ruleNodeDtos, List<RelationDto> relationDtos) {
    log.info("Update rule engine with rule chain id {}", ruleChainId);
    ActorSystem<ActorMsg> ruleChainActor = actorSystemMap.getOrDefault(ruleChainId, null);
    if (ruleChainActor == null) {
      ruleChainActor = ActorSystem.create(RuleChainActor.create(systemContext, ruleChainId), ruleChainId.toString());
      actorSystemMap.put(ruleChainId, ruleChainActor);
    } else {
      ruleChainActor.tell(new RuleEngineToRuleChainUpdateMsg(ruleNodeDtos, relationDtos));
    }
  }

  @Override
  public void deleteRuleChainActor(UUID ruleChainId) {
    log.info("Delete rule engine with rule chain id {}", ruleChainId);
    ActorSystem<ActorMsg> ruleChainActor = actorSystemMap.remove(ruleChainId);
    if (ruleChainActor != null) {
      ruleChainActor.tell(new DeleteActorMsg());
    }
  }

}
