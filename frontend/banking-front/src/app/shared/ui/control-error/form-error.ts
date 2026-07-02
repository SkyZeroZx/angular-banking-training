import { InjectionToken } from '@angular/core';
import { ControlErrors } from './interface/control-error.interface';

interface LengthValidationError {
  requiredLength?: number;
}

export const defaultErrors: ControlErrors<LengthValidationError> = {
  required: () => `Este campo es requerido`,
  min: () => `Este campo no cumple el valor minimo`,
  max: () => `Este campo excede el valor maximo`,
  minlength: ({ requiredLength }) =>
    `Se requiere minimo ${requiredLength} caracteres`,
  maxlength: ({ requiredLength }) =>
    `El maximo de caracteres permitos es ${requiredLength}`,
  pattern: () => `Este campo no cumple con la estructura requerida`,
  email: () => 'Debe ingresar un email valido',
};

export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
  factory: () => defaultErrors,
});
