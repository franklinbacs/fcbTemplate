import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { IMenuItem } from '../IMenuItem';

@Component({
  selector: 'app-menu-group',
  templateUrl: './menu-group.component.html',
  styleUrls: ['./menu-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuGroupComponent {

  @Input()
  parentMenuItem: IMenuItem;

  @Input()
  childrenItems: IMenuItem[] = [];

  @Output()
  menuClicked = new EventEmitter<IMenuItem>();

  itemClick(mItem: IMenuItem): void {
    this.menuClicked.emit(mItem);
  }

  isParentWithLink(): boolean {
    return !!this.parentMenuItem.link;
  }
}
