package com.localbank.banking.auth.domain.repository;

import com.localbank.banking.auth.domain.model.AuthUser;
import java.util.Optional;

public interface AuthUserRepository {

    Optional<AuthUser> findByUsername(String username);

    boolean existsByUsername(String username);

    AuthUser save(AuthUser user);
}
