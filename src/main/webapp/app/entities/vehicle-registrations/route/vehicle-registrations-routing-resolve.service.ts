import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVehicleRegistrations } from '../vehicle-registrations.model';
import { VehicleRegistrationsService } from '../service/vehicle-registrations.service';

const vehicleRegistrationsResolve = (route: ActivatedRouteSnapshot): Observable<null | IVehicleRegistrations> => {
  const id = route.params.id;
  if (id) {
    return inject(VehicleRegistrationsService)
      .find(id)
      .pipe(
        mergeMap((vehicleRegistrations: HttpResponse<IVehicleRegistrations>) => {
          if (vehicleRegistrations.body) {
            return of(vehicleRegistrations.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default vehicleRegistrationsResolve;
