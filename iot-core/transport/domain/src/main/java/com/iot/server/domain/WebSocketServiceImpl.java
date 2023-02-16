package com.iot.server.domain;

import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketServiceImpl implements WebSocketService {
    private final SimpMessageSendingOperations messagingTemplate;

    @Override
    public void sendTelemetry(Set<UUID> userIds, String telemetryMsg) {
        for (UUID userId : userIds) {
            try {
                messagingTemplate.convertAndSend("/topic/telemetry-" + userId, telemetryMsg);
            } catch (MessagingException ex) {
                log.error("Failed to publish message {}", telemetryMsg, ex);
            }
        }
    }

    @Override
    public void sendDebugMsg(Set<UUID> userIds, String debugMsg) {
        for (UUID userId : userIds) {
            try {
                messagingTemplate.convertAndSend("/topic/debug-" + userId, debugMsg);
            } catch (MessagingException ex) {
                log.error("Failed to publish message {}", debugMsg, ex);
            }
        }
    }

    @Override
    public void sendAlarmMsg(Set<UUID> userIds, String alarmMsg) {
        for (UUID userId : userIds) {
            try {
                messagingTemplate.convertAndSend("/topic/alarm-" + userId, alarmMsg);
            } catch (MessagingException ex) {
                log.error("Failed to publish message {}", alarmMsg, ex);
            }
        }
    }
}
