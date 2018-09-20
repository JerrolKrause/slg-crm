import { Injectable } from '@angular/core';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';

// Names of available context menus
type contextNames = 'home';

@Injectable()
export class ContextService {

  private menuRefs: { [key: string]: ContextMenuComponent } = {};

  constructor(private contextMenuService: ContextMenuService) { }

  /**
   * Register a component based context menu with this service
   * USAGE: 
   * 1. Add reference in DOM: <context-menu #contextMenu>
   * 2. Register viewchild in component: @ViewChild('contextMenu') contextMenu: ContextMenuComponent;
   * 3. Register menu with service on init:
        ngOnInit() {
          this.menu.register('home', this.contextMenu);
        }
   * @param name - Name of menu to register with
   * @param ref - Component reference
  
   */
  public register(name: contextNames, ref: ContextMenuComponent) {
    this.menuRefs[name] = ref;
  }

  /**
   * Open a specific context menu
   * @param name - Name of register context menu
   * @param $event - Mouse event
   * @param data - Optional data
   */
  public open(name: contextNames, $event: MouseEvent, data?:any) {
    this.contextMenuService.show.next({
      // Optional - if unspecified, all context menu components will open
      contextMenu: this.menuRefs[name],
      event: $event,
      item: data,
    });
    $event.preventDefault();
    $event.stopPropagation();
  }


}
