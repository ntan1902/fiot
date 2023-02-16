package com.iot.application.trigger;

import com.iot.application.config.CheckHealthConfig;
import com.iot.application.job.CheckHeadHealthDeviceJob;
import com.iot.application.job.CheckHealthDeviceJob;
import com.iot.application.model.TimerInfo;
import com.iot.application.service.SchedulerService;
import javax.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class CheckHealthDeviceTrigger {

   private final SchedulerService schedulerService;
   private final CheckHealthConfig checkHealthConfig;

   @PostConstruct
   public void init() {
      final TimerInfo timerInfo = TimerInfo.builder()
          .initialOffsetMs(checkHealthConfig.getInitialOffsetMs())
          .repeatIntervalMs(checkHealthConfig.getRepeatIntervalMs())
          .runForever(checkHealthConfig.isRunForever())
          .build();

      schedulerService.schedule(CheckHealthDeviceJob.class, timerInfo);
      schedulerService.schedule(CheckHeadHealthDeviceJob.class, timerInfo);
   }
}
