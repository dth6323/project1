import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICCCD, NewCCCD } from '../cccd.model';

export type PartialUpdateCCCD = Partial<ICCCD> & Pick<ICCCD, 'id'>;

type RestOf<T extends ICCCD | NewCCCD> = Omit<T, 'dateBirth' | 'dateIssue' | 'dateExpiry'> & {
  dateBirth?: string | null;
  dateIssue?: string | null;
  dateExpiry?: string | null;
};

export type RestCCCD = RestOf<ICCCD>;

export type NewRestCCCD = RestOf<NewCCCD>;

export type PartialUpdateRestCCCD = RestOf<PartialUpdateCCCD>;

export type EntityResponseType = HttpResponse<ICCCD>;
export type EntityArrayResponseType = HttpResponse<ICCCD[]>;

@Injectable({ providedIn: 'root' })
export class CCCDService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cccds');

  create(cCCD: NewCCCD): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cCCD);
    return this.http.post<RestCCCD>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(cCCD: ICCCD): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cCCD);
    return this.http
      .put<RestCCCD>(`${this.resourceUrl}/${this.getCCCDIdentifier(cCCD)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(cCCD: PartialUpdateCCCD): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cCCD);
    return this.http
      .patch<RestCCCD>(`${this.resourceUrl}/${this.getCCCDIdentifier(cCCD)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCCCD>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCCCD[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCCCDIdentifier(cCCD: Pick<ICCCD, 'id'>): number {
    return cCCD.id;
  }

  compareCCCD(o1: Pick<ICCCD, 'id'> | null, o2: Pick<ICCCD, 'id'> | null): boolean {
    return o1 && o2 ? this.getCCCDIdentifier(o1) === this.getCCCDIdentifier(o2) : o1 === o2;
  }

  addCCCDToCollectionIfMissing<Type extends Pick<ICCCD, 'id'>>(
    cCCDCollection: Type[],
    ...cCCDSToCheck: (Type | null | undefined)[]
  ): Type[] {
    const cCCDS: Type[] = cCCDSToCheck.filter(isPresent);
    if (cCCDS.length > 0) {
      const cCCDCollectionIdentifiers = cCCDCollection.map(cCCDItem => this.getCCCDIdentifier(cCCDItem));
      const cCCDSToAdd = cCCDS.filter(cCCDItem => {
        const cCCDIdentifier = this.getCCCDIdentifier(cCCDItem);
        if (cCCDCollectionIdentifiers.includes(cCCDIdentifier)) {
          return false;
        }
        cCCDCollectionIdentifiers.push(cCCDIdentifier);
        return true;
      });
      return [...cCCDSToAdd, ...cCCDCollection];
    }
    return cCCDCollection;
  }

  protected convertDateFromClient<T extends ICCCD | NewCCCD | PartialUpdateCCCD>(cCCD: T): RestOf<T> {
    return {
      ...cCCD,
      dateBirth: cCCD.dateBirth?.toJSON() ?? null,
      dateIssue: cCCD.dateIssue?.toJSON() ?? null,
      dateExpiry: cCCD.dateExpiry?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCCCD: RestCCCD): ICCCD {
    return {
      ...restCCCD,
      dateBirth: restCCCD.dateBirth ? dayjs(restCCCD.dateBirth) : undefined,
      dateIssue: restCCCD.dateIssue ? dayjs(restCCCD.dateIssue) : undefined,
      dateExpiry: restCCCD.dateExpiry ? dayjs(restCCCD.dateExpiry) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCCCD>): HttpResponse<ICCCD> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCCCD[]>): HttpResponse<ICCCD[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
