export interface IMenuItem {
  menuItemId: number;
  title: string;
  link: string;
  queryParams: string;
  clickHandler: string;
  icon: string;
  pathMatch: string;
  displayOrder: number;
  parentId: number;
  isPopup?: boolean;
}
