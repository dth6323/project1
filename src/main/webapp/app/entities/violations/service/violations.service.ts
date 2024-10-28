import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IViolations, NewViolations } from '../violations.model';

export type PartialUpdateViolations = Partial<IViolations> & Pick<IViolations, 'id'>;

type RestOf<T extends IViolations | NewViolations> = Omit<T, 'violationTime' | 'createdAt'> & {
  violationTime?: string | null;
  createdAt?: string | null;
};

export type RestViolations = RestOf<IViolations>;

export type NewRestViolations = RestOf<NewViolations>;

export type PartialUpdateRestViolations = RestOf<PartialUpdateViolations>;

export type EntityResponseType = HttpResponse<IViolations>;
export type EntityArrayResponseType = HttpResponse<IViolations[]>;

@Injectable({ providedIn: 'root' })
export class ViolationsService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/violations');

  create(violations: NewViolations): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(violations);
    return this.http
      .post<RestViolations>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(violations: IViolations): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(violations);
    return this.http
      .put<RestViolations>(`${this.resourceUrl}/${this.getViolationsIdentifier(violations)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(violations: PartialUpdateViolations): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(violations);
    return this.http
      .patch<RestViolations>(`${this.resourceUrl}/${this.getViolationsIdentifier(violations)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestViolations>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestViolations[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getViolationsIdentifier(violations: Pick<IViolations, 'id'>): number {
    return violations.id;
  }

  compareViolations(o1: Pick<IViolations, 'id'> | null, o2: Pick<IViolations, 'id'> | null): boolean {
    return o1 && o2 ? this.getViolationsIdentifier(o1) === this.getViolationsIdentifier(o2) : o1 === o2;
  }

  addViolationsToCollectionIfMissing<Type extends Pick<IViolations, 'id'>>(
    violationsCollection: Type[],
    ...violationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const violations: Type[] = violationsToCheck.filter(isPresent);
    if (violations.length > 0) {
      const violationsCollectionIdentifiers = violationsCollection.map(violationsItem => this.getViolationsIdentifier(violationsItem));
      const violationsToAdd = violations.filter(violationsItem => {
        const violationsIdentifier = this.getViolationsIdentifier(violationsItem);
        if (violationsCollectionIdentifiers.includes(violationsIdentifier)) {
          return false;
        }
        violationsCollectionIdentifiers.push(violationsIdentifier);
        return true;
      });
      return [...violationsToAdd, ...violationsCollection];
    }
    return violationsCollection;
  }

  protected convertDateFromClient<T extends IViolations | NewViolations | PartialUpdateViolations>(violations: T): RestOf<T> {
    return {
      ...violations,
      violationTime: violations.violationTime?.toJSON() ?? null,
      createdAt: violations.createdAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restViolations: RestViolations): IViolations {
    return {
      ...restViolations,
      violationTime: restViolations.violationTime ? dayjs(restViolations.violationTime) : undefined,
      createdAt: restViolations.createdAt ? dayjs(restViolations.createdAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestViolations>): HttpResponse<IViolations> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestViolations[]>): HttpResponse<IViolations[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
