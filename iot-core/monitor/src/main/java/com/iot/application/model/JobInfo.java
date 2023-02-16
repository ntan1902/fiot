package com.iot.application.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobInfo {
  private String className;
  private TimerInfo timerInfo;
}
