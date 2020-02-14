import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './../shared/material.module';
import { MenuSetupService } from './menu-setup.service';
import { FooterComponent } from './footer/footer.component';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { SidenavItemComponent } from './sidenav/sidenav-item/sidenav-item.component';
import { NavigationService } from './navigation.service';
import { SidenavComponent } from './sidenav/sidenav.component';
import { TopnavComponent } from './topnav/topnav.component';
import { PopupMenuComponent } from './popup-menu/popup-menu.component';
import { MenuGroupComponent } from './menu-group/menu-group.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  entryComponents: [
    PopupMenuComponent,
  ],
  declarations: [
    SidenavComponent,
    SidenavItemComponent,
    DefaultLayoutComponent,
    TopnavComponent,
    FooterComponent,
    PopupMenuComponent,
    MenuGroupComponent
  ],
  providers:
    [
      NavigationService,
      MenuSetupService
    ]
})
export class NavigationModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NavigationModule,
      providers: [
        NavigationService,
        MenuSetupService
      ]
    };
  }
}
