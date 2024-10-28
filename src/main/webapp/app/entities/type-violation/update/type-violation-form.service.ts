import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITypeViolation, NewTypeViolation } from '../type-violation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITypeViolation for edit and NewTypeViolationFormGroupInput for create.
 */
type TypeViolationFormGroupInput = ITypeViolation | PartialWithRequiredKeyOf<NewTypeViolation>;

type TypeViolationFormDefaults = Pick<NewTypeViolation, 'id'>;

type TypeViolationFormGroupContent = {
  id: FormControl<ITypeViolation['id'] | NewTypeViolation['id']>;
  violationName: FormControl<ITypeViolation['violationName']>;
  fineAmount: FormControl<ITypeViolation['fineAmount']>;
  violations: FormControl<ITypeViolation['violations']>;
};

export type TypeViolationFormGroup = FormGroup<TypeViolationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TypeViolationFormService {
  createTypeViolationFormGroup(typeViolation: TypeViolationFormGroupInput = { id: null }): TypeViolationFormGroup {
    const typeViolationRawValue = {
      ...this.getFormDefaults(),
      ...typeViolation,
    };
    return new FormGroup<TypeViolationFormGroupContent>({
      id: new FormControl(
        { value: typeViolationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      violationName: new FormControl(typeViolationRawValue.violationName),
      fineAmount: new FormControl(typeViolationRawValue.fineAmount),
      violations: new FormControl(typeViolationRawValue.violations),
    });
  }

  getTypeViolation(form: TypeViolationFormGroup): ITypeViolation | NewTypeViolation {
    return form.getRawValue() as ITypeViolation | NewTypeViolation;
  }

  resetForm(form: TypeViolationFormGroup, typeViolation: TypeViolationFormGroupInput): void {
    const typeViolationRawValue = { ...this.getFormDefaults(), ...typeViolation };
    form.reset(
      {
        ...typeViolationRawValue,
        id: { value: typeViolationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TypeViolationFormDefaults {
    return {
      id: null,
    };
  }
}
