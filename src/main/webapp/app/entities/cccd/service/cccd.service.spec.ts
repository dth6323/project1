import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ICCCD } from '../cccd.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../cccd.test-samples';

import { CCCDService, RestCCCD } from './cccd.service';

const requireRestSample: RestCCCD = {
  ...sampleWithRequiredData,
  dateBirth: sampleWithRequiredData.dateBirth?.toJSON(),
  dateIssue: sampleWithRequiredData.dateIssue?.toJSON(),
  dateExpiry: sampleWithRequiredData.dateExpiry?.toJSON(),
};

describe('CCCD Service', () => {
  let service: CCCDService;
  let httpMock: HttpTestingController;
  let expectedResult: ICCCD | ICCCD[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(CCCDService);
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

    it('should create a CCCD', () => {
      const cCCD = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(cCCD).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CCCD', () => {
      const cCCD = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(cCCD).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CCCD', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CCCD', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CCCD', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCCCDToCollectionIfMissing', () => {
      it('should add a CCCD to an empty array', () => {
        const cCCD: ICCCD = sampleWithRequiredData;
        expectedResult = service.addCCCDToCollectionIfMissing([], cCCD);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cCCD);
      });

      it('should not add a CCCD to an array that contains it', () => {
        const cCCD: ICCCD = sampleWithRequiredData;
        const cCCDCollection: ICCCD[] = [
          {
            ...cCCD,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCCCDToCollectionIfMissing(cCCDCollection, cCCD);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CCCD to an array that doesn't contain it", () => {
        const cCCD: ICCCD = sampleWithRequiredData;
        const cCCDCollection: ICCCD[] = [sampleWithPartialData];
        expectedResult = service.addCCCDToCollectionIfMissing(cCCDCollection, cCCD);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cCCD);
      });

      it('should add only unique CCCD to an array', () => {
        const cCCDArray: ICCCD[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const cCCDCollection: ICCCD[] = [sampleWithRequiredData];
        expectedResult = service.addCCCDToCollectionIfMissing(cCCDCollection, ...cCCDArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const cCCD: ICCCD = sampleWithRequiredData;
        const cCCD2: ICCCD = sampleWithPartialData;
        expectedResult = service.addCCCDToCollectionIfMissing([], cCCD, cCCD2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cCCD);
        expect(expectedResult).toContain(cCCD2);
      });

      it('should accept null and undefined values', () => {
        const cCCD: ICCCD = sampleWithRequiredData;
        expectedResult = service.addCCCDToCollectionIfMissing([], null, cCCD, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cCCD);
      });

      it('should return initial array if no CCCD is added', () => {
        const cCCDCollection: ICCCD[] = [sampleWithRequiredData];
        expectedResult = service.addCCCDToCollectionIfMissing(cCCDCollection, undefined, null);
        expect(expectedResult).toEqual(cCCDCollection);
      });
    });

    describe('compareCCCD', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCCCD(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCCCD(entity1, entity2);
        const compareResult2 = service.compareCCCD(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCCCD(entity1, entity2);
        const compareResult2 = service.compareCCCD(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCCCD(entity1, entity2);
        const compareResult2 = service.compareCCCD(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
