package com.iot.server.application.cache;

import lombok.AllArgsConstructor;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

@Configuration
@AllArgsConstructor
@EnableCaching
public class RedisConfig {

  private final RedisProperties redisProperties;

  @Bean
  public RedisConnectionFactory lettuceConnectionFactory() {
    RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration(redisProperties.getHost(), redisProperties.getPort());
    redisStandaloneConfiguration.setPassword(redisProperties.getPassword());
    return new LettuceConnectionFactory(redisStandaloneConfiguration);
  }

  @Bean
  public CacheManager cacheManager(RedisConnectionFactory cf) {
    RedisCacheConfiguration configuration = RedisCacheConfiguration
            .defaultCacheConfig()
            .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));
    return RedisCacheManager.builder(cf)
            .cacheDefaults(configuration)
            .transactionAware()
            .build();
  }

}

