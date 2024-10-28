import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import CCCDResolve from './route/cccd-routing-resolve.service';

const cCCDRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/cccd.component').then(m => m.CCCDComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/cccd-detail.component').then(m => m.CCCDDetailComponent),
    resolve: {
      cCCD: CCCDResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/cccd-update.component').then(m => m.CCCDUpdateComponent),
    resolve: {
      cCCD: CCCDResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/cccd-update.component').then(m => m.CCCDUpdateComponent),
    resolve: {
      cCCD: CCCDResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default cCCDRoute;
