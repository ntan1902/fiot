package com.iot.server.application.action.mail;

import com.iot.server.application.action.AbstractRuleNodeAction;
import com.iot.server.application.action.RuleNode;
import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.common.model.EmailModel;
import com.iot.server.common.utils.GsonUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.util.StringUtils;

import java.util.Properties;

@Slf4j
@RuleNode(
        type = "ACTION",
        name = "send email",
        configClazz = SendEmailConfiguration.class
)
public class SendEmailAction extends AbstractRuleNodeAction {

    private static final String MAIL_PROP = "mail.";
    private static final String PROTOCOL_PROP = "smtp";

    private SendEmailConfiguration config;
    private JavaMailSenderImpl mailSender;

    @Override
    protected void initConfig(String config) {
        this.config = GsonUtils.fromJson(config, SendEmailConfiguration.class);
        this.mailSender = createMailSender();
    }

    @Override
    public void onMsg(RuleNodeMsg msg) {
        try {
            EmailModel emailModel = getEmailModel(msg);
            this.ctx.getEmailService().send(emailModel, mailSender);
            this.ctx.tellSuccess(msg);
        } catch (Exception ex) {
            this.ctx.tellFailure(msg);
        }
    }

    @Override
    public void stop() {

    }

    private JavaMailSenderImpl createMailSender() {
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
        javaMailSender.setHost(this.config.getSmtpHost());
        javaMailSender.setPort(this.config.getSmtpPort());
        javaMailSender.setUsername(this.config.getUsername());
        javaMailSender.setPassword(this.config.getPassword());
        javaMailSender.setJavaMailProperties(createJavaMailProperties());
        return javaMailSender;
    }

    private Properties createJavaMailProperties() {
        Properties javaMailProperties = new Properties();
        javaMailProperties.put("mail.transport.protocol", PROTOCOL_PROP);
        javaMailProperties.put(MAIL_PROP + PROTOCOL_PROP + ".host", this.config.getSmtpHost());
        javaMailProperties.put(MAIL_PROP + PROTOCOL_PROP + ".port", this.config.getSmtpPort() + "");
        javaMailProperties.put(MAIL_PROP + PROTOCOL_PROP + ".timeout", this.config.getTimeout() + "");
        javaMailProperties.put(MAIL_PROP + PROTOCOL_PROP + ".auth", String.valueOf(StringUtils.hasText(this.config.getUsername())));
        javaMailProperties.put(MAIL_PROP + PROTOCOL_PROP + ".starttls.enable", Boolean.toString(this.config.isEnableTls()));
        return javaMailProperties;
    }

    private EmailModel getEmailModel(RuleNodeMsg msg) {
        EmailModel.EmailModelBuilder builder = EmailModel.builder();
        builder.from(processTemplate(this.config.getFromTemplate(), msg));
        builder.to(processTemplate(this.config.getToTemplate(), msg));
        builder.cc(processTemplate(this.config.getCcTemplate(), msg));
        builder.bcc(processTemplate(this.config.getBccTemplate(), msg));
        builder.html(this.config.getIsHtmlTemplate());

        builder.subject(processTemplate(this.config.getSubjectTemplate(), msg));
        builder.body(processTemplate(this.config.getBodyTemplate(), msg));

        return builder.build();
    }

}
