import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IViolations } from '../violations.model';
import { ViolationsService } from '../service/violations.service';

const violationsResolve = (route: ActivatedRouteSnapshot): Observable<null | IViolations> => {
  const id = route.params.id;
  if (id) {
    return inject(ViolationsService)
      .find(id)
      .pipe(
        mergeMap((violations: HttpResponse<IViolations>) => {
          if (violations.body) {
            return of(violations.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default violationsResolve;
