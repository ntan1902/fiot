package com.iot.server.domain.relation;

import com.iot.server.common.entity.BaseEntity;
import com.iot.server.common.enums.ReasonEnum;
import com.iot.server.common.exception.IoTException;
import com.iot.server.dao.dto.RelationDto;
import com.iot.server.dao.entity.relation.RelationCompositeKey;
import com.iot.server.dao.entity.relation.RelationEntity;
import com.iot.server.dao.entity.rule_node.RuleNodeEntity;
import com.iot.server.dao.relation.RelationDao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RelationServiceImpl implements RelationService {

  private final RelationDao relationDao;

  @Override
  public List<RelationDto> findRelationsByFromIds(List<UUID> fromIds) {
    log.trace("{}", fromIds);
    return relationDao.findAllByFromIds(fromIds)
            .stream()
            .map(relationEntity -> new RelationDto(relationEntity))
            .collect(Collectors.toList());
  }

  @Override
  public List<RelationDto> updateRelations(List<RelationEntity> relationEntities, List<RuleNodeEntity> ruleNodeEntities) {
    log.trace("{}, {}", relationEntities, ruleNodeEntities);

    if (relationEntities != null && !relationEntities.isEmpty()) {
      validateCircles(relationEntities);
    }

    List<UUID> ruleNodeIds = ruleNodeEntities.stream()
            .map(BaseEntity::getId)
            .collect(Collectors.toList());
    Map<RelationCompositeKey, Integer> relationIndexMap = getRelationIndexMap(relationEntities);
    List<RelationEntity> foundRelations = relationDao.findAllByFromIdsOrToIds(ruleNodeIds);
    List<RelationEntity> toDelete = new ArrayList<>();

    for (RelationEntity foundRelation : foundRelations) {
      RelationCompositeKey key = RelationCompositeKey.builder()
              .fromId(foundRelation.getFromId())
              .fromType(foundRelation.getFromType())
              .toId(foundRelation.getToId())
              .toType(foundRelation.getToType())
              .name(foundRelation.getName())
              .build();

      Integer index = relationIndexMap.get(key);
      if (index == null) {
        toDelete.add(foundRelation);
      }
    }

    if (!toDelete.isEmpty()) {
      relationDao.deleteRelations(toDelete);
    }

    return relationDao.saveAll(relationEntities)
            .stream()
            .map(RelationDto::new)
            .collect(Collectors.toList());
  }

  private void validateCircles(List<RelationEntity> relationEntities) {
    Map<UUID, Set<UUID>> relationsMap = new HashMap<>();
    for (RelationEntity relationEntity : relationEntities) {
      if (relationEntity.getFromId().equals(relationEntity.getToId())) {
        throw new IoTException(ReasonEnum.CREATED_RELATIONS_CIRCLE, "Can't create the relation to yourself.");
      }
      relationsMap
              .computeIfAbsent(relationEntity.getFromId(), from -> new HashSet<>())
              .add(relationEntity.getToId());
    }
    relationsMap.keySet().forEach(key -> validateCircles(key, relationsMap.get(key), relationsMap));
  }

  private void validateCircles(UUID from, Set<UUID> toList, Map<UUID, Set<UUID>> relationsMap) {
    if (toList == null) {
      return;
    }
    for (UUID to : toList) {
      if (from.equals(to)) {
        throw new IoTException(ReasonEnum.CREATED_RELATIONS_CIRCLE, "Can't create circling relations in rule chain.");
      }
      validateCircles(from, relationsMap.get(to), relationsMap);
    }
  }

  private Map<RelationCompositeKey, Integer> getRelationIndexMap(List<RelationEntity> relationEntities) {
    List<RelationCompositeKey> relationCompositeKeys = relationEntities.stream()
            .map(relationEntity -> RelationCompositeKey.builder()
                    .fromId(relationEntity.getFromId())
                    .fromType(relationEntity.getFromType())
                    .toId(relationEntity.getToId())
                    .toType(relationEntity.getToType())
                    .name(relationEntity.getName())
                    .build())
            .collect(Collectors.toList());
    return relationCompositeKeys.stream()
            .collect(
                    Collectors.toMap(key -> key, relationCompositeKeys::indexOf));
  }
}
