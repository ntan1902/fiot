package com.iot.server.dao.relation;

import com.iot.server.dao.entity.relation.RelationCompositeKey;
import com.iot.server.dao.entity.relation.RelationEntity;
import com.iot.server.dao.repository.RelationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class RelationDaoImpl implements RelationDao {

    private final RelationRepository relationRepository;

    @Override
    public List<RelationEntity> findAll() {
        log.debug("Executing");
        return relationRepository.findAll();
    }

    @Override
    public RelationEntity findById(RelationCompositeKey id) {
        log.debug("{}", id);
        return null;
    }

    @Override
    @Transactional
    public RelationEntity save(RelationEntity entity) {
        log.debug("{}", entity);
        return relationRepository.save(entity);
    }

    @Override
    @Transactional
    public boolean removeById(RelationCompositeKey id) {
        log.debug("{}", id);
        relationRepository.deleteById(id);
        return !relationRepository.existsById(id);
    }

    @Override
    public List<RelationEntity> findAllByFromIds(List<UUID> fromIds) {
        log.debug("{}", fromIds);
        return relationRepository.findAllByFromIdIn(fromIds);
    }

    @Override
    @Transactional
    public List<RelationEntity> saveAll(List<RelationEntity> relationEntities) {
        log.debug("{}", relationEntities);
        return relationRepository.saveAll(relationEntities);
    }

    @Override
    @Transactional
    public void deleteRelations(UUID entityId) {
        log.trace("{}", entityId);
        relationRepository.deleteAllByFromIdOrToId(entityId);
    }

    @Override
    public List<RelationEntity> findAllByFromIdsOrToIds(List<UUID> entityIds) {
        log.trace("{}", entityIds);
        return relationRepository.findAllByFromIdInOrToIdIn(entityIds);
    }

    @Override
    @Transactional
    public void deleteRelations(List<RelationEntity> relationEntities) {
        log.trace("{}", relationEntities);
        relationRepository.deleteAllInBatch(relationEntities);
    }
}
