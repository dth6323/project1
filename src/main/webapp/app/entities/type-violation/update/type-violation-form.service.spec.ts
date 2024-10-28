import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../type-violation.test-samples';

import { TypeViolationFormService } from './type-violation-form.service';

describe('TypeViolation Form Service', () => {
  let service: TypeViolationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeViolationFormService);
  });

  describe('Service methods', () => {
    describe('createTypeViolationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTypeViolationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            violationName: expect.any(Object),
            fineAmount: expect.any(Object),
            violations: expect.any(Object),
          }),
        );
      });

      it('passing ITypeViolation should create a new form with FormGroup', () => {
        const formGroup = service.createTypeViolationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            violationName: expect.any(Object),
            fineAmount: expect.any(Object),
            violations: expect.any(Object),
          }),
        );
      });
    });

    describe('getTypeViolation', () => {
      it('should return NewTypeViolation for default TypeViolation initial value', () => {
        const formGroup = service.createTypeViolationFormGroup(sampleWithNewData);

        const typeViolation = service.getTypeViolation(formGroup) as any;

        expect(typeViolation).toMatchObject(sampleWithNewData);
      });

      it('should return NewTypeViolation for empty TypeViolation initial value', () => {
        const formGroup = service.createTypeViolationFormGroup();

        const typeViolation = service.getTypeViolation(formGroup) as any;

        expect(typeViolation).toMatchObject({});
      });

      it('should return ITypeViolation', () => {
        const formGroup = service.createTypeViolationFormGroup(sampleWithRequiredData);

        const typeViolation = service.getTypeViolation(formGroup) as any;

        expect(typeViolation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITypeViolation should not enable id FormControl', () => {
        const formGroup = service.createTypeViolationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTypeViolation should disable id FormControl', () => {
        const formGroup = service.createTypeViolationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
