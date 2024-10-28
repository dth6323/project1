import dayjs from 'dayjs/esm';

import { IVehicleRegistrations, NewVehicleRegistrations } from './vehicle-registrations.model';

export const sampleWithRequiredData: IVehicleRegistrations = {
  id: 8784,
};

export const sampleWithPartialData: IVehicleRegistrations = {
  id: 24904,
  ownerName: 'ha',
  engineNum: 'punctually gosh questionably',
  chassisNum: 'pfft',
  vehicleType: 'afford',
  modelCode: 'a',
  color: 'orange',
  registrationDate: dayjs('2024-10-23T22:44'),
};

export const sampleWithFullData: IVehicleRegistrations = {
  id: 14789,
  vehicleNumber: 'jealous whether curiously',
  ownerName: 'shoulder intently',
  engineNum: 'yum adviser',
  chassisNum: 'gee portly',
  vehicleType: 'meh huff huzzah',
  brand: 'outfit',
  modelCode: 'ah',
  color: 'olive',
  capacity: 'via whether pish',
  registrationDate: dayjs('2024-10-23T16:23'),
  expirationDate: dayjs('2024-10-23T15:51'),
  issuedBy: 'rapidly',
};

export const sampleWithNewData: NewVehicleRegistrations = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
