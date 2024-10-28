import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IViolations } from '../violations.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../violations.test-samples';

import { RestViolations, ViolationsService } from './violations.service';

const requireRestSample: RestViolations = {
  ...sampleWithRequiredData,
  violationTime: sampleWithRequiredData.violationTime?.toJSON(),
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
};

describe('Violations Service', () => {
  let service: ViolationsService;
  let httpMock: HttpTestingController;
  let expectedResult: IViolations | IViolations[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ViolationsService);
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

    it('should create a Violations', () => {
      const violations = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(violations).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Violations', () => {
      const violations = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(violations).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Violations', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Violations', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Violations', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addViolationsToCollectionIfMissing', () => {
      it('should add a Violations to an empty array', () => {
        const violations: IViolations = sampleWithRequiredData;
        expectedResult = service.addViolationsToCollectionIfMissing([], violations);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(violations);
      });

      it('should not add a Violations to an array that contains it', () => {
        const violations: IViolations = sampleWithRequiredData;
        const violationsCollection: IViolations[] = [
          {
            ...violations,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addViolationsToCollectionIfMissing(violationsCollection, violations);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Violations to an array that doesn't contain it", () => {
        const violations: IViolations = sampleWithRequiredData;
        const violationsCollection: IViolations[] = [sampleWithPartialData];
        expectedResult = service.addViolationsToCollectionIfMissing(violationsCollection, violations);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(violations);
      });

      it('should add only unique Violations to an array', () => {
        const violationsArray: IViolations[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const violationsCollection: IViolations[] = [sampleWithRequiredData];
        expectedResult = service.addViolationsToCollectionIfMissing(violationsCollection, ...violationsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const violations: IViolations = sampleWithRequiredData;
        const violations2: IViolations = sampleWithPartialData;
        expectedResult = service.addViolationsToCollectionIfMissing([], violations, violations2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(violations);
        expect(expectedResult).toContain(violations2);
      });

      it('should accept null and undefined values', () => {
        const violations: IViolations = sampleWithRequiredData;
        expectedResult = service.addViolationsToCollectionIfMissing([], null, violations, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(violations);
      });

      it('should return initial array if no Violations is added', () => {
        const violationsCollection: IViolations[] = [sampleWithRequiredData];
        expectedResult = service.addViolationsToCollectionIfMissing(violationsCollection, undefined, null);
        expect(expectedResult).toEqual(violationsCollection);
      });
    });

    describe('compareViolations', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareViolations(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareViolations(entity1, entity2);
        const compareResult2 = service.compareViolations(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareViolations(entity1, entity2);
        const compareResult2 = service.compareViolations(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareViolations(entity1, entity2);
        const compareResult2 = service.compareViolations(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
