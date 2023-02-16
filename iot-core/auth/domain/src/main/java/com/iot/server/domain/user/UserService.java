package com.iot.server.domain.user;

import com.iot.server.dao.dto.UserCredentialsDto;
import com.iot.server.dao.dto.UserDto;

import java.util.List;
import java.util.UUID;

public interface UserService {

  UserDto registerUser(UserDto userDto, String password);

  UserDto findUserWithRolesByEmail(String email);

  UserCredentialsDto findUserCredentialsByUserId(UUID userId);

  UserDto findUserWithExtraInfoById(UUID userId);

  UserDto createUserWithAuthorities(UserDto userDto, List<String> authorities);

  Boolean changePassword(String currentPassword, String newPassword);

  Boolean deleteUser(UUID userId);

  Boolean updateUser(UserDto userDto);

  UserCredentialsDto activateUser(String activateToken, String password);

  List<UserDto> findUsers(UUID userId);
}
