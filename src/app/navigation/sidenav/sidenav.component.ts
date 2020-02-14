import { Component, Input, OnInit, OnDestroy, QueryList, ViewChildren, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { Observable, Subscription, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import { SidenavItemComponent } from './sidenav-item/sidenav-item.component';
import { MenuItem } from '../menu-item';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent implements OnInit, OnDestroy {
  @ViewChildren(SidenavItemComponent) children: QueryList<SidenavItemComponent>;
  @Input() isHovering = false;

  sidenavStyle: string;
  menuItemsObservable: Observable<MenuItem[]>;
  height: number;
  private menuItems: MenuItem[] = [];
  // private _screenWidth: number;
  // private _initialLoad = true; // Used to show slide in effect on page load for sidenav
  _this: SidenavComponent = this;

  logoImage = '';

  private _subscriptions: Subscription[] = [];

  constructor(
    public navigation: NavigationService,
    private _cd: ChangeDetectorRef) { }

  ngOnInit() {
    // this._screenWidth = this.navigation.largeViewportWidth;
    this._subscriptions.push(this.navigation.sidenavOpened
      .subscribe(opened => {
        if (this.navigation.largeScreen) {
          if (opened) {
            this.navigation.openSidenavStyle
              .pipe(take(1))
              .subscribe(style => {
                this.sidenavStyle = style;
                this._cd.markForCheck();
              });
          } else {
            this.navigation.closedSidenavStyle
              .pipe(take(1))
              .subscribe(style => {
                this.sidenavStyle = style;
                this._cd.markForCheck();
              });
          }
        } else {
          this.sidenavStyle = 'over';
          this._cd.markForCheck();
        }
      }));

    this.menuItemsObservable = combineLatest(this.navigation.menuItems, this.navigation.tempMenuItems, (menuItems: MenuItem[], tempMenuItems: MenuItem[]) => {
      if (tempMenuItems !== null && tempMenuItems.length > 0) {
        return tempMenuItems;
      }

      return menuItems;
    });

    this._subscriptions.push(this.menuItemsObservable
      .subscribe(menuItems => {
        this.menuItems = menuItems;
      }));

    let addedHeight = 0;
    if (this.children) {
      this.children.forEach(childComponent => {
        if (childComponent.active) {
          addedHeight += childComponent.height;
        }
      });
    }

    this.height = (this.menuItems.length * 48) + addedHeight;
    this._cd.markForCheck();
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  toggle(active: boolean, child: SidenavItemComponent) {
    if (this.children) {
      this.children.forEach(childComponent => {
        if (child !== childComponent) {
          childComponent.toggle(false, undefined, true);
        }
      });
    }
  }
}
