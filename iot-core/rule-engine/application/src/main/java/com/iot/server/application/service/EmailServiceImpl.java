package com.iot.server.application.service;

import com.iot.server.common.model.EmailModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {
    @Override
    public void send(EmailModel emailModel, JavaMailSender javaMailSender) throws MessagingException {
        log.trace("{}", emailModel);

        MimeMessage mailMsg = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mailMsg, "UTF-8");

        helper.setFrom(emailModel.getFrom());
        helper.setTo(emailModel.getTo().split("\\s*,\\s*"));
        if (StringUtils.hasText(emailModel.getCc())) {
            helper.setCc(emailModel.getCc().split("\\s*,\\s*"));
        }
        if (StringUtils.hasText(emailModel.getBcc())) {
            helper.setBcc(emailModel.getBcc().split("\\s*,\\s*"));
        }
        helper.setSubject(emailModel.getSubject());
        helper.setText(emailModel.getBody(), emailModel.isHtml());

        javaMailSender.send(helper.getMimeMessage());
    }
}
