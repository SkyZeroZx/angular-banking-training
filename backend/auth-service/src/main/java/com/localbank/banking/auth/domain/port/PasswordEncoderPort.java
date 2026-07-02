package com.localbank.banking.auth.domain.port;

public interface PasswordEncoderPort {

    String encode(String rawPassword);
}
