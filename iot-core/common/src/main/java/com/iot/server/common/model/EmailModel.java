package com.iot.server.common.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmailModel {
    private final String from;
    private final String to;
    private final String cc;
    private final String bcc;
    private final String subject;
    private final String body;
    private final boolean html;
}
