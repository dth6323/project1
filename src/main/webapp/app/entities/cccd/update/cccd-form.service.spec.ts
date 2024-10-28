import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../cccd.test-samples';

import { CCCDFormService } from './cccd-form.service';

describe('CCCD Form Service', () => {
  let service: CCCDFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CCCDFormService);
  });

  describe('Service methods', () => {
    describe('createCCCDFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCCCDFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fullName: expect.any(Object),
            dateBirth: expect.any(Object),
            sex: expect.any(Object),
            nationality: expect.any(Object),
            placeOrigin: expect.any(Object),
            placeResidence: expect.any(Object),
            dateIssue: expect.any(Object),
            dateExpiry: expect.any(Object),
            personalIdentification: expect.any(Object),
            vehicleRegistrations: expect.any(Object),
          }),
        );
      });

      it('passing ICCCD should create a new form with FormGroup', () => {
        const formGroup = service.createCCCDFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fullName: expect.any(Object),
            dateBirth: expect.any(Object),
            sex: expect.any(Object),
            nationality: expect.any(Object),
            placeOrigin: expect.any(Object),
            placeResidence: expect.any(Object),
            dateIssue: expect.any(Object),
            dateExpiry: expect.any(Object),
            personalIdentification: expect.any(Object),
            vehicleRegistrations: expect.any(Object),
          }),
        );
      });
    });

    describe('getCCCD', () => {
      it('should return NewCCCD for default CCCD initial value', () => {
        const formGroup = service.createCCCDFormGroup(sampleWithNewData);

        const cCCD = service.getCCCD(formGroup) as any;

        expect(cCCD).toMatchObject(sampleWithNewData);
      });

      it('should return NewCCCD for empty CCCD initial value', () => {
        const formGroup = service.createCCCDFormGroup();

        const cCCD = service.getCCCD(formGroup) as any;

        expect(cCCD).toMatchObject({});
      });

      it('should return ICCCD', () => {
        const formGroup = service.createCCCDFormGroup(sampleWithRequiredData);

        const cCCD = service.getCCCD(formGroup) as any;

        expect(cCCD).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICCCD should not enable id FormControl', () => {
        const formGroup = service.createCCCDFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCCCD should disable id FormControl', () => {
        const formGroup = service.createCCCDFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
