package com.iot.application.utils;

import com.iot.application.model.JobInfo;
import com.iot.application.model.TimerInfo;

import java.util.Date;

import org.quartz.Job;
import org.quartz.JobBuilder;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;

public final class TimerUtils {

  public static JobDetail buildJobDetail(final Class<? extends Job> jobClass, final TimerInfo timerInfo) {
    final JobDataMap jobDataMap = new JobDataMap();
    jobDataMap.put(
            jobClass.getSimpleName(),
            JobInfo.builder()
                    .className(jobClass.getSimpleName())
                    .timerInfo(timerInfo)
                    .build()
    );

    return JobBuilder
            .newJob(jobClass)
            .withIdentity(jobClass.getSimpleName())
            .setJobData(jobDataMap)
            .build();
  }

  public static Trigger buildTrigger(final Class<? extends Job> jobClass, final TimerInfo timerInfo) {
    SimpleScheduleBuilder builder = SimpleScheduleBuilder.simpleSchedule()
            .withIntervalInMilliseconds(timerInfo.getRepeatIntervalMs());

    if (timerInfo.isRunForever()) {
      builder = builder.repeatForever();
    } else {
      builder = builder.withRepeatCount(timerInfo.getTotalFireCount() - 1);
    }

    return TriggerBuilder
            .newTrigger()
            .withIdentity(jobClass.getSimpleName())
            .withSchedule(builder)
            .startAt(new Date(System.currentTimeMillis() + timerInfo.getInitialOffsetMs()))
            .build();
  }
}
