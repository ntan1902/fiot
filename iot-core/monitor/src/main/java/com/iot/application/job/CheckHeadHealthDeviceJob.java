package com.iot.application.job;

import com.iot.application.dto.DeviceDto;
import com.iot.application.service.DeviceServiceClient;
import com.iot.server.common.request.GetHealthCheckRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.JobExecutionContext;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Component
public class CheckHeadHealthDeviceJob extends AbstractCheckHealthJob {

  private final DeviceServiceClient deviceServiceClient;

  @Override
  @Transactional
  public void executeJob(JobExecutionContext jobExecutionContext) {
    List<DeviceDto> headCheckDevices = deviceDao.findHeadCheckDevices();
    if (headCheckDevices != null && !headCheckDevices.isEmpty()) {
      log.trace("Head check devices: {}", headCheckDevices);

      List<DeviceDto> expiredDevices = new ArrayList<>();
      for (DeviceDto headCheckDevice : headCheckDevices) {
        boolean isHealth = deviceServiceClient.getHealthCheck(
                GetHealthCheckRequest.builder()
                        .domain(headCheckDevice.getHeadDomain())
                        .build()
        );

        if (!isHealth) {
          expiredDevices.add(headCheckDevice);
        }
      }

      if (!expiredDevices.isEmpty()) {
        processExpiredDevices(expiredDevices);
      }
    } else {
      log.trace("There is not any head check devices");
    }
  }

}
