package com.iot.server.application.exception;

import org.springframework.http.HttpStatus;

import java.time.ZonedDateTime;

public class IoTExceptionResponse {
   private final String message;
   private final HttpStatus status;
   private final int statusValue;
   private final ZonedDateTime timestamp;

   public IoTExceptionResponse(String message, HttpStatus status, ZonedDateTime timestamp) {
      this.message = message;
      this.status = status;
      this.statusValue = status.value();
      this.timestamp = timestamp;
   }

   public String getMessage() {
      return message;
   }

   public HttpStatus getStatus() {
      return status;
   }

   public ZonedDateTime getTimestamp() {
      return timestamp;
   }

   public int getStatusValue() {
      return statusValue;
   }

   @Override
   public String toString() {
      return "IoTExceptionResponse{" +
              "message='" + message + '\'' +
              ", status=" + status +
              ", statusValue=" + statusValue +
              ", timestamp=" + timestamp +
              '}';
   }
}
