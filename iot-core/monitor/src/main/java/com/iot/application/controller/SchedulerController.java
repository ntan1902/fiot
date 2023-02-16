package com.iot.application.controller;

import com.iot.application.model.JobInfo;
import com.iot.application.service.SchedulerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SchedulerController {

  private final SchedulerService schedulerService;

  @GetMapping("/jobs")
  public List<JobInfo> getAllRunningJobs() {
    return schedulerService.getAllRunningJobs();
  }
}
