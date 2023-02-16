package com.iot.application.job;

import com.iot.application.dao.DeviceDao;
import com.iot.application.dto.DeviceDto;
import com.iot.server.common.enums.AlarmSeverity;
import com.iot.server.common.model.AlarmModel;
import com.iot.server.common.model.MetaData;
import com.iot.server.common.queue.QueueMsg;
import com.iot.server.common.utils.GsonUtils;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StopWatch;

import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Slf4j
public abstract class AbstractCheckHealthJob implements Job {
  @Autowired
  protected DeviceDao deviceDao;

  @Autowired
  protected RabbitTemplate alarmRabbitTemplate;

  @Override
  public void execute(JobExecutionContext context) {

    String jobFullName = context.getJobDetail().getKey().toString();

    StopWatch sw = new StopWatch();
    sw.start();

    log.info("Started scheduled job: {}", jobFullName);
    if (log.isDebugEnabled()) {
      StringBuilder jobDataMapDump = new StringBuilder();

      // map that contains merged job data from the job detail data map and trigger data map
      JobDataMap jobDataMap = context.getMergedJobDataMap();
      for (Iterator<String> keys = jobDataMap.keySet().iterator(); keys.hasNext(); ) {
        String key = keys.next();
        String value = (String) jobDataMap.get(key);

        jobDataMapDump.append(key)
                .append('=')
                .append(value);

        if (keys.hasNext())
          jobDataMapDump.append(",");
      }

      log.debug("Job data map dump:{}{}", ",", jobDataMapDump);
    }

    executeJob(context);

    sw.stop();

    log.info("Finished scheduled job: {}. Time taken: {}s.", jobFullName, sw.getTotalTimeSeconds());
  }

  protected abstract void executeJob(JobExecutionContext context);

  protected CompletableFuture<Void> processExpiredDevices(List<DeviceDto> expiredDevices) {
    return CompletableFuture
            .runAsync(() -> deviceDao.batchUpdateIsLiveDevices(expiredDevices))
            .thenRun(
                    () -> expiredDevices.forEach(expiredDevice -> {
                      MetaData metaData = getMetaData(expiredDevice);

                      AlarmModel alarmModel = getAlarmModel(expiredDevice);
                      Set<UUID> userIds = deviceDao.getUserIds(expiredDevice);

                      try {
                        alarmRabbitTemplate.convertAndSend(
                                GsonUtils.toJson(
                                        new QueueMsg(UUID.randomUUID().toString(), expiredDevice.getId(),
                                                expiredDevice.getRuleChainId(),
                                                GsonUtils.toJson(alarmModel), metaData, null,
                                                userIds
                                        )
                                )
                        );
                      } catch (Exception ex) {
                        log.error(ex.getMessage(), ex);
                      }
                    })
            );
  }

  private MetaData getMetaData(DeviceDto expiredDevice) {
    MetaData metaData = new MetaData();
    metaData.putValue("deviceName", expiredDevice.getName());
    metaData.putValue("deviceLabel", expiredDevice.getLabel());
    metaData.putValue("deviceType", expiredDevice.getType());
    return metaData;
  }

  private AlarmModel getAlarmModel(DeviceDto deviceDto) {
    return AlarmModel.builder()
            .deviceId(deviceDto.getId())
            .name("Device is dead")
            .severity(AlarmSeverity.CRITICAL.name())
            .detail("Device " + deviceDto.getName() + " is dead")
            .build();
  }
}
