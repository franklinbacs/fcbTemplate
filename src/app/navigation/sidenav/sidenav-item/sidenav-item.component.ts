import {
  Component, ViewChildren, AfterViewInit, OnDestroy, Input,
  QueryList, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { NavigationService } from '../../navigation.service';
import { MenuItem } from '../../menu-item';
import { PopupMenuComponent } from '../../popup-menu/popup-menu.component';
import { StringUtils } from 'src/app/shared/utils/string-utils';

@Component({
  selector: 'app-sidenav-item',
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavItemComponent implements AfterViewInit, OnDestroy {
  @ViewChildren(SidenavItemComponent) children: QueryList<SidenavItemComponent>;
  @Input() menuItem: MenuItem;
  @Input() level = 1;
  @Input() parent: SidenavItemComponent;

  self: SidenavItemComponent = this;
  private subscription: Subscription = Subscription.EMPTY;
  private currentRoute: string;

  private _active = false;
  @Input()
  get active(): boolean {
    return this._active || (StringUtils.isEmpty(this.currentRoute) ? false : this.isActive(this.currentRoute));
  }

  set active(active: boolean) {
    this._active = active;
  }

  constructor(
    private navigation: NavigationService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    if (!this.hasChildren && this.hasLink) {
      this.subscription = this.navigation.currentRoute
        .subscribe(currentRoute => {
          // Open up the current menu item on initial load (i.e. someones refreshes the page or you go directly to an inner page)
          this.currentRoute = currentRoute;
          if (this.isActive(currentRoute)) {
            let hasShowOnly = false;
            let parent: SidenavItemComponent = this;
            while (parent !== undefined && parent !== null) {
              if (!StringUtils.isNull(parent, 'menuItem') && parent.menuItem.showOnly) {
                hasShowOnly = true;
                break;
              }
              parent = parent.parent;
            }

            if (!hasShowOnly) {
              this.toggle(true);
            } else {
              this.navigation.activeMenuItem
                .pipe(
                  take(1))
                .subscribe(activeMenu => {
                  this.navigation.tempMenuItems
                    .pipe(take(1))
                    .subscribe(tempMenus => {
                      if (activeMenu === null && tempMenus === null) {
                        this.navigation.showOnly(parent.menuItem);
                        this.cd.markForCheck();
                      } else if (tempMenus !== null && tempMenus.length > 0) {
                        parent.toggle(true, null, true);
                      } else if (activeMenu !== null && tempMenus !== null && tempMenus.length === 0) {
                        if (parent.parent !== undefined && parent.parent !== null) {
                          parent.parent.toggle(true, null, false, true);
                        }
                      }
                    });
                });
            }
          }
        });
    } else if (this.menuItem.showOnly) {
      this.navigation.tempMenuItems
        .pipe(take(1))
        .subscribe(tempMenus => {
          if (tempMenus !== null && tempMenus.length > 0) {
            this.toggle(true, null, true, true);
          }
        });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleDropdown(active: boolean) {
    this.active = active;
    if (this.children) {
      this.children.forEach(childMenu => {
        childMenu.toggle(false, undefined, true);
      });
    }
    if (this.parent && active) {
      this.parent.toggle(active, this);
    }

    if (this.menuItem.showOnly && active) {
      this.navigation.showOnly(this.menuItem);
    }
    this.cd.markForCheck();
  }

  toggle(active: boolean, child?: SidenavItemComponent, noParent: boolean = false, noChildren: boolean = false): void {
    this.active = active;
    if (!noChildren && this.children) {
      this.children.forEach(childComponent => {
        if (child !== undefined) {
          if (child !== childComponent) {
            childComponent.toggle(false, undefined, true);
          }
        } else {
          childComponent.toggle(active, undefined, true);
        }
      });
    } else if (active) {
      this.navigation.setActiveMenuItem(this.menuItem);
    }

    if (this.parent !== undefined && !noParent) {
      this.parent.toggle(active, this);
    }
    this.cd.markForCheck();
  }

  private showPopupMenu(mItem: MenuItem): void {
    this.dialog.open(PopupMenuComponent, {
      width: '600px',
      height: '520px',
      disableClose: false,
      data: { menuData: mItem }
    });
    this.cd.markForCheck();
  }

  clicked(event: MouseEvent) {
    if (this.menuItem.isPopup) {
      // show a popup menu passing the menu item with children
      this.showPopupMenu(this.menuItem);
    } else {
      if (this.menuItem.clickHandler !== null) {
        const clickResult: boolean = this.menuItem.clickHandler(event, this.navigation, this);
        if (clickResult) {
          this.toggleDropdown(!this._active);
        }
      } else {
        this.toggleDropdown(!this._active);
      }
    }
  }

  private isActive(currentRoute: string): boolean {
    if (StringUtils.isEmpty(currentRoute)) {
      return false;
    }
    if (StringUtils.cleanLinkString(currentRoute) === this.menuItem.link) {
      if (this.hasQuery) {
        let active = false;
        this.activatedRoute.queryParams
          .pipe(take(1))
          .subscribe(params => {
            if (StringUtils.deepCompare(this.menuItem.queryParams, params)) {
              active = true;
            }
          });
        return active;
      } else {
        return true;
      }
    } else if (this.menuItem.pathMatch === 'partial' && StringUtils.startsWith(currentRoute, this.menuItem.link)) {
      return true;
    }
    return false;
  }

  get height(): number {
    let addedHeight = 0;
    if (this.children) {
      this.children.forEach(childComponent => {
        if (childComponent.active) {
          addedHeight += childComponent.height;
        }
      });
    }
    return (this.menuItem.children.length * (this.menuItem.shrinkDisplayHeight ? 36 : 48)) + addedHeight;
  }

  get levelClass(): string {
    if (this.level < 4) {
      return `level${this.level}`;
    }
    return 'level5';
  }

  get showIcon(): boolean {
    return !(!this.menuItem || !this.menuItem.icon || StringUtils.isEmpty(this.menuItem.icon))
      && (!this.menuItem.showOnly || (this.parent === undefined || this.parent.parent === undefined));
  }

  get hasExternalLink(): boolean {
    if (!this.menuItem) {
      return false;
    }
    return !StringUtils.isEmpty(this.menuItem.link) &&
      (StringUtils.startsWith(this.menuItem.link, 'http://') || StringUtils.startsWith(this.menuItem.link, 'https://'));
  }

  get hasLink(): boolean {
    if (!this.menuItem || this.hasExternalLink) {
      return false;
    }
    return !StringUtils.isEmpty(this.menuItem.link);
  }

  get hasChildren(): boolean {
    if (!this.menuItem) {
      return false;
    }
    return this.menuItem.children.length > 0;
  }

  get hasQuery(): boolean {
    if (!this.menuItem) {
      return false;
    }
    return !this.menuItem.queryParams ? false : Object.getOwnPropertyNames(this.menuItem.queryParams).length !== 0;
  }
}

