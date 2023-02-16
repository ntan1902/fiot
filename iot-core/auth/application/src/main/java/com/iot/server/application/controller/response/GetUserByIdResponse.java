package com.iot.server.application.controller.response;

import com.iot.server.dao.dto.UserDto;
import lombok.Data;

@Data
public class GetUserByIdResponse {
    private UserDto user;
}
