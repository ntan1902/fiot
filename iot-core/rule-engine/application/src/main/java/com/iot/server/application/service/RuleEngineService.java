package com.iot.server.application.service;

import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.dao.dto.RelationDto;
import com.iot.server.dao.dto.RuleNodeDto;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.UUID;


public interface RuleEngineService {
  void process(RuleNodeMsg msg) throws ClassNotFoundException, InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException;

  void initRuleChainActor(UUID ruleChainId);

  void updateRuleChainActor(UUID ruleChainId, List<RuleNodeDto> ruleNodeDtos, List<RelationDto> relationDtos);

  void deleteRuleChainActor(UUID ruleChainId);
}
