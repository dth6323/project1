import { ITypeViolation, NewTypeViolation } from './type-violation.model';

export const sampleWithRequiredData: ITypeViolation = {
  id: 27702,
};

export const sampleWithPartialData: ITypeViolation = {
  id: 1870,
  violationName: 'hm except',
};

export const sampleWithFullData: ITypeViolation = {
  id: 19097,
  violationName: 'when porter towards',
  fineAmount: 17707.24,
};

export const sampleWithNewData: NewTypeViolation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
