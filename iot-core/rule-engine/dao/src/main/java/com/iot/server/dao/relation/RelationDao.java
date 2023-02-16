package com.iot.server.dao.relation;

import com.iot.server.common.dao.Dao;
import com.iot.server.dao.entity.relation.RelationCompositeKey;
import com.iot.server.dao.entity.relation.RelationEntity;

import java.util.List;
import java.util.UUID;

public interface RelationDao extends Dao<RelationEntity, RelationCompositeKey> {
    List<RelationEntity> findAllByFromIds(List<UUID> fromIds);

    List<RelationEntity> saveAll(List<RelationEntity> relationEntities);

    void deleteRelations(UUID entityId);

    List<RelationEntity> findAllByFromIdsOrToIds(List<UUID> entityIds);

    void deleteRelations(List<RelationEntity> toDelete);
}
