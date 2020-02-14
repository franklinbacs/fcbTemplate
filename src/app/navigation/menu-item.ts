import { SidenavItemComponent } from './sidenav/sidenav-item/sidenav-item.component';
import { NavigationService } from './navigation.service';
import { StringUtils } from '../shared/utils/string-utils';

export class MenuItem {
  public title: string;
  public parent: MenuItem;

  private _shrinkDisplayHeight = false;
  private _showOnly = false;
  private _icon = null;
  private _menuItemId: number;
  private _displayOrder: number;
  private _isPopup: boolean;

  /* Allow creation using object or pass in each property individually */
  constructor(
    private titleOrData: string | {
      title: string,
      link?: string,
      children?: MenuItem[],
      queryParams?: any,
      clickHandler?: (event: MouseEvent, navigation: NavigationService, sidenavItem: SidenavItemComponent) => boolean, icon?: string, pathMatch?: string,
      isPopup?: boolean
    },
    public link: string = null,
    public children: MenuItem[] = [],
    public queryParams = {},
    public clickHandler: (event: MouseEvent, navigation: NavigationService, sidenavItem: SidenavItemComponent) => boolean = null,
    icon: string = null,
    public pathMatch: string = 'full',
    isPopup: boolean = false
  ) {
    if (!(typeof titleOrData === 'string')) {
      this.title = titleOrData.title;
      this.link = titleOrData.link || null;
      this.children = titleOrData.children || [];
      this.queryParams = titleOrData.queryParams || {};
      this.clickHandler = titleOrData.clickHandler || null;
      this.icon = titleOrData.icon || null;
      this.pathMatch = titleOrData.pathMatch || 'full';
      this.isPopup = titleOrData.isPopup || false;
    } else {
      this.title = titleOrData;
      this.isPopup = isPopup;
    }

    // for (let i = 0; i < this.children.length; i++) {
    //   this.children[i].parent = this;
    // }

    for (const child of this.children) {
      child.parent = this;
    }

    this.icon = icon || this.icon;
  }

  set icon(icon: string) {
    this._icon = StringUtils.cleanIconName(icon);
  }

  get icon(): string {
    return this._icon;
  }

  setShrinkDisplayHeight(shrinkDisplayHeight: boolean): MenuItem {
    this._shrinkDisplayHeight = shrinkDisplayHeight;
    return this;
  }

  get shrinkDisplayHeight(): boolean {
    return this._shrinkDisplayHeight;
  }

  set shrinkDisplayHeight(shrinkDisplayHeight: boolean) {
    this._shrinkDisplayHeight = shrinkDisplayHeight;
  }

  setShowOnly(showOnly: boolean): MenuItem {
    this._showOnly = showOnly;
    return this;
  }

  get showOnly(): boolean {
    return this._showOnly;
  }

  set showOnly(showOnly: boolean) {
    this._showOnly = showOnly;
  }


  get menuItemId(): number {
    return this._menuItemId;
  }

  set menuItemId(v: number) {
    this._menuItemId = v;
  }

  get displayOrder(): number {
    return this._displayOrder;
  }

  set displayOrder(v: number) {
    this._displayOrder = v;
  }

  public get isPopup(): boolean {
    return this._isPopup;
  }

  public set isPopup(v: boolean) {
    this._isPopup = v;
  }
}
