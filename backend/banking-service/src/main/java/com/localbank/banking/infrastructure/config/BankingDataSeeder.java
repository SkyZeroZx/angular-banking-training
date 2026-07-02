package com.localbank.banking.infrastructure.config;

import com.localbank.banking.domain.model.Account;
import com.localbank.banking.domain.model.AccountType;
import com.localbank.banking.domain.model.Client;
import com.localbank.banking.domain.model.Transaction;
import com.localbank.banking.domain.model.TransactionType;
import com.localbank.banking.domain.port.PasswordEncoderPort;
import com.localbank.banking.infrastructure.persistence.JpaAccountRepository;
import com.localbank.banking.infrastructure.persistence.JpaClientRepository;
import com.localbank.banking.infrastructure.persistence.JpaTransactionRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
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
public class BankingDataSeeder implements CommandLineRunner {

    private final JpaClientRepository clientRepository;
    private final JpaAccountRepository accountRepository;
    private final JpaTransactionRepository transactionRepository;
    private final PasswordEncoderPort passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (clientRepository.count() > 0) {
            log.info("Banking seed skipped. Client data already exists.");
            return;
        }

        Client jose =
                Client.builder()
                        .clienteId("client-001")
                        .nombre("Jose Lema")
                        .genero("MASCULINO")
                        .edad(32)
                        .identificacion("0102030405")
                        .direccion("Otavalo sn y principal")
                        .telefono("0999999999")
                        .contrasena(passwordEncoder.encode("1234"))
                        .estado(true)
                        .build();

        Client maria =
                Client.builder()
                        .clienteId("client-002")
                        .nombre("Maria Gomez")
                        .genero("FEMENINO")
                        .edad(28)
                        .identificacion("1102030405")
                        .direccion("Amazonas y Naciones Unidas")
                        .telefono("0988888888")
                        .contrasena(passwordEncoder.encode("1234"))
                        .estado(true)
                        .build();

        clientRepository.saveAll(List.of(jose, maria));

        Account joseSavings =
                Account.builder()
                        .numeroCuenta("478758")
                        .tipoCuenta(AccountType.AHORRO)
                        .saldoInicial(new BigDecimal("1000.00"))
                        .estado(true)
                        .cliente(jose)
                        .build();

        Account mariaChecking =
                Account.builder()
                        .numeroCuenta("225487")
                        .tipoCuenta(AccountType.CORRIENTE)
                        .saldoInicial(new BigDecimal("500.00"))
                        .estado(true)
                        .cliente(maria)
                        .build();

        accountRepository.saveAll(List.of(joseSavings, mariaChecking));

        transactionRepository.saveAll(
                List.of(
                        Transaction.builder()
                                .fecha(LocalDateTime.now().minusDays(2))
                                .tipoMovimiento(TransactionType.CREDITO)
                                .valor(new BigDecimal("500.00"))
                                .saldo(new BigDecimal("1500.00"))
                                .cuenta(joseSavings)
                                .build(),
                        Transaction.builder()
                                .fecha(LocalDateTime.now().minusDays(1))
                                .tipoMovimiento(TransactionType.DEBITO)
                                .valor(new BigDecimal("-100.00"))
                                .saldo(new BigDecimal("1400.00"))
                                .cuenta(joseSavings)
                                .build(),
                        Transaction.builder()
                                .fecha(LocalDateTime.now().minusHours(6))
                                .tipoMovimiento(TransactionType.CREDITO)
                                .valor(new BigDecimal("250.00"))
                                .saldo(new BigDecimal("750.00"))
                                .cuenta(mariaChecking)
                                .build()));

        log.info("Banking seed completed. Clients: 2, accounts: 2, transactions: 3.");
    }
}
