import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';

import { Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { MenuSetupService } from './../menu-setup.service';
import { NavigationService } from './../navigation.service';
import { TopnavComponent } from '../topnav/topnav.component';
import { IMenuItem } from '../IMenuItem';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav, { static: true }) sideNav: MatSidenav;
  @ViewChild(TopnavComponent, { static: true }) topNav: TopnavComponent;

  sidenavStyle = 'side';
  isHovering = false;
  isHoveringNew = false;
  private _isHoveringTimeout: number;
  private _subscriptions: Subscription[] = [];
  _idleSecondsCounter = 0;

  constructor(public navigation: NavigationService,
    private _navigation: NavigationService,
    private _router: Router,
    private _elementRef: ElementRef,
    private _menuSetupService: MenuSetupService,
    public dialog: MatDialog,
    private _cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // set menu selections
    this._navigation.menuItems = this._menuSetupService.setupMenuStructure(appMenus);

    if (this.navigation.mediumScreenAndDown) {
      this.sideNav.close();
      this._cd.markForCheck();
    }

    let lastWindowSize = 0;
    const combined = combineLatest([this.navigation.sidenavOpened, this.navigation.openSidenavStyle,
    this.navigation.closedSidenavStyle, this.navigation.windowSize])
      .pipe(
        map(([opened, openStyle, closedStyle, windowSize]) => {
          let screenSizeChange = false;

          if (windowSize !== lastWindowSize) {
            lastWindowSize = windowSize;
            screenSizeChange = true;
          }

          return { opened, openStyle, closedStyle, screenSizeChange };
        }));

    this._subscriptions.push(
      combined.subscribe((p: { opened: boolean, openStyle: string, closedStyle: string, screenSizeChange: boolean }) => {
        if (p.openStyle === 'off') {
          this.sidenavStyle = 'over';
          this.sideNav.close();
          this._cd.markForCheck();
          return;
        }

        if (this.navigation.largeScreen) {
          if (p.opened) {
            this.sidenavStyle = p.openStyle;
          } else {
            this.sidenavStyle = p.closedStyle;
          }
          if (this.sidenavStyle !== 'off' && (this.sidenavStyle !== 'hidden' || p.opened) && (this.sidenavStyle !== 'push' || p.opened)) {
            this.sideNav.open();
          } else {
            this.sideNav.close();
          }
        } else {
          this.sidenavStyle = 'over';
          if (p.opened && !p.screenSizeChange) {
            this.sideNav.open();
          } else {
            this.sideNav.close();
          }
        }

        this._cd.markForCheck();
      }));

    if (this.sidenavStyle === 'hidden' || this.sidenavStyle === 'push') {
      this.sideNav.close(); // Close on initial load
      this._cd.markForCheck();
    }

    // #### from app.component
    this._subscriptions.push(this._router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this._navigation.setCurrentRoute((event as NavigationEnd).urlAfterRedirects);
        // this._navigation.setIsRouteLoading(false);
        const routerOutletComponent: HTMLElement = this._elementRef.nativeElement.getElementsByTagName('app-topnav')[0];

        if (routerOutletComponent) {
          routerOutletComponent.scrollIntoView(); // Scroll back to top after route change
          this._cd.markForCheck();
        }
      }
    }));
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  public get sidenavMode(): string {
    if (this.sidenavStyle === 'icon overlay' && this.isHovering) {
      return 'over';
    } else if (this.sidenavStyle === 'icon' || this.sidenavStyle === 'icon overlay') {
      return 'side';
    } else if (this.sidenavStyle === 'hidden') {
      return 'over';
    } else if (this.sidenavStyle === 'off') {
      return 'over';
    }
    return this.sidenavStyle;
  }

  sidenavToggle(opened: boolean) {
    this.navigation.setSidenavOpened(opened);
    this._cd.markForCheck();
  }

  toggleHover(isHovering: boolean) {
    this.isHoveringNew = isHovering;

    if (isHovering) {
      this.isHovering = true;
      this._cd.markForCheck();
    } else if (this._isHoveringTimeout !== 0) {
      this._isHoveringTimeout = window.setTimeout(() => {
        this.isHovering = this.isHoveringNew;
        this._cd.markForCheck();
      }, 50);
    }
  }
}


const appMenus: IMenuItem[] = [
  {
    menuItemId: 1,
    title: 'Dashboard',
    link: '/dashboard',
    queryParams: '',
    clickHandler: '',
    icon: 'home',
    pathMatch: '',
    displayOrder: 1,
    parentId: null
  },
  {
    menuItemId: 2,
    title: 'Products',
    link: '/produts',
    queryParams: null,
    clickHandler: null,
    icon: 'devices_other',
    pathMatch: '',
    displayOrder: 2,
    parentId: null
  },
  {
    menuItemId: 3,
    title: 'Hardware',
    link: '/produts/hardware',
    queryParams: null,
    clickHandler: null,
    icon: '',
    pathMatch: '',
    displayOrder: 1,
    parentId: 2
  },
  {
    menuItemId: 3,
    title: 'Software',
    link: '/produts/software',
    queryParams: null,
    clickHandler: null,
    icon: '',
    pathMatch: '',
    displayOrder: 2,
    parentId: 2
  }
];
