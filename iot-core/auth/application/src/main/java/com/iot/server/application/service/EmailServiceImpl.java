package com.iot.server.application.service;


import com.iot.server.common.enums.ReasonEnum;
import com.iot.server.common.exception.IoTException;
import freemarker.template.Configuration;
import freemarker.template.Template;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.NestedRuntimeException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import javax.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

  private final JavaMailSender javaMailSender;
  private final Configuration freemarkerConfig;

  public static final String TARGET_EMAIL = "targetEmail";

  @Value("${spring.mail.from}")
  private String mailFrom;

  @Override
  public void sendActivationEmail(String activationLink, String email) {
    String subject = "Your account activation on FiOT";

    Map<String, Object> model = new HashMap<>();
    model.put("activationLink", activationLink);
    model.put(TARGET_EMAIL, email);

    String message = mergeTemplateIntoString("activation.ftl", model);

    sendEmail(mailFrom, email, subject, message);
  }

  private String mergeTemplateIntoString(String templateLocation,
                                         Map<String, Object> model) {
    try {
      Template template = freemarkerConfig.getTemplate(templateLocation);
      return FreeMarkerTemplateUtils.processTemplateIntoString(template, model);
    } catch (Exception exception) {
      throw handleMailException(exception);
    }
  }

  private IoTException handleMailException(Exception exception) {
    String message;
    if (exception instanceof NestedRuntimeException) {
      message = ((NestedRuntimeException) exception).getMostSpecificCause().getMessage();
    } else {
      message = exception.getMessage();
    }
    log.warn("Unable to send mail: {}", message);
    return new IoTException(ReasonEnum.SEND_EMAIL_FAILED, String.format("Unable to send mail: %s", message));
  }

  private void sendEmail(String from, String to, String subject, String message) {
    try {
      MimeMessage mimeMsg = javaMailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(mimeMsg, "UTF-8");
      helper.setFrom(from);
      helper.setTo(to);
      helper.setSubject(subject);
      helper.setText(message, true);
      javaMailSender.send(helper.getMimeMessage());
    } catch (Exception exception) {
      throw handleMailException(exception);
    }
  }
}
