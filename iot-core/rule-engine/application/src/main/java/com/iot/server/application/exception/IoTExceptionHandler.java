package com.iot.server.application.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iot.server.common.enums.ReasonEnum;
import com.iot.server.common.exception.IoTException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class IoTExceptionHandler extends ResponseEntityExceptionHandler implements AccessDeniedHandler {

    private static final Map<ReasonEnum, HttpStatus> reasonToStatusMap = new HashMap<>();

    static {
        reasonToStatusMap.put(ReasonEnum.UNDEFINED, HttpStatus.INTERNAL_SERVER_ERROR);
        reasonToStatusMap.put(ReasonEnum.INVALID_PARAMS, HttpStatus.BAD_REQUEST);
        reasonToStatusMap.put(ReasonEnum.AUTHENTICATION_FAILED, HttpStatus.UNAUTHORIZED);
        reasonToStatusMap.put(ReasonEnum.AUTHORIZATION_FAILED, HttpStatus.UNAUTHORIZED);
        reasonToStatusMap.put(ReasonEnum.PERMISSION_DENIED, HttpStatus.FORBIDDEN);
    }

    private final ObjectMapper objectMapper;

    private static HttpStatus reasonToStatus(ReasonEnum reasonEnum) {
        return reasonToStatusMap.getOrDefault(reasonEnum, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private IoTExceptionResponse getResponse(HttpStatus httpStatus, String message) {
        return new IoTExceptionResponse(
                message,
                httpStatus,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
    }

    @Override
    @ExceptionHandler(AccessDeniedException.class)
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        if (!response.isCommitted()) {
            log.error("Forbidden {}", accessDeniedException.getMessage());

            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpStatus.FORBIDDEN.value());
            objectMapper.writeValue(response.getOutputStream(),
                    getResponse(HttpStatus.FORBIDDEN, "You don't have permission to perform this operation!"));
        }
    }

    @ExceptionHandler(Exception.class)
    public void handle(HttpServletResponse response, Exception exception) {
        log.info("Processing exception [{}]", exception.getMessage());
        if (!response.isCommitted()) {
            try {
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);

                if (exception instanceof IoTException) {
                    handleIoTException((IoTException) exception, response);
                } else if (exception instanceof AuthenticationException) {
                    handleAuthenticationException((AuthenticationException) exception, response);
                } else {
                    handleInternalServerError(exception, response);
                }
            } catch (IOException e) {
                log.error("Can't handle exception", e);
            }
        }
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatus status,
                                                                  WebRequest request) {
        String errMessage = "";
        if (ex.getBindingResult().hasErrors()) {
            errMessage = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        }
        log.error("Request is not valid {}", errMessage);

        return new ResponseEntity<>(getResponse(status, errMessage), status);
    }

    private void handleIoTException(IoTException exception, HttpServletResponse response) throws IOException {
        HttpStatus status = reasonToStatus(exception.getReason());
        response.setStatus(status.value());

        objectMapper.writeValue(response.getOutputStream(),
                getResponse(status, exception.getMessage()));
    }

    private void handleAuthenticationException(AuthenticationException exception, HttpServletResponse response) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        objectMapper.writeValue(response.getOutputStream(),
                getResponse(HttpStatus.UNAUTHORIZED, exception.getMessage()));
    }

    private void handleInternalServerError(Exception exception, HttpServletResponse response) throws IOException {
        response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());

        objectMapper.writeValue(response.getOutputStream(),
                getResponse(HttpStatus.INTERNAL_SERVER_ERROR, exception.getMessage()));
    }

}
