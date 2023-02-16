package com.iot.server.domain;

import java.util.Set;
import java.util.UUID;

public interface WebSocketService {
    void sendTelemetry(Set<UUID> userIds, String telemetryMsg);

    void sendDebugMsg(Set<UUID> userIds, String debugMsg);

    void sendAlarmMsg(Set<UUID> userIds, String alarmMsg);
}
