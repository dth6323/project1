import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IVehicleRegistrations } from '../vehicle-registrations.model';
import {
  sampleWithFullData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithRequiredData,
} from '../vehicle-registrations.test-samples';

import { RestVehicleRegistrations, VehicleRegistrationsService } from './vehicle-registrations.service';

const requireRestSample: RestVehicleRegistrations = {
  ...sampleWithRequiredData,
  registrationDate: sampleWithRequiredData.registrationDate?.toJSON(),
  expirationDate: sampleWithRequiredData.expirationDate?.toJSON(),
};

describe('VehicleRegistrations Service', () => {
  let service: VehicleRegistrationsService;
  let httpMock: HttpTestingController;
  let expectedResult: IVehicleRegistrations | IVehicleRegistrations[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(VehicleRegistrationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a VehicleRegistrations', () => {
      const vehicleRegistrations = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(vehicleRegistrations).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VehicleRegistrations', () => {
      const vehicleRegistrations = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(vehicleRegistrations).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VehicleRegistrations', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VehicleRegistrations', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a VehicleRegistrations', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVehicleRegistrationsToCollectionIfMissing', () => {
      it('should add a VehicleRegistrations to an empty array', () => {
        const vehicleRegistrations: IVehicleRegistrations = sampleWithRequiredData;
        expectedResult = service.addVehicleRegistrationsToCollectionIfMissing([], vehicleRegistrations);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vehicleRegistrations);
      });

      it('should not add a VehicleRegistrations to an array that contains it', () => {
        const vehicleRegistrations: IVehicleRegistrations = sampleWithRequiredData;
        const vehicleRegistrationsCollection: IVehicleRegistrations[] = [
          {
            ...vehicleRegistrations,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVehicleRegistrationsToCollectionIfMissing(vehicleRegistrationsCollection, vehicleRegistrations);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VehicleRegistrations to an array that doesn't contain it", () => {
        const vehicleRegistrations: IVehicleRegistrations = sampleWithRequiredData;
        const vehicleRegistrationsCollection: IVehicleRegistrations[] = [sampleWithPartialData];
        expectedResult = service.addVehicleRegistrationsToCollectionIfMissing(vehicleRegistrationsCollection, vehicleRegistrations);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vehicleRegistrations);
      });

      it('should add only unique VehicleRegistrations to an array', () => {
        const vehicleRegistrationsArray: IVehicleRegistrations[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const vehicleRegistrationsCollection: IVehicleRegistrations[] = [sampleWithRequiredData];
        expectedResult = service.addVehicleRegistrationsToCollectionIfMissing(vehicleRegistrationsCollection, ...vehicleRegistrationsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vehicleRegistrations: IVehicleRegistrations = sampleWithRequiredData;
        const vehicleRegistrations2: IVehicleRegistrations = sampleWithPartialData;
        expectedResult = service.addVehicleRegistrationsToCollectionIfMissing([], vehicleRegistrations, vehicleRegistrations2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vehicleRegistrations);
        expect(expectedResult).toContain(vehicleRegistrations2);
      });

      it('should accept null and undefined values', () => {
        const vehicleRegistrations: IVehicleRegistrations = sampleWithRequiredData;
        expectedResult = service.addVehicleRegistrationsToCollectionIfMissing([], null, vehicleRegistrations, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vehicleRegistrations);
      });

      it('should return initial array if no VehicleRegistrations is added', () => {
        const vehicleRegistrationsCollection: IVehicleRegistrations[] = [sampleWithRequiredData];
        expectedResult = service.addVehicleRegistrationsToCollectionIfMissing(vehicleRegistrationsCollection, undefined, null);
        expect(expectedResult).toEqual(vehicleRegistrationsCollection);
      });
    });

    describe('compareVehicleRegistrations', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVehicleRegistrations(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVehicleRegistrations(entity1, entity2);
        const compareResult2 = service.compareVehicleRegistrations(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVehicleRegistrations(entity1, entity2);
        const compareResult2 = service.compareVehicleRegistrations(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVehicleRegistrations(entity1, entity2);
        const compareResult2 = service.compareVehicleRegistrations(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
