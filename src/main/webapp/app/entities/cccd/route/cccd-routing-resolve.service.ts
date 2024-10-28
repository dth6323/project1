import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICCCD } from '../cccd.model';
import { CCCDService } from '../service/cccd.service';

const cCCDResolve = (route: ActivatedRouteSnapshot): Observable<null | ICCCD> => {
  const id = route.params.id;
  if (id) {
    return inject(CCCDService)
      .find(id)
      .pipe(
        mergeMap((cCCD: HttpResponse<ICCCD>) => {
          if (cCCD.body) {
            return of(cCCD.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default cCCDResolve;
