import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { MenuItem } from './menu-item';
import { IMenuItem } from './IMenuItem';

@Injectable()
export class MenuSetupService {

  public setupMenuStructure(allMenuItems: IMenuItem[]): BehaviorSubject<MenuItem[]> {

    const menuItemSetup: MenuItem[] = [];
    const menuItemSetup$ = new BehaviorSubject<MenuItem[]>([]);

    let menuEntry: MenuItem = null;    // individual menu entry to MenuSetup

    if (allMenuItems.length) {
      for (const item of allMenuItems) {
        if (item.parentId === null) {
          const children: IMenuItem[] = allMenuItems.filter(i => i.parentId === item.menuItemId);  // get children if there are any

          if (children.length === 0) {  // menu is at root and don't have any sub-menu (level 1)
            menuEntry = new MenuItem({ title: item.title, link: item.link, icon: item.icon, isPopup: item.isPopup });
          } else if (children.length > 0) {  // parent has sub-menu - level 2
            const childrenMenuItem: MenuItem[] = [];

            for (const child of children) {
              const children2: IMenuItem[] = allMenuItems.filter(i => i.parentId === child.menuItemId); // children of sub-menu

              if (children2.length === 0) {    // parent (level 2) don't have children
                childrenMenuItem.push(new MenuItem({ title: child.title, link: child.link, icon: child.icon, isPopup: child.isPopup }));
                menuEntry = new MenuItem(item.title, null, childrenMenuItem, null, null, item.icon);
              } else {
                let menuEntry2: MenuItem = null;
                const childrenMenuItem2: MenuItem[] = [];

                for (const child2 of children2) {
                  childrenMenuItem2.push(
                    new MenuItem({ title: child2.title, link: child2.link, icon: child2.icon, isPopup: child2.isPopup }));
                }

                menuEntry2 = new MenuItem(child.title, null, childrenMenuItem2, null, null, child.icon, null, child.isPopup);
                childrenMenuItem.push(menuEntry2);
                menuEntry = new MenuItem(item.title, null, childrenMenuItem, null, null, item.icon, null, item.isPopup);
              }
            }
          }

          if (item.isPopup) {
            menuEntry.isPopup = item.isPopup;
          }

          menuItemSetup.push(menuEntry);
        }
      }
    }
    menuItemSetup$.next(menuItemSetup);

    return menuItemSetup$;
  }
}
