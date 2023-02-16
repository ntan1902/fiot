package com.iot.server.application.action.telegram;

import com.iot.server.application.action.AbstractRuleNodeAction;
import com.iot.server.application.action.RuleNode;
import com.iot.server.application.action.mail.SendEmailConfiguration;
import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.common.model.EmailModel;
import com.iot.server.common.utils.GsonUtils;
import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.request.SendMessage;
import com.pengrad.telegrambot.response.SendResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.util.StringUtils;

import java.util.Properties;

@Slf4j
@RuleNode(
        type = "ACTION",
        name = "send telegram",
        configClazz = SendTelegramConfiguration.class
)
public class SendTelegramAction extends AbstractRuleNodeAction {

    private SendTelegramConfiguration config;
    private TelegramBot telegramBot;

    @Override
    protected void initConfig(String config) {
        this.config = GsonUtils.fromJson(config, SendTelegramConfiguration.class);
        this.telegramBot = new TelegramBot(this.config.getToken());
    }

    @Override
    public void onMsg(RuleNodeMsg msg) {
        try {
            String[] chatIds = config.getChatIds().split(",");

            for (String chatId: chatIds) {
                SendResponse sendResponse = telegramBot.execute(getSendMessage(msg, chatId));

                if (!sendResponse.isOk()) {
                    log.error("Send notification telegram failed {}", chatId);
                    this.ctx.tellFailure(msg);
                }
            }

            this.ctx.tellSuccess(msg);
        } catch (Exception ex) {
            this.ctx.tellFailure(msg);
        }
    }

    private SendMessage getSendMessage(RuleNodeMsg msg, String chatId) {
        return new SendMessage(chatId, processTemplate(config.getMessageTemplate(), msg));
    }

    @Override
    public void stop() {

    }
}
