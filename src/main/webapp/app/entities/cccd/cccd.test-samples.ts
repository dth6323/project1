import dayjs from 'dayjs/esm';

import { ICCCD, NewCCCD } from './cccd.model';

export const sampleWithRequiredData: ICCCD = {
  id: 31711,
};

export const sampleWithPartialData: ICCCD = {
  id: 28989,
  dateBirth: dayjs('2024-10-24T01:37'),
  sex: 'puritan though',
  placeOrigin: 'yum minus',
  placeResidence: 'haversack even vacantly',
};

export const sampleWithFullData: ICCCD = {
  id: 11682,
  fullName: 'eggplant',
  dateBirth: dayjs('2024-10-23T16:47'),
  sex: 'cinder impressive',
  nationality: 'grandson follower recklessly',
  placeOrigin: 'less galvanize',
  placeResidence: 'coaxingly teriyaki',
  dateIssue: dayjs('2024-10-23T11:39'),
  dateExpiry: dayjs('2024-10-23T11:31'),
  personalIdentification: 'below profuse shout',
};

export const sampleWithNewData: NewCCCD = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
