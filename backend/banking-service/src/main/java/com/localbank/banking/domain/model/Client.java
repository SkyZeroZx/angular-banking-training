package com.localbank.banking.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "cliente")
@PrimaryKeyJoinColumn(name = "id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Client extends Person {

    @Column(name = "cliente_id", nullable = false, unique = true, updatable = false)
    private String clienteId;

    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String contrasena;

    @NotNull(message = "Status is required")
    @Column(nullable = false)
    private Boolean estado;

    @PrePersist
    void ensureClienteId() {
        if (clienteId == null || clienteId.isBlank()) {
            clienteId = UUID.randomUUID().toString();
        }
    }
}
