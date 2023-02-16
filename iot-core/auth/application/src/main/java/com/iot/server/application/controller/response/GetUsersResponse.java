package com.iot.server.application.controller.response;

import com.iot.server.dao.dto.UserDto;
import lombok.Data;

import java.util.List;

@Data
public class GetUsersResponse {
    private List<UserDto> users;
}
