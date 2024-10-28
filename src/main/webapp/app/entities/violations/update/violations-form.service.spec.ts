import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../violations.test-samples';

import { ViolationsFormService } from './violations-form.service';

describe('Violations Form Service', () => {
  let service: ViolationsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViolationsFormService);
  });

  describe('Service methods', () => {
    describe('createViolationsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createViolationsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            violationTime: expect.any(Object),
            location: expect.any(Object),
            status: expect.any(Object),
            evidenceImage: expect.any(Object),
            createdAt: expect.any(Object),
            vehicleRegistrations: expect.any(Object),
          }),
        );
      });

      it('passing IViolations should create a new form with FormGroup', () => {
        const formGroup = service.createViolationsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            violationTime: expect.any(Object),
            location: expect.any(Object),
            status: expect.any(Object),
            evidenceImage: expect.any(Object),
            createdAt: expect.any(Object),
            vehicleRegistrations: expect.any(Object),
          }),
        );
      });
    });

    describe('getViolations', () => {
      it('should return NewViolations for default Violations initial value', () => {
        const formGroup = service.createViolationsFormGroup(sampleWithNewData);

        const violations = service.getViolations(formGroup) as any;

        expect(violations).toMatchObject(sampleWithNewData);
      });

      it('should return NewViolations for empty Violations initial value', () => {
        const formGroup = service.createViolationsFormGroup();

        const violations = service.getViolations(formGroup) as any;

        expect(violations).toMatchObject({});
      });

      it('should return IViolations', () => {
        const formGroup = service.createViolationsFormGroup(sampleWithRequiredData);

        const violations = service.getViolations(formGroup) as any;

        expect(violations).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IViolations should not enable id FormControl', () => {
        const formGroup = service.createViolationsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewViolations should disable id FormControl', () => {
        const formGroup = service.createViolationsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
