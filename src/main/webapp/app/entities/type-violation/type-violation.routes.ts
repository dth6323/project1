import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TypeViolationResolve from './route/type-violation-routing-resolve.service';

const typeViolationRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/type-violation.component').then(m => m.TypeViolationComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/type-violation-detail.component').then(m => m.TypeViolationDetailComponent),
    resolve: {
      typeViolation: TypeViolationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/type-violation-update.component').then(m => m.TypeViolationUpdateComponent),
    resolve: {
      typeViolation: TypeViolationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/type-violation-update.component').then(m => m.TypeViolationUpdateComponent),
    resolve: {
      typeViolation: TypeViolationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default typeViolationRoute;
