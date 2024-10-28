import dayjs from 'dayjs/esm';
import { IVehicleRegistrations } from 'app/entities/vehicle-registrations/vehicle-registrations.model';

export interface ICCCD {
  id: number;
  fullName?: string | null;
  dateBirth?: dayjs.Dayjs | null;
  sex?: string | null;
  nationality?: string | null;
  placeOrigin?: string | null;
  placeResidence?: string | null;
  dateIssue?: dayjs.Dayjs | null;
  dateExpiry?: dayjs.Dayjs | null;
  personalIdentification?: string | null;
  vehicleRegistrations?: IVehicleRegistrations | null;
}

export type NewCCCD = Omit<ICCCD, 'id'> & { id: null };
