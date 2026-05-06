package com.taskmanager.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.admin.seed")
public class AdminSeedProperties {
    private boolean enabled = true;
    private String name = "System Admin";
    private String email = "admin@teamflow.local";
    private String password = "Admin@123";
}
