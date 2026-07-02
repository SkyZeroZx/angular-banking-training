package com.localbank.banking.domain.port;

public interface PasswordEncoderPort {

    String encode(String rawPassword);
}
