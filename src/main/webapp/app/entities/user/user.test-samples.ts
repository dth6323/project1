import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 6923,
  login: '{25lc@a\\)yfKtV\\r6q2sKK\\0k\\APfSpv\\,I',
};

export const sampleWithPartialData: IUser = {
  id: 23596,
  login: 't',
};

export const sampleWithFullData: IUser = {
  id: 27846,
  login: '|NN@oRdZJ\\PsjlJmZ\\\\g\\P-1\\$-',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
