import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ViolationsResolve from './route/violations-routing-resolve.service';

const violationsRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/violations.component').then(m => m.ViolationsComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/violations-detail.component').then(m => m.ViolationsDetailComponent),
    resolve: {
      violations: ViolationsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/violations-update.component').then(m => m.ViolationsUpdateComponent),
    resolve: {
      violations: ViolationsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/violations-update.component').then(m => m.ViolationsUpdateComponent),
    resolve: {
      violations: ViolationsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':search',
    loadComponent: () => import('./search/violations-search.component').then(m => m.YourSearchComponent),
    resolve: {
      violations: ViolationsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default violationsRoute;
