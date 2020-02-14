import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { IMenuItem } from '../IMenuItem';

@Component({
  selector: 'app-popup-menu',
  templateUrl: './popup-menu.component.html',
  styleUrls: ['./popup-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupMenuComponent implements OnInit {
  menuFamilies: Array<IMenuFamily> = [];
  sortedMenuFamilies: Array<IMenuFamily> = [];
  parentMenuItem: IMenuItem;
  childrenItems: IMenuItem[] = [];

  constructor(
    public dialogRef: MatDialogRef<PopupMenuComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.data) {
      this.parentMenuItem = this.data.menuData;

      for (const mnu of this.data.menuData.children) {
        this.menuFamilies.push(
          {
            parentMenuItem: mnu,
            childrenItems: this.sortChildren(mnu.children)
          }
        );
      }
    }

    this.sortedMenuFamilies = this.menuFamilies.sort((a, b) => {
      return a.parentMenuItem.displayOrder - b.parentMenuItem.displayOrder;
    });
  }

  private sortChildren(children: IMenuItem[]): IMenuItem[] {
    return children.sort((a, b) => {
      return a.displayOrder - b.displayOrder;
    });
  }

  menuClicked(mnuItem: IMenuItem): void {
    // reroute page
    if (mnuItem.link) {
      this.router.navigateByUrl(mnuItem.link.trim());

      // close dialog
      this.dialogRef.close();
      this.cd.markForCheck();
    }
  }
}

export interface IMenuFamily {
  parentMenuItem: IMenuItem;
  childrenItems: IMenuItem[];
}
