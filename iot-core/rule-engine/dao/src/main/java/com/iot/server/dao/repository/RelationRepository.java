package com.iot.server.dao.repository;

import com.iot.server.dao.entity.relation.RelationCompositeKey;
import com.iot.server.dao.entity.relation.RelationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
public interface RelationRepository extends JpaRepository<RelationEntity, RelationCompositeKey> {
    List<RelationEntity> findAllByFromIdIn(List<UUID> fromIds);

    @Transactional
    @Modifying
    @Query("DELETE FROM RelationEntity r WHERE r.fromId = :entityId OR r.toId = :entityId")
    void deleteAllByFromIdOrToId(@Param("entityId") UUID entityId);

    @Query("SELECT r " +
            "FROM RelationEntity r " +
            "WHERE (r.fromId IN (:entityIds)) " +
            "OR (r.toId IN (:entityIds))")
    List<RelationEntity> findAllByFromIdInOrToIdIn(@Param("entityIds") List<UUID> entityIds);
}
