import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICCCD, NewCCCD } from '../cccd.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICCCD for edit and NewCCCDFormGroupInput for create.
 */
type CCCDFormGroupInput = ICCCD | PartialWithRequiredKeyOf<NewCCCD>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICCCD | NewCCCD> = Omit<T, 'dateBirth' | 'dateIssue' | 'dateExpiry'> & {
  dateBirth?: string | null;
  dateIssue?: string | null;
  dateExpiry?: string | null;
};

type CCCDFormRawValue = FormValueOf<ICCCD>;

type NewCCCDFormRawValue = FormValueOf<NewCCCD>;

type CCCDFormDefaults = Pick<NewCCCD, 'id' | 'dateBirth' | 'dateIssue' | 'dateExpiry'>;

type CCCDFormGroupContent = {
  id: FormControl<CCCDFormRawValue['id'] | NewCCCD['id']>;
  fullName: FormControl<CCCDFormRawValue['fullName']>;
  dateBirth: FormControl<CCCDFormRawValue['dateBirth']>;
  sex: FormControl<CCCDFormRawValue['sex']>;
  nationality: FormControl<CCCDFormRawValue['nationality']>;
  placeOrigin: FormControl<CCCDFormRawValue['placeOrigin']>;
  placeResidence: FormControl<CCCDFormRawValue['placeResidence']>;
  dateIssue: FormControl<CCCDFormRawValue['dateIssue']>;
  dateExpiry: FormControl<CCCDFormRawValue['dateExpiry']>;
  personalIdentification: FormControl<CCCDFormRawValue['personalIdentification']>;
  vehicleRegistrations: FormControl<CCCDFormRawValue['vehicleRegistrations']>;
};

export type CCCDFormGroup = FormGroup<CCCDFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CCCDFormService {
  createCCCDFormGroup(cCCD: CCCDFormGroupInput = { id: null }): CCCDFormGroup {
    const cCCDRawValue = this.convertCCCDToCCCDRawValue({
      ...this.getFormDefaults(),
      ...cCCD,
    });
    return new FormGroup<CCCDFormGroupContent>({
      id: new FormControl(
        { value: cCCDRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      fullName: new FormControl(cCCDRawValue.fullName),
      dateBirth: new FormControl(cCCDRawValue.dateBirth),
      sex: new FormControl(cCCDRawValue.sex),
      nationality: new FormControl(cCCDRawValue.nationality),
      placeOrigin: new FormControl(cCCDRawValue.placeOrigin),
      placeResidence: new FormControl(cCCDRawValue.placeResidence),
      dateIssue: new FormControl(cCCDRawValue.dateIssue),
      dateExpiry: new FormControl(cCCDRawValue.dateExpiry),
      personalIdentification: new FormControl(cCCDRawValue.personalIdentification),
      vehicleRegistrations: new FormControl(cCCDRawValue.vehicleRegistrations),
    });
  }

  getCCCD(form: CCCDFormGroup): ICCCD | NewCCCD {
    return this.convertCCCDRawValueToCCCD(form.getRawValue() as CCCDFormRawValue | NewCCCDFormRawValue);
  }

  resetForm(form: CCCDFormGroup, cCCD: CCCDFormGroupInput): void {
    const cCCDRawValue = this.convertCCCDToCCCDRawValue({ ...this.getFormDefaults(), ...cCCD });
    form.reset(
      {
        ...cCCDRawValue,
        id: { value: cCCDRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CCCDFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateBirth: currentTime,
      dateIssue: currentTime,
      dateExpiry: currentTime,
    };
  }

  private convertCCCDRawValueToCCCD(rawCCCD: CCCDFormRawValue | NewCCCDFormRawValue): ICCCD | NewCCCD {
    return {
      ...rawCCCD,
      dateBirth: dayjs(rawCCCD.dateBirth, DATE_TIME_FORMAT),
      dateIssue: dayjs(rawCCCD.dateIssue, DATE_TIME_FORMAT),
      dateExpiry: dayjs(rawCCCD.dateExpiry, DATE_TIME_FORMAT),
    };
  }

  private convertCCCDToCCCDRawValue(
    cCCD: ICCCD | (Partial<NewCCCD> & CCCDFormDefaults),
  ): CCCDFormRawValue | PartialWithRequiredKeyOf<NewCCCDFormRawValue> {
    return {
      ...cCCD,
      dateBirth: cCCD.dateBirth ? cCCD.dateBirth.format(DATE_TIME_FORMAT) : undefined,
      dateIssue: cCCD.dateIssue ? cCCD.dateIssue.format(DATE_TIME_FORMAT) : undefined,
      dateExpiry: cCCD.dateExpiry ? cCCD.dateExpiry.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
