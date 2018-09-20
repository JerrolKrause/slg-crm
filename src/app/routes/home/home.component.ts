import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataGridComponent } from '../../libs/datagrid/components/datagrid.component';

import { ApiService } from '$api';
import { UIStoreService } from '$ui';
import { Models } from '$models';
import { DesktopUtils } from '$utils';
import { columns } from './columns';
import { Datagrid, ContextService } from '$libs';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('datagrid') datagrid: DataGridComponent;

  public users$ = this.api.select.users$;
  public sidebarOpen$ = this.ui.select.sidebarOpen$;
  public formMain: FormGroup;
  public isEditing: boolean;
  public sidebarOpen = false;

  public filterGlobal: Datagrid.FilterGlobal = {
    term: '',
    props: ['name', 'website'],
  };

  public lead: Models.User;
  public chartsVisible = true;

  // Inputs
  public options: Datagrid.Options = {
    scrollbarH: true,
    selectionType: 'single',
    fullScreen: true,
    controlsDropdown: true,
    showInfo: true,
    primaryKey: 'id',
  };

  public columns: Datagrid.Column[] = columns;

  public chartLeadSources: CanvasJS.ChartDataSeriesOptions[] = [];
  public chartStates: CanvasJS.ChartDataSeriesOptions[] = [];
  public chartAge: CanvasJS.ChartDataSeriesOptions[] = [];
  /** Hold subs for unsub */
  private subs: Subscription[] = [];

  constructor(private api: ApiService, public ui: UIStoreService, private fb: FormBuilder, private ref: ChangeDetectorRef, private menu: ContextService) { }

  public ngOnInit() {
    // Get users and load into store
    this.api.users.get().subscribe();

    // Map chart data
    this.users$.subscribe(users => {
      if (users && users.data) {
        const mapped: { [key: string]: CanvasJS.ChartDataPoint } = {};
        const states: { [key: string]: CanvasJS.ChartDataPoint } = {};
        const age: { [key: string]: CanvasJS.ChartDataPoint } = {};

        users.data.forEach(user => {
          // lead source
          if (!mapped[user.src]) {
            mapped[user.src] = {
              label: user.src,
              y: 1
            }
          } else {
            mapped[user.src].y = mapped[user.src].y + 1;
          }
          // state
          if (!states[user.state]) {
            states[user.state] = {
              label: user.state,
              y: 1
            }
          } else {
            states[user.state].y = states[user.state].y + 1;
          }

          // age
          if (!age[String(user.age)]) {
            age[String(user.age)] = {
              label: String(user.age),
              y: 1
            }
          } else {
            age[String(user.age)].y = age[String(user.age)].y + 1;
          }
        });
        const chartLeadSources: CanvasJS.ChartDataSeriesOptions[] = [{ dataPoints: [] }];
        const chartStates: CanvasJS.ChartDataSeriesOptions[] = [{ dataPoints: [] }];
        const chartAge: CanvasJS.ChartDataSeriesOptions[] = [{ dataPoints: [] }];

        for (let key in mapped) {
          chartLeadSources[0].dataPoints.push(mapped[key]);
        }
        for (let key in states) {
          chartStates[0].dataPoints.push(states[key]);
        }
        for (let key in age) {
          chartAge[0].dataPoints.push(age[key]);
        }
        this.chartLeadSources = chartLeadSources;
        this.chartStates = chartStates;
        this.chartAge = chartAge;
      }

    });

    // Formgroup
    this.formMain = this.fb.group({
      address: ['', []],
      company: ['', []],
      email: ['', []],
      id: ['', []],
      name: ['', [Validators.required]],
      phone: ['', []],
      username: ['', [Validators.required]],
      website: ['', []],
    });
  }


  public onRightClickMenu($event: MouseEvent) {
    this.menu.open('home', $event, this.lead);
  }

  /**
   * Refresh users
   */
  public usersRefresh() {
    this.api.users.get(true).subscribe();
  }

  /** Toggle the sidebar */
  public sidebarToggle(toggle:boolean) {
    this.ui.sidebarToggle(!toggle);
    // There is a better way of doing this
    setTimeout(() => {
      this.datagrid.viewCreate();
      this.ref.detectChanges();
    });
  }

  public chartToggle() {
    this.chartsVisible = !this.chartsVisible;
    setTimeout(() => {
      this.datagrid.viewCreate();
      this.ref.detectChanges();
    });
  }

  /**
   * Update the global filter term
   * @param searchTerm
   */
  public onfilterGlobal(searchTerm: string = null) {
    this.filterGlobal = { ...this.filterGlobal, term: searchTerm };
  }

  /**
   * When the state has been changed (grouping/filtering/sorting/etc)
   * @param event
   */
  public onStateChange(/** state: Datagrid.State */) {
    // console.log('onStateChange', JSON.stringify(state));
  }

  /**
   * When rows have been selected
   * @param event
   */
  public onRowsSelected(users: Models.User[]) {
    if (users && users[0]) {
      this.lead = users[0];
      DesktopUtils.copyToClipboard(users[0].phone); // Copy phone number to clipboard
    }
  }

  /**
   * When a row has been edited
   * @param event
   */
  public onRowUpdated(/** users: Models.User[] */) {
    // console.log('onRowUpdated', users);
  }

  /**
   * Create/update user
   */
  public userSubmit() {
    // If editing, use put
    if (this.isEditing) {
      this.api.users.put(this.formMain.value).subscribe(() => {
        this.formMain.reset(); // Reset form after completion
        this.isEditing = false;
      });
    } else {
      // If creating, use post
      this.api.users.post(this.formMain.value).subscribe(() => this.formMain.reset());
    }
  }

  ngOnDestroy() {
    if (this.subs.length) {
      this.subs.forEach(sub => sub.unsubscribe());
    } // Unsub
  }
}
