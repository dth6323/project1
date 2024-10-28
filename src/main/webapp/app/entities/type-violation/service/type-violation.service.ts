import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypeViolation, NewTypeViolation } from '../type-violation.model';

export type PartialUpdateTypeViolation = Partial<ITypeViolation> & Pick<ITypeViolation, 'id'>;

export type EntityResponseType = HttpResponse<ITypeViolation>;
export type EntityArrayResponseType = HttpResponse<ITypeViolation[]>;

@Injectable({ providedIn: 'root' })
export class TypeViolationService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/type-violations');

  create(typeViolation: NewTypeViolation): Observable<EntityResponseType> {
    return this.http.post<ITypeViolation>(this.resourceUrl, typeViolation, { observe: 'response' });
  }

  update(typeViolation: ITypeViolation): Observable<EntityResponseType> {
    return this.http.put<ITypeViolation>(`${this.resourceUrl}/${this.getTypeViolationIdentifier(typeViolation)}`, typeViolation, {
      observe: 'response',
    });
  }

  partialUpdate(typeViolation: PartialUpdateTypeViolation): Observable<EntityResponseType> {
    return this.http.patch<ITypeViolation>(`${this.resourceUrl}/${this.getTypeViolationIdentifier(typeViolation)}`, typeViolation, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypeViolation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeViolation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTypeViolationIdentifier(typeViolation: Pick<ITypeViolation, 'id'>): number {
    return typeViolation.id;
  }

  compareTypeViolation(o1: Pick<ITypeViolation, 'id'> | null, o2: Pick<ITypeViolation, 'id'> | null): boolean {
    return o1 && o2 ? this.getTypeViolationIdentifier(o1) === this.getTypeViolationIdentifier(o2) : o1 === o2;
  }

  addTypeViolationToCollectionIfMissing<Type extends Pick<ITypeViolation, 'id'>>(
    typeViolationCollection: Type[],
    ...typeViolationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const typeViolations: Type[] = typeViolationsToCheck.filter(isPresent);
    if (typeViolations.length > 0) {
      const typeViolationCollectionIdentifiers = typeViolationCollection.map(typeViolationItem =>
        this.getTypeViolationIdentifier(typeViolationItem),
      );
      const typeViolationsToAdd = typeViolations.filter(typeViolationItem => {
        const typeViolationIdentifier = this.getTypeViolationIdentifier(typeViolationItem);
        if (typeViolationCollectionIdentifiers.includes(typeViolationIdentifier)) {
          return false;
        }
        typeViolationCollectionIdentifiers.push(typeViolationIdentifier);
        return true;
      });
      return [...typeViolationsToAdd, ...typeViolationCollection];
    }
    return typeViolationCollection;
  }
}
