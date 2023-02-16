package com.iot.application.service;

import com.iot.application.model.JobInfo;
import com.iot.application.model.TimerInfo;
import com.iot.application.utils.TimerUtils;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SchedulerServiceImpl implements SchedulerService {

  private final Scheduler scheduler;

  public void schedule(final Class<? extends Job> jobClass, final TimerInfo info) {
    final JobDetail jobDetail = TimerUtils.buildJobDetail(jobClass, info);
    final Trigger trigger = TimerUtils.buildTrigger(jobClass, info);

    try {
      scheduler.scheduleJob(jobDetail, trigger);
    } catch (SchedulerException e) {
      log.error(e.getMessage(), e);
    }
  }

  @Override
  public List<JobInfo> getAllRunningJobs() {
    try {
      return scheduler.getJobKeys(GroupMatcher.anyGroup())
              .stream()
              .map(jobKey -> {
                try {
                  final JobDetail jobDetail = scheduler.getJobDetail(jobKey);
                  return (JobInfo) jobDetail.getJobDataMap().get(jobKey.getName());
                } catch (final SchedulerException e) {
                  log.error(e.getMessage(), e);
                  return null;
                }
              })
              .filter(Objects::nonNull)
              .collect(Collectors.toList());
    } catch (final SchedulerException e) {
      log.error(e.getMessage(), e);
      return Collections.emptyList();
    }
  }

  @PostConstruct
  public void init() {
    try {
      scheduler.start();
    } catch (SchedulerException e) {
      log.error(e.getMessage(), e);
    }
  }

  @PreDestroy
  public void preDestroy() {
    try {
      scheduler.shutdown();
    } catch (SchedulerException e) {
      log.error(e.getMessage(), e);
    }
  }
}
