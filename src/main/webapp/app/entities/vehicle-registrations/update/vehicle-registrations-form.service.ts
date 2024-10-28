import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVehicleRegistrations, NewVehicleRegistrations } from '../vehicle-registrations.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVehicleRegistrations for edit and NewVehicleRegistrationsFormGroupInput for create.
 */
type VehicleRegistrationsFormGroupInput = IVehicleRegistrations | PartialWithRequiredKeyOf<NewVehicleRegistrations>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IVehicleRegistrations | NewVehicleRegistrations> = Omit<T, 'registrationDate' | 'expirationDate'> & {
  registrationDate?: string | null;
  expirationDate?: string | null;
};

type VehicleRegistrationsFormRawValue = FormValueOf<IVehicleRegistrations>;

type NewVehicleRegistrationsFormRawValue = FormValueOf<NewVehicleRegistrations>;

type VehicleRegistrationsFormDefaults = Pick<NewVehicleRegistrations, 'id' | 'registrationDate' | 'expirationDate' | 'violations'>;

type VehicleRegistrationsFormGroupContent = {
  id: FormControl<VehicleRegistrationsFormRawValue['id'] | NewVehicleRegistrations['id']>;
  vehicleNumber: FormControl<VehicleRegistrationsFormRawValue['vehicleNumber']>;
  ownerName: FormControl<VehicleRegistrationsFormRawValue['ownerName']>;
  engineNum: FormControl<VehicleRegistrationsFormRawValue['engineNum']>;
  chassisNum: FormControl<VehicleRegistrationsFormRawValue['chassisNum']>;
  vehicleType: FormControl<VehicleRegistrationsFormRawValue['vehicleType']>;
  brand: FormControl<VehicleRegistrationsFormRawValue['brand']>;
  modelCode: FormControl<VehicleRegistrationsFormRawValue['modelCode']>;
  color: FormControl<VehicleRegistrationsFormRawValue['color']>;
  capacity: FormControl<VehicleRegistrationsFormRawValue['capacity']>;
  registrationDate: FormControl<VehicleRegistrationsFormRawValue['registrationDate']>;
  expirationDate: FormControl<VehicleRegistrationsFormRawValue['expirationDate']>;
  issuedBy: FormControl<VehicleRegistrationsFormRawValue['issuedBy']>;
  violations: FormControl<VehicleRegistrationsFormRawValue['violations']>;
};

export type VehicleRegistrationsFormGroup = FormGroup<VehicleRegistrationsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VehicleRegistrationsFormService {
  createVehicleRegistrationsFormGroup(
    vehicleRegistrations: VehicleRegistrationsFormGroupInput = { id: null },
  ): VehicleRegistrationsFormGroup {
    const vehicleRegistrationsRawValue = this.convertVehicleRegistrationsToVehicleRegistrationsRawValue({
      ...this.getFormDefaults(),
      ...vehicleRegistrations,
    });
    return new FormGroup<VehicleRegistrationsFormGroupContent>({
      id: new FormControl(
        { value: vehicleRegistrationsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      vehicleNumber: new FormControl(vehicleRegistrationsRawValue.vehicleNumber),
      ownerName: new FormControl(vehicleRegistrationsRawValue.ownerName),
      engineNum: new FormControl(vehicleRegistrationsRawValue.engineNum),
      chassisNum: new FormControl(vehicleRegistrationsRawValue.chassisNum),
      vehicleType: new FormControl(vehicleRegistrationsRawValue.vehicleType),
      brand: new FormControl(vehicleRegistrationsRawValue.brand),
      modelCode: new FormControl(vehicleRegistrationsRawValue.modelCode),
      color: new FormControl(vehicleRegistrationsRawValue.color),
      capacity: new FormControl(vehicleRegistrationsRawValue.capacity),
      registrationDate: new FormControl(vehicleRegistrationsRawValue.registrationDate),
      expirationDate: new FormControl(vehicleRegistrationsRawValue.expirationDate),
      issuedBy: new FormControl(vehicleRegistrationsRawValue.issuedBy),
      violations: new FormControl(vehicleRegistrationsRawValue.violations ?? []),
    });
  }

  getVehicleRegistrations(form: VehicleRegistrationsFormGroup): IVehicleRegistrations | NewVehicleRegistrations {
    return this.convertVehicleRegistrationsRawValueToVehicleRegistrations(
      form.getRawValue() as VehicleRegistrationsFormRawValue | NewVehicleRegistrationsFormRawValue,
    );
  }

  resetForm(form: VehicleRegistrationsFormGroup, vehicleRegistrations: VehicleRegistrationsFormGroupInput): void {
    const vehicleRegistrationsRawValue = this.convertVehicleRegistrationsToVehicleRegistrationsRawValue({
      ...this.getFormDefaults(),
      ...vehicleRegistrations,
    });
    form.reset(
      {
        ...vehicleRegistrationsRawValue,
        id: { value: vehicleRegistrationsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): VehicleRegistrationsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      registrationDate: currentTime,
      expirationDate: currentTime,
      violations: [],
    };
  }

  private convertVehicleRegistrationsRawValueToVehicleRegistrations(
    rawVehicleRegistrations: VehicleRegistrationsFormRawValue | NewVehicleRegistrationsFormRawValue,
  ): IVehicleRegistrations | NewVehicleRegistrations {
    return {
      ...rawVehicleRegistrations,
      registrationDate: dayjs(rawVehicleRegistrations.registrationDate, DATE_TIME_FORMAT),
      expirationDate: dayjs(rawVehicleRegistrations.expirationDate, DATE_TIME_FORMAT),
    };
  }

  private convertVehicleRegistrationsToVehicleRegistrationsRawValue(
    vehicleRegistrations: IVehicleRegistrations | (Partial<NewVehicleRegistrations> & VehicleRegistrationsFormDefaults),
  ): VehicleRegistrationsFormRawValue | PartialWithRequiredKeyOf<NewVehicleRegistrationsFormRawValue> {
    return {
      ...vehicleRegistrations,
      registrationDate: vehicleRegistrations.registrationDate ? vehicleRegistrations.registrationDate.format(DATE_TIME_FORMAT) : undefined,
      expirationDate: vehicleRegistrations.expirationDate ? vehicleRegistrations.expirationDate.format(DATE_TIME_FORMAT) : undefined,
      violations: vehicleRegistrations.violations ?? [],
    };
  }
}
