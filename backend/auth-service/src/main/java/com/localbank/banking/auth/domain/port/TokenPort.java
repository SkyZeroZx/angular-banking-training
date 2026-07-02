package com.localbank.banking.auth.domain.port;

public interface TokenPort {

    String generateToken(String username, String role);

    boolean validateToken(String token);

    String getUsernameFromToken(String token);

    String getRoleFromToken(String token);
}
