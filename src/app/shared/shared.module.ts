import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

// Pipes
import { DatePipe, CurrencyPipe } from '@angular/common';
import { FilterPipe } from './pipes/filter.pipe';
import { DebouncePipe } from './pipes/debounce.pipe';
import { StringPipe } from './pipes/string.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { PhoneNumberPipe } from './pipes/phone-number.pipe';
import { CountPipe } from './pipes/count.pipe';
import { DurationPipe } from './pipes/duration.pipe';

// Directives
import { FullScreenDirective } from './directives/full-screen.directive';
import { FocusDirective } from './directives/focus.directive';

// Pipes + Directives
export const APP_PIPES_DIRECTIVES = [
  // Pipes
  FilterPipe,
  DebouncePipe,
  StringPipe,
  SortPipe,
  SafeHtmlPipe,
  PhoneNumberPipe,
  CountPipe,
  DurationPipe,

  // Directives
  FullScreenDirective,
  FocusDirective,
];

@NgModule({
  imports: [
    // Angular
    CommonModule,
  ],
  providers: [DatePipe, CurrencyPipe],
  declarations: [APP_PIPES_DIRECTIVES],
  exports: [APP_PIPES_DIRECTIVES],
  entryComponents: [],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [],
    };
  }
}
