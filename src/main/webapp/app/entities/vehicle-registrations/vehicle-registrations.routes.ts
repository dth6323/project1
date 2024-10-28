import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import VehicleRegistrationsResolve from './route/vehicle-registrations-routing-resolve.service';

const vehicleRegistrationsRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/vehicle-registrations.component').then(m => m.VehicleRegistrationsComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/vehicle-registrations-detail.component').then(m => m.VehicleRegistrationsDetailComponent),
    resolve: {
      vehicleRegistrations: VehicleRegistrationsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/vehicle-registrations-update.component').then(m => m.VehicleRegistrationsUpdateComponent),
    resolve: {
      vehicleRegistrations: VehicleRegistrationsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/vehicle-registrations-update.component').then(m => m.VehicleRegistrationsUpdateComponent),
    resolve: {
      vehicleRegistrations: VehicleRegistrationsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default vehicleRegistrationsRoute;
