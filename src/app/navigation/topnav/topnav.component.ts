import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopnavComponent implements OnInit, OnDestroy {
  private _sidenavOpened: boolean;
  private _searchTerm = '';
  private _subscriptions: Subscription[] = [];

  sidenavOpenStyle: string;
  userName = 'John Doe';
  color = 'primary';
  showProgess = false;
  isOnline = true;

  constructor(
    private _cd: ChangeDetectorRef,
    public navigation: NavigationService,
    private _router: Router,
    private dialog: MatDialog,
    private zone: NgZone
  ) {
    _router.events.subscribe((rEvent: Event) => {
      this.checkRouterEvent(rEvent);
    });
  }

  ngOnInit() {

    this._subscriptions.push(this.navigation.openSidenavStyle
      .subscribe(style => {
        this.sidenavOpenStyle = style;
        this._cd.markForCheck();
      }));

    this._subscriptions.push(this.navigation.sidenavOpened
      .subscribe(sidenavOpen => {
        this._sidenavOpened = sidenavOpen;
        this._cd.markForCheck();
      }));
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.showProgess = true;
      this._cd.markForCheck();
    }

    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.showProgess = false;
      this._cd.markForCheck();
    }
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
  }

  toggleSidenav() {
    this.navigation.setSidenavOpened(!this._sidenavOpened);
    this._cd.markForCheck();
  }

  signOutClick(): void {

  }
}
