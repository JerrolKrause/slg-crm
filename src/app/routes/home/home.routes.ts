import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'My Pipeline' },
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
