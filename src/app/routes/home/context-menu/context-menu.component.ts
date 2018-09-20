import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Output, EventEmitter } from '@angular/core';
import { ContextService } from '$libs'
import { ContextMenuComponent } from 'ngx-contextmenu';



@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeContextMenuComponent implements OnInit {
  /** Reference to current top level context menu */
  @ViewChild('contextMenu') contextMenu: ContextMenuComponent;

  @Output() menuReference = new EventEmitter();

  constructor(private menu: ContextService) { }

  ngOnInit() {
    this.menu.register('home', this.contextMenu);
  }

  public doSomething() { }

}
