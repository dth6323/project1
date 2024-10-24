import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '16978523-cfb7-4e2e-8a22-068392920fc2',
};

export const sampleWithPartialData: IAuthority = {
  name: '408b166a-2f90-401f-af6c-9934c9d1f631',
};

export const sampleWithFullData: IAuthority = {
  name: 'fe82270b-d563-425b-9266-6efadb70763b',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
