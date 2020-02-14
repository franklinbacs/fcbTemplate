import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationModule } from './navigation/navigation.module';
import { AppConfigOptions } from './navigation/app.config.options';

const defaultOptions: AppConfigOptions = {
  appTitle: 'Company Name',
  openSidenavStyle: 'side',
  closedSidenavStyle: 'icon overlay',
  sidenavOpened: true,
  fixedNavbar: true,
  // titleSeparator?: string
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NavigationModule.forRoot()
  ],
  providers: [
    { provide: 'AppConfigOptions', useValue: defaultOptions }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
