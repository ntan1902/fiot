package com.iot.server.common.enums;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ReasonEnum {
   UNDEFINED(0, "Undefined"),
   INVALID_PARAMS(1, "Params is invalid"),
   AUTHENTICATION_FAILED(2, "Authentication failed"),
   AUTHORIZATION_FAILED(3, "Authorization failed"),
   PERMISSION_DENIED(4, "Permission denied"),
   EXPIRED_TOKEN(5, "Expired token"),
   JS_EXECUTE_FAILED(6, "JS executes failed"),
   INVOKE_FUNCTION_FAILED(7, "Invoke function failed"),
   CONVERT_RULE_NODE_MSG_FAILED(8, "Convert rule node message failed"),
   BIND_JS_ARGS_FAILED(9, "Bind javascript arguments failed"),
   CREATED_RELATIONS_CIRCLE(10, "Created relations circle"),
   ALREADY_ACTIVATED(11, "User credentials already activated"),
   SEND_EMAIL_FAILED(12, "Send email failed"),
   ;

   private static final Map<Integer, ReasonEnum> MAP =
       Arrays.stream(ReasonEnum.values())
           .collect(Collectors.toMap(ReasonEnum::getValue, Function.identity()));

   private final int value;
   private final String message;
}
