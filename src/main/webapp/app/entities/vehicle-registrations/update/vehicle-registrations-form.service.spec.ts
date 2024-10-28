import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../vehicle-registrations.test-samples';

import { VehicleRegistrationsFormService } from './vehicle-registrations-form.service';

describe('VehicleRegistrations Form Service', () => {
  let service: VehicleRegistrationsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleRegistrationsFormService);
  });

  describe('Service methods', () => {
    describe('createVehicleRegistrationsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVehicleRegistrationsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vehicleNumber: expect.any(Object),
            ownerName: expect.any(Object),
            engineNum: expect.any(Object),
            chassisNum: expect.any(Object),
            vehicleType: expect.any(Object),
            brand: expect.any(Object),
            modelCode: expect.any(Object),
            color: expect.any(Object),
            capacity: expect.any(Object),
            registrationDate: expect.any(Object),
            expirationDate: expect.any(Object),
            issuedBy: expect.any(Object),
            violations: expect.any(Object),
          }),
        );
      });

      it('passing IVehicleRegistrations should create a new form with FormGroup', () => {
        const formGroup = service.createVehicleRegistrationsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vehicleNumber: expect.any(Object),
            ownerName: expect.any(Object),
            engineNum: expect.any(Object),
            chassisNum: expect.any(Object),
            vehicleType: expect.any(Object),
            brand: expect.any(Object),
            modelCode: expect.any(Object),
            color: expect.any(Object),
            capacity: expect.any(Object),
            registrationDate: expect.any(Object),
            expirationDate: expect.any(Object),
            issuedBy: expect.any(Object),
            violations: expect.any(Object),
          }),
        );
      });
    });

    describe('getVehicleRegistrations', () => {
      it('should return NewVehicleRegistrations for default VehicleRegistrations initial value', () => {
        const formGroup = service.createVehicleRegistrationsFormGroup(sampleWithNewData);

        const vehicleRegistrations = service.getVehicleRegistrations(formGroup) as any;

        expect(vehicleRegistrations).toMatchObject(sampleWithNewData);
      });

      it('should return NewVehicleRegistrations for empty VehicleRegistrations initial value', () => {
        const formGroup = service.createVehicleRegistrationsFormGroup();

        const vehicleRegistrations = service.getVehicleRegistrations(formGroup) as any;

        expect(vehicleRegistrations).toMatchObject({});
      });

      it('should return IVehicleRegistrations', () => {
        const formGroup = service.createVehicleRegistrationsFormGroup(sampleWithRequiredData);

        const vehicleRegistrations = service.getVehicleRegistrations(formGroup) as any;

        expect(vehicleRegistrations).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVehicleRegistrations should not enable id FormControl', () => {
        const formGroup = service.createVehicleRegistrationsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVehicleRegistrations should disable id FormControl', () => {
        const formGroup = service.createVehicleRegistrationsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
