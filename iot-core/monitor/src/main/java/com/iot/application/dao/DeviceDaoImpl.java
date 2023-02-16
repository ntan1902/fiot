package com.iot.application.dao;

import com.iot.application.dto.DeviceDto;
import com.iot.application.entity.DeviceEntity;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DeviceDaoImpl implements DeviceDao {

  private static final String SELECT_EXPIRED_DEVICE =
          "SELECT * "
                  + "FROM device "
                  + "WHERE is_live = true AND (:now - last_active_time) > idle_time AND is_head_check = false";

  private static final String UPDATE_IS_LIVE_DEVICES =
          "UPDATE device "
                  + "SET is_live = :isLive "
                  + "WHERE id = :id";

  private static final String SELECT_USER_IDS_FROM_DEVICE_AND_TENANT =
          "SELECT t.user_id "
                  + "FROM device d, tenant t "
                  + "WHERE (d.tenant_id = t.id OR d.first_tenant_id = t.id) AND d.id = :id";

  private static final String SELECT_USER_IDS_FROM_TENANT_AND_TENANT_DEVICE =
          "SELECT t.user_id "
                  + "FROM tenant_device td, tenant t "
                  + "WHERE td.device_id = :id AND td.tenant_id = t.id";

  private static final String SELECT_USER_IDS_FROM_CUSTOMER_AND_CUSTOMER_DEVICE =
          "SELECT c.user_id "
                  + "FROM customer_device cd, customer c "
                  + "WHERE cd.device_id = :id AND cd.customer_id = c.id";

  private static final String SELECT_HEAD_CHECK_DEVICE =
          "SELECT * "
                  + "FROM device "
                  + "WHERE is_live = true AND is_head_check = true";

  private static final int batchSize = 100;
  private final NamedParameterJdbcTemplate jdbcTemplate;

  @Override
  public List<DeviceDto> findExpiredDevices(Long now) {
    log.debug("Executing");

    MapSqlParameterSource params = new MapSqlParameterSource().addValue("now", now);
    try {
      List<DeviceEntity> deviceEntities = jdbcTemplate.query(
              SELECT_EXPIRED_DEVICE,
              params,
              BeanPropertyRowMapper.newInstance(DeviceEntity.class)
      );

      return deviceEntities.stream()
              .map(DeviceDto::new)
              .collect(Collectors.toList());
    } catch (Exception ex) {
      log.error(ex.getMessage(), ex);
    }
    return null;
  }

  @Override
  public void batchUpdateIsLiveDevices(List<DeviceDto> deviceDtos) {
    List<SqlParameterSource> args = new ArrayList<>();
    for (DeviceDto deviceDto : deviceDtos) {
      MapSqlParameterSource source = new MapSqlParameterSource()
              .addValue("isLive", false)
              .addValue("id", deviceDto.getId());

      args.add(source);

      if (args.size() == batchSize) {
        try {
          jdbcTemplate.batchUpdate(
                  UPDATE_IS_LIVE_DEVICES,
                  args.toArray(new SqlParameterSource[0])
          );
        } catch (Exception ex) {
          log.error(ex.getMessage(), ex);
        }
        args.clear();
      }
    }
    if (!args.isEmpty()) {
      try {
        jdbcTemplate.batchUpdate(
                UPDATE_IS_LIVE_DEVICES,
                args.toArray(new SqlParameterSource[0])
        );
      } catch (Exception ex) {
        log.error(ex.getMessage(), ex);
      }
    }
  }

  @Override
  public Set<UUID> getUserIds(DeviceDto deviceDto) {
    try {
      UUID deviceId = deviceDto.getId();
      List<UUID> tenantUserIds = jdbcTemplate.queryForList(
              SELECT_USER_IDS_FROM_DEVICE_AND_TENANT,
              new MapSqlParameterSource().addValue("id", deviceId),
              UUID.class
      );

      List<UUID> assignedTenantUserIds = jdbcTemplate.queryForList(
              SELECT_USER_IDS_FROM_TENANT_AND_TENANT_DEVICE,
              new MapSqlParameterSource().addValue("id", deviceId),
              UUID.class
      );

      List<UUID> assignedCustomerUserIds = jdbcTemplate.queryForList(
              SELECT_USER_IDS_FROM_CUSTOMER_AND_CUSTOMER_DEVICE,
              new MapSqlParameterSource().addValue("id", deviceId),
              UUID.class
      );

      return Stream.of(tenantUserIds, assignedCustomerUserIds, assignedTenantUserIds)
              .flatMap(Collection::stream)
              .collect(Collectors.toSet());
    } catch (Exception ex) {
      log.error(ex.getMessage(), ex);
    }
    return null;
  }

  @Override
  public List<DeviceDto> findHeadCheckDevices() {
    try {
      List<DeviceEntity> deviceEntities = jdbcTemplate.query(
              SELECT_HEAD_CHECK_DEVICE,
              new MapSqlParameterSource(),
              BeanPropertyRowMapper.newInstance(DeviceEntity.class)
      );

      return deviceEntities.stream()
              .map(DeviceDto::new)
              .collect(Collectors.toList());
    } catch (Exception ex) {
      log.error(ex.getMessage(), ex);
    }
    return null;
  }
}
