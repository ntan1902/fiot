package com.iot.server.dao.latest;

import com.iot.server.common.enums.KvType;
import com.iot.server.dao.entity.latest.TsKvLatestCompositeKey;
import com.iot.server.dao.entity.latest.TsKvLatestEntity;
import com.iot.server.dao.repository.TsKvLatestRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class TsKvLatestDaoImpl implements TsKvLatestDao {

    private static final String INSERT_ON_CONFLICT_DO_UPDATE =
            "INSERT INTO ts_kv_latest (entity_id, key, ts, type, bool_v, string_v, long_v, double_v, json_v) " +
                    "VALUES (:entityId, :key, :ts, :type, :boolV, :stringV, :longV, :doubleV, cast(:jsonV AS json)) " +
                    "ON CONFLICT (entity_id, key) " +
                    "DO UPDATE SET type = :type, bool_v = :boolV, string_v = :stringV, long_v = :longV, double_v = :doubleV, json_v = cast(:jsonV AS json)";
    private final TsKvLatestRepository tsKvLatestRepository;
    private final NamedParameterJdbcTemplate jdbcTemplate;

    @Override
    public List<TsKvLatestEntity> findAll() {
        log.debug("Executing");
        return tsKvLatestRepository.findAll();
    }

    @Override
    public TsKvLatestEntity findById(TsKvLatestCompositeKey id) {
        log.debug("{}", id);
        return tsKvLatestRepository.findById(id).orElse(null);
    }

    @Override
    public TsKvLatestEntity save(TsKvLatestEntity entity) {
        log.debug("{}", entity);
        return tsKvLatestRepository.save(entity);
    }

    @Override
    @Transactional
    public boolean removeById(TsKvLatestCompositeKey id) {
        log.debug("{}", id);
        tsKvLatestRepository.deleteById(id);
        return !tsKvLatestRepository.existsById(id);
    }

    @Override
    public void save(List<TsKvLatestEntity> tsKvLatestEntities) {
        List<SqlParameterSource> args = new ArrayList<>();

        for (TsKvLatestEntity tsKvLatestEntity : tsKvLatestEntities) {
            MapSqlParameterSource source = new MapSqlParameterSource()
                    .addValue("entityId", tsKvLatestEntity.getEntityId())
                    .addValue("key", tsKvLatestEntity.getKey())
                    .addValue("ts", tsKvLatestEntity.getTs());


            if (tsKvLatestEntity.getBoolV() != null) {
                source.addValue("boolV", tsKvLatestEntity.getBoolV());
                source.addValue("type", KvType.BOOLEAN.name());
            } else {
                source.addValue("boolV", null);
            }

            if (tsKvLatestEntity.getStringV() != null) {
                source.addValue("stringV", tsKvLatestEntity.getStringV());
                source.addValue("type", KvType.STRING.name());
            } else {
                source.addValue("stringV", null);
            }

            if (tsKvLatestEntity.getLongV() != null) {
                source.addValue("longV", tsKvLatestEntity.getLongV());
                source.addValue("type", KvType.LONG.name());
            } else {
                source.addValue("longV", null);
            }

            if (tsKvLatestEntity.getDoubleV() != null) {
                source.addValue("doubleV", tsKvLatestEntity.getDoubleV());
                source.addValue("type", KvType.DOUBLE.name());
            } else {

                source.addValue("doubleV", null);
            }

            if (tsKvLatestEntity.getJsonV() != null) {
                source.addValue("jsonV", tsKvLatestEntity.getJsonV());
                source.addValue("type", KvType.JSON.name());
            } else {
                source.addValue("jsonV", null);
            }
            args.add(source);

            int batchSize = 100;
            if (args.size() == batchSize) {
                try {
                    jdbcTemplate.batchUpdate(INSERT_ON_CONFLICT_DO_UPDATE, args.toArray(new SqlParameterSource[0]));
                } catch (Exception ex) {
                    log.error("Failed to batch update entities ", ex);
                }
                args.clear();
            }

        }

        if (!args.isEmpty()) {
            try {
                jdbcTemplate.batchUpdate(INSERT_ON_CONFLICT_DO_UPDATE, args.toArray(new SqlParameterSource[0]));
            } catch (Exception ex) {
                log.error("Failed to batch update entities ", ex);
            }
        }
    }

    @Override
    public List<TsKvLatestEntity> findTsKvLatestByEntityId(UUID entityId) {
        log.debug("{}", entityId);

        return tsKvLatestRepository.findAllByEntityId(entityId, Sort.by("ts").descending());
    }
}
