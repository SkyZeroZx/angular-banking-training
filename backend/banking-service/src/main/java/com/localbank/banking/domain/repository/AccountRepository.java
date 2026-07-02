package com.localbank.banking.domain.repository;

import com.localbank.banking.domain.model.Account;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AccountRepository {

    Page<Account> search(String search, Pageable pageable);

    Optional<Account> findByNumeroCuenta(String numeroCuenta);

    List<Account> findByClienteId(Long clienteId);

    Account save(Account account);

    void delete(Account account);
}
