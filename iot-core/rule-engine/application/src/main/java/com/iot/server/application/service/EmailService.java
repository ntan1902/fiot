package com.iot.server.application.service;

import com.iot.server.common.model.EmailModel;
import org.springframework.mail.javamail.JavaMailSender;

import javax.mail.MessagingException;

public interface EmailService {
    void send(EmailModel emailModel, JavaMailSender javaMailSender) throws MessagingException;
}
