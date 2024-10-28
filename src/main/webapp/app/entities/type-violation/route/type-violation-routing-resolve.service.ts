import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypeViolation } from '../type-violation.model';
import { TypeViolationService } from '../service/type-violation.service';

const typeViolationResolve = (route: ActivatedRouteSnapshot): Observable<null | ITypeViolation> => {
  const id = route.params.id;
  if (id) {
    return inject(TypeViolationService)
      .find(id)
      .pipe(
        mergeMap((typeViolation: HttpResponse<ITypeViolation>) => {
          if (typeViolation.body) {
            return of(typeViolation.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default typeViolationResolve;
