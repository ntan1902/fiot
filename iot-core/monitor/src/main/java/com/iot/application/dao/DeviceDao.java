package com.iot.application.dao;

import com.iot.application.dto.DeviceDto;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface DeviceDao {

  List<DeviceDto> findExpiredDevices(Long now);

  void batchUpdateIsLiveDevices(List<DeviceDto> deviceDtos);

  Set<UUID> getUserIds(DeviceDto deviceDto);

  List<DeviceDto> findHeadCheckDevices();
}
