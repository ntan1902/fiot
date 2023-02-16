package com.iot.application.job;

import com.iot.application.dto.DeviceDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Component
public class CheckHealthDeviceJob extends AbstractCheckHealthJob {

  @Override
  @Transactional
  public void executeJob(JobExecutionContext jobExecutionContext) {
    List<DeviceDto> expiredDevices = deviceDao.findExpiredDevices(System.currentTimeMillis());
    if (expiredDevices != null && !expiredDevices.isEmpty()) {
      log.trace("Expired devices: {}", expiredDevices);
      processExpiredDevices(expiredDevices);
    } else {
      log.trace("There is not any expired devices");
    }
  }
}
