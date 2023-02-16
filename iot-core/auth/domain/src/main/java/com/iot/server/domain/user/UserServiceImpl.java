package com.iot.server.domain.user;

import com.iot.server.common.enums.AuthorityEnum;
import com.iot.server.common.enums.ReasonEnum;
import com.iot.server.common.exception.IoTException;
import com.iot.server.common.request.TenantRequest;
import com.iot.server.dao.dto.UserCredentialsDto;
import com.iot.server.dao.dto.UserDto;
import com.iot.server.dao.entity.RoleEntity;
import com.iot.server.dao.entity.UserCredentialsEntity;
import com.iot.server.dao.entity.UserEntity;
import com.iot.server.dao.role.RoleDao;
import com.iot.server.dao.user.UserCredentialsDao;
import com.iot.server.dao.user.UserDao;
import com.iot.server.domain.model.SecurityUser;
import com.iot.server.rest.client.EntityServiceClient;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

  public static final String ENABLED = "enabled";
  public static final String ROLES = "roles";
  public static final String ACTIVATE_TOKEN = "activateToken";

  private final UserDao userDao;
  private final UserCredentialsDao userCredentialsDao;
  private final RoleDao roleDao;
  private final EntityServiceClient entityServiceClient;

  private final PasswordEncoder passwordEncoder;

  @Override
  public UserDto registerUser(UserDto userDto, String password) {
    log.info("{}", userDto);

    if (userDao.existsByEmail(userDto.getEmail())) {
      throw new IoTException(ReasonEnum.INVALID_PARAMS, "Email is already existed");
    }

    UserEntity userEntity = new UserEntity(userDto);
    userEntity.setRoles(Stream.of(AuthorityEnum.TENANT)
            .map(authority -> createRoleIfNotFound(authority.name()))
            .collect(Collectors.toSet()));

    UserEntity savedUser = userDao.save(userEntity);

    if (savedUser != null && savedUser.getId() != null) {
      String encodedPassword = passwordEncoder.encode(password);

      UserCredentialsEntity userCredentials = getUserCredentialsEntity(savedUser, encodedPassword);
      userCredentialsDao.save(userCredentials);

      String tenantId = entityServiceClient.registerTenant(getTenantEntity(savedUser));
      savedUser.setTenantId(UUID.fromString(tenantId));
    } else {
      throw new IoTException(ReasonEnum.UNDEFINED, "Can not save user into database");
    }

    return new UserDto(savedUser);
  }

  private SecurityUser getCurrentUser() {
    return (SecurityUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
  }

  private TenantRequest getTenantEntity(UserEntity userEntity) {
    return TenantRequest.builder()
            .userId(userEntity.getId())
            .email(userEntity.getEmail())
            .address("")
            .city("")
            .state("")
            .phone("")
            .title("")
            .country("")
            .deleted(false)
            .createUid(null)
            .updateUid(null)
            .build();
  }

  private UserCredentialsEntity getUserCredentialsEntity(UserEntity savedUser,
                                                         String encodedPassword) {
    return UserCredentialsEntity.builder()
            .user(savedUser)
            .activateToken(UUID.randomUUID().toString())
            .enabled(!encodedPassword.isEmpty())
            .password(encodedPassword)
            .build();
  }

  RoleEntity createRoleIfNotFound(String name) {
    RoleEntity roleEntity = roleDao.findByName(name);
    if (roleEntity == null) {
      roleEntity = roleDao.save(RoleEntity.builder()
              .name(name)
              .build());
    }
    return roleEntity;
  }

  @Override
  public UserDto findUserWithRolesByEmail(String email) {
    log.info("{}", email);
    UserEntity userEntity = userDao.findByEmail(email);
    if (userEntity == null) {
      return null;
    }

    UserDto userDto = new UserDto(userEntity);

    Map<String, Object> extraInfo = new HashMap<>();
    extraInfo.put(ROLES, userEntity.getRoles()
            .stream()
            .map(RoleEntity::getName)
            .collect(Collectors.toSet()));

    userDto.setExtraInfo(extraInfo);
    return userDto;
  }

  @Override
  public UserCredentialsDto findUserCredentialsByUserId(UUID userId) {
    log.info("{}", userId);
    UserCredentialsEntity userCredentialsEntity = userCredentialsDao.findByUserId(userId);
    if (userCredentialsEntity == null) {
      log.error("User credentials is not found {}", userId);
      throw new IoTException(ReasonEnum.INVALID_PARAMS, "User credentials is not found");
    }

    UserCredentialsDto userCredentialsDto = new UserCredentialsDto(userCredentialsEntity);
    userCredentialsDto.setUserId(userId);
    return userCredentialsDto;
  }

  @Override
  public UserDto findUserWithExtraInfoById(UUID userId) {
    log.info("{}", userId);

    UserEntity userEntity = userDao.findById(userId);

    if (userEntity == null) {
      log.error("User is not found {}", userId);
      throw new IoTException(ReasonEnum.INVALID_PARAMS, "User is not found");

    }

    UserDto userDto = new UserDto(userEntity);

    UserCredentialsDto userCredentialsDto = findUserCredentialsByUserId(userId);

    Map<String, Object> extraInfo = new HashMap<>();
    extraInfo.put(ENABLED, userCredentialsDto.isEnabled());
    extraInfo.put(ROLES, userEntity.getRoles()
            .stream()
            .map(RoleEntity::getName)
            .collect(Collectors.toSet()));

    userDto.setExtraInfo(extraInfo);
    return userDto;
  }

  @Override
  public UserDto createUserWithAuthorities(UserDto userDto, List<String> authorities) {
    log.info("{}, {}", userDto, authorities);

    SecurityUser currentUser = getCurrentUser();
    checkPermission(currentUser.getAuthorities(), authorities);

    if (userDao.existsByEmail(userDto.getEmail())) {
      throw new IoTException(ReasonEnum.INVALID_PARAMS, "Email is already existed");
    }

    if (isTenant(currentUser.getAuthorities())) {
      if (currentUser.getTenantId() != null) {
        userDto.setTenantId(currentUser.getTenantId());
      } else {
        userDto.setTenantId(currentUser.getId());
      }
    }

    if (isCustomer(currentUser.getAuthorities())) {
      userDto.setCustomerId(currentUser.getId());

      if (userDto.getTenantId() == null) {
        userDto.setTenantId(currentUser.getTenantId());
      }
    }
    userDto.setCreateUid(currentUser.getId());

    UserEntity userEntity = new UserEntity(userDto);
    userEntity.setRoles(authorities.stream()
            .map(this::createRoleIfNotFound)
            .collect(Collectors.toSet()));

    UserEntity savedUser = userDao.save(userEntity);
    UserDto savedUserDto = new UserDto(savedUser);
    if (savedUser != null && savedUser.getId() != null) {
      UserCredentialsEntity userCredentials = getUserCredentialsEntity(savedUser, "");
      userCredentialsDao.save(userCredentials);

      Map<String, Object> extraInfo = new HashMap<>();
      extraInfo.put(ENABLED, userCredentials.isEnabled());
      extraInfo.put(ROLES, savedUser.getRoles()
              .stream()
              .map(RoleEntity::getName)
              .collect(Collectors.toSet()));
      extraInfo.put(ACTIVATE_TOKEN, userCredentials.getActivateToken());

      savedUserDto.setExtraInfo(extraInfo);
    } else {
      throw new IoTException(ReasonEnum.UNDEFINED, "Can not save user into database");
    }
    return savedUserDto;
  }

  @Override
  public Boolean changePassword(String currentPassword, String newPassword) {
    log.info("{}, {}", currentPassword, newPassword);

    SecurityUser currentUser = getCurrentUser();
    if (currentPassword.equals(newPassword)) {
      throw new IoTException(ReasonEnum.INVALID_PARAMS,
              "Current password and new password are the same");
    }

    UserCredentialsEntity userCredentialsEntity = userCredentialsDao.findByUserId(
            currentUser.getId());
    if (userCredentialsEntity == null) {
      throw new IoTException(ReasonEnum.INVALID_PARAMS, "User is not hound");

    }

    if (!passwordEncoder.matches(currentPassword, userCredentialsEntity.getPassword())) {
      throw new IoTException(ReasonEnum.INVALID_PARAMS,
              "Current password is not matched. Please try again");
    }

    userCredentialsEntity.setPassword(passwordEncoder.encode(newPassword));
    return true;
  }

  @Override
  public Boolean deleteUser(UUID userId) {
    log.info("{}", userId);

    SecurityUser currentUser = getCurrentUser();
    if (currentUser.getId().equals(userId)) {
      throw new IoTException(ReasonEnum.INVALID_PARAMS, "You can't delete yourself");
    }

    UserCredentialsEntity userCredentials = userCredentialsDao.findById(userId);
    UserEntity user;
    if (userCredentials == null) {
      user = userDao.findById(userId);
    } else {
      user = userCredentials.getUser();
    }

    if (user == null) {
      throw new IoTException(ReasonEnum.INVALID_PARAMS, "User is not found");
    }

    if (isAdmin(currentUser.getAuthorities())
            || (isTenant(currentUser.getAuthorities()) && currentUser.getId().equals(user.getTenantId()))
            || (isCustomer(currentUser.getAuthorities()) && currentUser.getId().equals(user.getCustomerId()))) {
      user.setDeleted(true);
      user.setUpdateUid(currentUser.getId());

      if (userCredentials != null) {
        userCredentials.setDeleted(true);
        userCredentials.setUpdateUid(currentUser.getId());
      }

      return true;
    } else {
      throw new IoTException(ReasonEnum.PERMISSION_DENIED,
              "You don't have permission to delete this user");
    }
  }

  @Override
  public Boolean updateUser(UserDto userDto) {
    log.info("{}", userDto);

    SecurityUser currentUser = getCurrentUser();

    UserEntity user = userDao.findById(userDto.getId());
    if (user == null) {
      throw new IoTException(ReasonEnum.INVALID_PARAMS, "User is not found");
    }

    if (isAdmin(currentUser.getAuthorities())
            || (isTenant(currentUser.getAuthorities()) && currentUser.getId()
            .equals(user.getTenantId()))
            || (isCustomer(currentUser.getAuthorities()) && currentUser.getId()
            .equals(user.getCustomerId()))) {

      if (!userDto.getEmail().isEmpty() && !userDto.getEmail().equals(user.getEmail())) {
        user.setEmail(userDto.getEmail());
      }

      if (!userDto.getFirstName().isEmpty() && !userDto.getFirstName()
              .equals(user.getFirstName())) {
        user.setFirstName(userDto.getFirstName());
      }

      if (!userDto.getLastName().isEmpty() && !userDto.getLastName()
              .equals(user.getLastName())) {
        user.setLastName(userDto.getLastName());
      }

      if (userDto.getDeleted() != null && !userDto.getDeleted().equals(user.getDeleted())) {
        user.setDeleted(userDto.getDeleted());
      }

      user.setUpdateUid(currentUser.getId());
      return true;
    } else {
      throw new IoTException(ReasonEnum.PERMISSION_DENIED,
              "You don't have permission to delete this user");
    }
  }

  @Override
  public UserCredentialsDto activateUser(String activateToken, String password) {
    log.info("activateToken={}, password={}", activateToken, password);
    UserCredentialsEntity userCredentials = userCredentialsDao.findByActivateToken(activateToken);

    if (userCredentials == null) {
      throw new IoTException(ReasonEnum.INVALID_PARAMS, String.format("Unable to find user credentials by activateToken [%s]", activateToken));
    }

    if (userCredentials.isEnabled()) {
      throw new IoTException(ReasonEnum.ALREADY_ACTIVATED, "User credentials already activated");
    }

    String encodedPassword = passwordEncoder.encode(password);

    userCredentials.setEnabled(true);
    userCredentials.setActivateToken(null);
    userCredentials.setPassword(encodedPassword);

    return new UserCredentialsDto(userCredentialsDao.save(userCredentials));
  }

  @Override
  public List<UserDto> findUsers(UUID userId) {
    log.info("{}", userId);

    List<UserEntity> userEntities = userDao.findAllByUserIdNotEqual(userId);

    return userEntities.stream()
            .map(userEntity -> {
              UserDto userDto = new UserDto(userEntity);

              UserCredentialsDto userCredentialsDto = findUserCredentialsByUserId(userId);

              Map<String, Object> extraInfo = new HashMap<>();
              extraInfo.put(ENABLED, userCredentialsDto.isEnabled());
              extraInfo.put(ROLES, userEntity.getRoles()
                      .stream()
                      .map(RoleEntity::getName)
                      .collect(Collectors.toSet()));

              userDto.setExtraInfo(extraInfo);
              return userDto;
            })
            .collect(Collectors.toList());

  }

  private void checkPermission(Collection<GrantedAuthority> currentAuthorities,
                               List<String> requestAuthorities) {

    if (isTenant(currentAuthorities)
            && isAdmin(requestAuthorities)) {
      throw new IoTException(ReasonEnum.PERMISSION_DENIED,
              "You don't have permission to create admin user");
    }

    if (isCustomer(currentAuthorities)
            && (isAdmin(requestAuthorities) || isTenant(requestAuthorities))) {
      throw new IoTException(ReasonEnum.PERMISSION_DENIED,
              "You don't have permission to create admin or tenant user");
    }
  }

  public boolean isCustomer(Collection<GrantedAuthority> grantedAuthorities) {
    return grantedAuthorities.stream()
            .anyMatch(grantedAuthority -> grantedAuthority.getAuthority()
                    .equals(AuthorityEnum.CUSTOMER.getAuthority()));
  }

  public boolean isTenant(Collection<GrantedAuthority> grantedAuthorities) {
    return grantedAuthorities.stream()
            .anyMatch(grantedAuthority -> grantedAuthority.getAuthority()
                    .equals(AuthorityEnum.TENANT.getAuthority()));
  }

  public boolean isAdmin(Collection<GrantedAuthority> grantedAuthorities) {
    return grantedAuthorities.stream()
            .anyMatch(grantedAuthority -> grantedAuthority.getAuthority()
                    .equals(AuthorityEnum.ADMIN.getAuthority()));
  }

  public boolean isCustomer(List<String> authorities) {
    return authorities.stream()
            .anyMatch(authority -> authority.equals(AuthorityEnum.CUSTOMER.getAuthority()));
  }

  public boolean isTenant(List<String> authorities) {
    return authorities.stream()
            .anyMatch(authority -> authority.equals(AuthorityEnum.TENANT.getAuthority()));
  }

  public boolean isAdmin(List<String> authorities) {
    return authorities.stream()
            .anyMatch(authority -> authority.equals(AuthorityEnum.ADMIN.getAuthority()));
  }
}
