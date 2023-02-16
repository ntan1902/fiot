package com.iot.server.domain.relation;

import com.iot.server.dao.dto.RelationDto;
import com.iot.server.dao.entity.relation.RelationEntity;
import com.iot.server.dao.entity.rule_node.RuleNodeEntity;

import java.util.List;
import java.util.UUID;

public interface RelationService {
    List<RelationDto> findRelationsByFromIds(List<UUID> fromIds);

    List<RelationDto> updateRelations(List<RelationEntity> relationEntities, List<RuleNodeEntity> ruleNodeEntities);
}
