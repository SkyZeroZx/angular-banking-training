package com.localbank.banking.auth.infrastructure.config;

import com.localbank.banking.auth.domain.model.AuthUser;
import com.localbank.banking.auth.domain.model.Role;
import com.localbank.banking.auth.domain.port.PasswordEncoderPort;
import com.localbank.banking.auth.domain.repository.AuthUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "app.seed", name = "enabled", havingValue = "true")
public class AuthDataSeeder implements CommandLineRunner {

    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin123";

    private final AuthUserRepository authUserRepository;
    private final PasswordEncoderPort passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (authUserRepository.existsByUsername(ADMIN_USERNAME)) {
            log.info("Auth seed skipped. Admin user already exists.");
            return;
        }

        AuthUser admin =
                AuthUser.builder()
                        .username(ADMIN_USERNAME)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .role(Role.ADMIN)
                        .enabled(true)
                        .build();

        authUserRepository.save(admin);
        log.info("Auth seed completed. Admin user: {}", ADMIN_USERNAME);
    }
}
