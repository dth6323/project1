import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'project1App.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'cccd',
    data: { pageTitle: 'project1App.cCCD.home.title' },
    loadChildren: () => import('./cccd/cccd.routes'),
  },
  {
    path: 'type-violation',
    data: { pageTitle: 'project1App.typeViolation.home.title' },
    loadChildren: () => import('./type-violation/type-violation.routes'),
  },
  {
    path: 'vehicle-registrations',
    data: { pageTitle: 'project1App.vehicleRegistrations.home.title' },
    loadChildren: () => import('./vehicle-registrations/vehicle-registrations.routes'),
  },
  {
    path: 'violations',
    data: { pageTitle: 'project1App.violations.home.title' },
    loadChildren: () => import('./violations/violations.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
