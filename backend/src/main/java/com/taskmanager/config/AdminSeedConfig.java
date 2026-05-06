package com.taskmanager.config;

import com.taskmanager.model.User;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(AdminSeedProperties.class)
public class AdminSeedConfig {

    @Bean
    CommandLineRunner seedAdminUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AdminSeedProperties adminSeedProperties
    ) {
        return args -> {
            if (!adminSeedProperties.isEnabled()) {
                return;
            }

            if (userRepository.existsByEmail(adminSeedProperties.getEmail())) {
                return;
            }

            User admin = User.builder()
                    .name(adminSeedProperties.getName())
                    .email(adminSeedProperties.getEmail())
                    .password(passwordEncoder.encode(adminSeedProperties.getPassword()))
                    .role(User.Role.ADMIN)
                    .build();

            userRepository.save(admin);

            log.info("Seeded default admin user: {}", adminSeedProperties.getEmail());
        };
    }
}
