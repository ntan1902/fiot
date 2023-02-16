package com.iot.server.application.controller.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetRuleChainsRequest {
    private int page;
    private int size;
    private String order;
    private String property;
}
