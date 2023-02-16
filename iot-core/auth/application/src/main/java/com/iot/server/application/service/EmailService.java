package com.iot.server.application.service;

public interface EmailService {
  void sendActivationEmail(String activationLink, String email);
}
