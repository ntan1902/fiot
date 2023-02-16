package com.iot.server.dao.latest;

import com.iot.server.common.dao.Dao;
import com.iot.server.dao.entity.latest.TsKvLatestCompositeKey;
import com.iot.server.dao.entity.latest.TsKvLatestEntity;
import java.util.List;
import java.util.UUID;

public interface TsKvLatestDao extends Dao<TsKvLatestEntity, TsKvLatestCompositeKey> {
    void save(List<TsKvLatestEntity> tsKvLatestEntities);

    List<TsKvLatestEntity> findTsKvLatestByEntityId(UUID entityId);
}
