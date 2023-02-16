package com.iot.application.service;

import com.iot.server.common.request.GetHealthCheckRequest;
import io.netty.channel.ConnectTimeoutException;
import io.netty.handler.timeout.ReadTimeoutException;
import io.netty.handler.timeout.WriteTimeoutException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DeviceServiceClientImpl implements DeviceServiceClient {

  private final DeviceServiceTimed deviceServiceTimed;

  @Override
  public boolean getHealthCheck(GetHealthCheckRequest getHealthCheckRequest) {
    try {
      String path = getHealthCheckRequest.getDomain() + "/";

      getHealthCheck(path, 1);
      log.info("Request: {}", path);
    } catch (RuntimeException exception) {
      log.warn("Fail to head health check, request={}", getHealthCheckRequest);
      return false;
    }
    return true;
  }

  private void getHealthCheck(String path, int attempt) {
    try {
      deviceServiceTimed.head(path);
    } catch (RuntimeException ex) {
      log.warn("Attempt: {} - Reason:", attempt, ex);
      if (attempt >= 3) {
        throw new IllegalArgumentException("Failed to call client after " + attempt + " attempts");
      }

      if (ex instanceof ReadTimeoutException
              || ex instanceof WriteTimeoutException
              || ex.getCause() instanceof ConnectTimeoutException) {

        getHealthCheck(path, attempt + 1);
      }

      throw new IllegalArgumentException(ex.getMessage());
    }
  }
}
