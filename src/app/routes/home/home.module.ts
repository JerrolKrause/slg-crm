import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteModule } from '$site'; // Site modules
import { DatagridModule, ContextModule, ChartModule } from '$libs'; // Lazy loaded datagrid

// Home component and routing
import { routing } from './home.routes';
import { HomeComponent } from './home.component';
import { HomeContextMenuComponent } from './context-menu/context-menu.component';

@NgModule({
  imports: [CommonModule, SiteModule, ContextModule, routing, DatagridModule, ChartModule],
  declarations: [HomeComponent, HomeContextMenuComponent],
  providers: [],
  exports: [],
  entryComponents: [],
})
export class HomeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HomeModule,
      providers: [],
    };
  }
}
