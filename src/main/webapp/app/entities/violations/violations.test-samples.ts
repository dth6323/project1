import dayjs from 'dayjs/esm';

import { IViolations, NewViolations } from './violations.model';

export const sampleWithRequiredData: IViolations = {
  id: 6763,
};

export const sampleWithPartialData: IViolations = {
  id: 14547,
  violationTime: dayjs('2024-10-23T22:10'),
  evidenceImage: 'narrate',
  createdAt: dayjs('2024-10-23T17:23'),
};

export const sampleWithFullData: IViolations = {
  id: 10545,
  violationTime: dayjs('2024-10-24T07:57'),
  location: 'beyond whoa inasmuch',
  status: 'aside uh-huh uh-huh',
  evidenceImage: 'finally times',
  createdAt: dayjs('2024-10-23T18:45'),
};

export const sampleWithNewData: NewViolations = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
