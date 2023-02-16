package com.iot.application.service;

import com.iot.application.model.JobInfo;
import com.iot.application.model.TimerInfo;
import org.quartz.Job;

import java.util.List;

public interface SchedulerService {

   void schedule(final Class<? extends Job> jobClass, final TimerInfo info);

   List<JobInfo> getAllRunningJobs();
}
