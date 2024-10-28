import { IViolations } from 'app/entities/violations/violations.model';

export interface ITypeViolation {
  id: number;
  violationName?: string | null;
  fineAmount?: number | null;
  violations?: IViolations | null;
}

export type NewTypeViolation = Omit<ITypeViolation, 'id'> & { id: null };
