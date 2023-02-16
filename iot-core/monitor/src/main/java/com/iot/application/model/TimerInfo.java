package com.iot.application.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TimerInfo {
   private int totalFireCount;
   private boolean runForever;
   private long repeatIntervalMs;
   private long initialOffsetMs;
   private String callbackData;
}
