import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IViolations, NewViolations } from '../violations.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IViolations for edit and NewViolationsFormGroupInput for create.
 */
type ViolationsFormGroupInput = IViolations | PartialWithRequiredKeyOf<NewViolations>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IViolations | NewViolations> = Omit<T, 'violationTime' | 'createdAt'> & {
  violationTime?: string | null;
  createdAt?: string | null;
};

type ViolationsFormRawValue = FormValueOf<IViolations>;

type NewViolationsFormRawValue = FormValueOf<NewViolations>;

type ViolationsFormDefaults = Pick<NewViolations, 'id' | 'violationTime' | 'createdAt' | 'vehicleRegistrations'>;

type ViolationsFormGroupContent = {
  id: FormControl<ViolationsFormRawValue['id'] | NewViolations['id']>;
  violationTime: FormControl<ViolationsFormRawValue['violationTime']>;
  location: FormControl<ViolationsFormRawValue['location']>;
  status: FormControl<ViolationsFormRawValue['status']>;
  evidenceImage: FormControl<ViolationsFormRawValue['evidenceImage']>;
  createdAt: FormControl<ViolationsFormRawValue['createdAt']>;
  vehicleRegistrations: FormControl<ViolationsFormRawValue['vehicleRegistrations']>;
};

export type ViolationsFormGroup = FormGroup<ViolationsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ViolationsFormService {
  createViolationsFormGroup(violations: ViolationsFormGroupInput = { id: null }): ViolationsFormGroup {
    const violationsRawValue = this.convertViolationsToViolationsRawValue({
      ...this.getFormDefaults(),
      ...violations,
    });
    return new FormGroup<ViolationsFormGroupContent>({
      id: new FormControl(
        { value: violationsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      violationTime: new FormControl(violationsRawValue.violationTime),
      location: new FormControl(violationsRawValue.location),
      status: new FormControl(violationsRawValue.status),
      evidenceImage: new FormControl(violationsRawValue.evidenceImage),
      createdAt: new FormControl(violationsRawValue.createdAt),
      vehicleRegistrations: new FormControl(violationsRawValue.vehicleRegistrations ?? []),
    });
  }

  getViolations(form: ViolationsFormGroup): IViolations | NewViolations {
    return this.convertViolationsRawValueToViolations(form.getRawValue() as ViolationsFormRawValue | NewViolationsFormRawValue);
  }

  resetForm(form: ViolationsFormGroup, violations: ViolationsFormGroupInput): void {
    const violationsRawValue = this.convertViolationsToViolationsRawValue({ ...this.getFormDefaults(), ...violations });
    form.reset(
      {
        ...violationsRawValue,
        id: { value: violationsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ViolationsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      violationTime: currentTime,
      createdAt: currentTime,
      vehicleRegistrations: [],
    };
  }

  private convertViolationsRawValueToViolations(
    rawViolations: ViolationsFormRawValue | NewViolationsFormRawValue,
  ): IViolations | NewViolations {
    return {
      ...rawViolations,
      violationTime: dayjs(rawViolations.violationTime, DATE_TIME_FORMAT),
      createdAt: dayjs(rawViolations.createdAt, DATE_TIME_FORMAT),
    };
  }

  private convertViolationsToViolationsRawValue(
    violations: IViolations | (Partial<NewViolations> & ViolationsFormDefaults),
  ): ViolationsFormRawValue | PartialWithRequiredKeyOf<NewViolationsFormRawValue> {
    return {
      ...violations,
      violationTime: violations.violationTime ? violations.violationTime.format(DATE_TIME_FORMAT) : undefined,
      createdAt: violations.createdAt ? violations.createdAt.format(DATE_TIME_FORMAT) : undefined,
      vehicleRegistrations: violations.vehicleRegistrations ?? [],
    };
  }
}
