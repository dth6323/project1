import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVehicleRegistrations, NewVehicleRegistrations } from '../vehicle-registrations.model';

export type PartialUpdateVehicleRegistrations = Partial<IVehicleRegistrations> & Pick<IVehicleRegistrations, 'id'>;

type RestOf<T extends IVehicleRegistrations | NewVehicleRegistrations> = Omit<T, 'registrationDate' | 'expirationDate'> & {
  registrationDate?: string | null;
  expirationDate?: string | null;
};

export type RestVehicleRegistrations = RestOf<IVehicleRegistrations>;

export type NewRestVehicleRegistrations = RestOf<NewVehicleRegistrations>;

export type PartialUpdateRestVehicleRegistrations = RestOf<PartialUpdateVehicleRegistrations>;

export type EntityResponseType = HttpResponse<IVehicleRegistrations>;
export type EntityArrayResponseType = HttpResponse<IVehicleRegistrations[]>;

@Injectable({ providedIn: 'root' })
export class VehicleRegistrationsService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vehicle-registrations');

  create(vehicleRegistrations: NewVehicleRegistrations): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vehicleRegistrations);
    return this.http
      .post<RestVehicleRegistrations>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(vehicleRegistrations: IVehicleRegistrations): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vehicleRegistrations);
    return this.http
      .put<RestVehicleRegistrations>(`${this.resourceUrl}/${this.getVehicleRegistrationsIdentifier(vehicleRegistrations)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(vehicleRegistrations: PartialUpdateVehicleRegistrations): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vehicleRegistrations);
    return this.http
      .patch<RestVehicleRegistrations>(`${this.resourceUrl}/${this.getVehicleRegistrationsIdentifier(vehicleRegistrations)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVehicleRegistrations>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVehicleRegistrations[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVehicleRegistrationsIdentifier(vehicleRegistrations: Pick<IVehicleRegistrations, 'id'>): number {
    return vehicleRegistrations.id;
  }

  compareVehicleRegistrations(o1: Pick<IVehicleRegistrations, 'id'> | null, o2: Pick<IVehicleRegistrations, 'id'> | null): boolean {
    return o1 && o2 ? this.getVehicleRegistrationsIdentifier(o1) === this.getVehicleRegistrationsIdentifier(o2) : o1 === o2;
  }

  addVehicleRegistrationsToCollectionIfMissing<Type extends Pick<IVehicleRegistrations, 'id'>>(
    vehicleRegistrationsCollection: Type[],
    ...vehicleRegistrationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vehicleRegistrations: Type[] = vehicleRegistrationsToCheck.filter(isPresent);
    if (vehicleRegistrations.length > 0) {
      const vehicleRegistrationsCollectionIdentifiers = vehicleRegistrationsCollection.map(vehicleRegistrationsItem =>
        this.getVehicleRegistrationsIdentifier(vehicleRegistrationsItem),
      );
      const vehicleRegistrationsToAdd = vehicleRegistrations.filter(vehicleRegistrationsItem => {
        const vehicleRegistrationsIdentifier = this.getVehicleRegistrationsIdentifier(vehicleRegistrationsItem);
        if (vehicleRegistrationsCollectionIdentifiers.includes(vehicleRegistrationsIdentifier)) {
          return false;
        }
        vehicleRegistrationsCollectionIdentifiers.push(vehicleRegistrationsIdentifier);
        return true;
      });
      return [...vehicleRegistrationsToAdd, ...vehicleRegistrationsCollection];
    }
    return vehicleRegistrationsCollection;
  }

  protected convertDateFromClient<T extends IVehicleRegistrations | NewVehicleRegistrations | PartialUpdateVehicleRegistrations>(
    vehicleRegistrations: T,
  ): RestOf<T> {
    return {
      ...vehicleRegistrations,
      registrationDate: vehicleRegistrations.registrationDate?.toJSON() ?? null,
      expirationDate: vehicleRegistrations.expirationDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restVehicleRegistrations: RestVehicleRegistrations): IVehicleRegistrations {
    return {
      ...restVehicleRegistrations,
      registrationDate: restVehicleRegistrations.registrationDate ? dayjs(restVehicleRegistrations.registrationDate) : undefined,
      expirationDate: restVehicleRegistrations.expirationDate ? dayjs(restVehicleRegistrations.expirationDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVehicleRegistrations>): HttpResponse<IVehicleRegistrations> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVehicleRegistrations[]>): HttpResponse<IVehicleRegistrations[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
