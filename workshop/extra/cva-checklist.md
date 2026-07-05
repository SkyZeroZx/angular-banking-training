# Extra - Checklist CVA

## Implementacion minima

- `writeValue` no debe emitir `onChange`.
- `registerOnChange` guarda callback.
- `registerOnTouched` guarda callback.
- `setDisabledState` refleja disabled en UI.
- Blur o interaccion equivalente llama `onTouched`.
- Cambio de usuario llama `onChange`.

## Validacion

- Si el control valida reglas propias, usa `NG_VALIDATORS`.
- Si la regla depende de varios campos, pertenece al formulario padre.
- No mezclar validacion visual con validacion de dominio.

## Errores comunes

- Llamar `onChange` dentro de `writeValue`.
- Olvidar `setDisabledState`.
- Leer propiedades privadas del control desde tests.
- Hacer el CVA demasiado generico y esconder reglas del dominio.

## Prueba manual rapida

1. Setear valor desde el formulario.
2. Cambiar valor desde UI.
3. Marcar touched.
4. Deshabilitar control.
5. Verificar errores visibles.
