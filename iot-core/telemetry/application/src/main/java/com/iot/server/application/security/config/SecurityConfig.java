package com.iot.server.application.security.config;

import com.iot.server.application.exception.IoTExceptionHandler;
import com.iot.server.application.security.filter.JwtAuthorizationFilter;
import com.iot.server.application.security.provider.JwtAuthorizationProvider;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    public static final String JWT_TOKEN_QUERY_PARAM = "token";

    private final IoTExceptionHandler ioTExceptionHandler;

    private final JwtAuthorizationProvider jwtAuthorizationProvider;

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        // Get AuthenticationManager Bean
        return super.authenticationManagerBean();
    }

    @Bean
    public JwtAuthorizationFilter jwtAuthorizationFilter() throws Exception {
        List<String> pathsToSkip = Collections.emptyList();
        return new JwtAuthorizationFilter(pathsToSkip, this.authenticationManager(), ioTExceptionHandler);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(jwtAuthorizationProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.headers().cacheControl().and().frameOptions().disable()
                .and()
                .csrf().disable()
                .cors()
                .and().sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and().exceptionHandling().accessDeniedHandler(ioTExceptionHandler)
                .and().authorizeRequests()
                .anyRequest().authenticated().and()
                .addFilterBefore(jwtAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @ConditionalOnMissingBean(CorsFilter.class)
    public CorsFilter corsFilter(@Autowired MvcCorsConfig mvcCorsConfig) {
        if (mvcCorsConfig.getMappings().size() == 0) {
            return new CorsFilter(new UrlBasedCorsConfigurationSource());
        } else {
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.setCorsConfigurations(mvcCorsConfig.getMappings());
            return new CorsFilter(source);
        }
    }

}
