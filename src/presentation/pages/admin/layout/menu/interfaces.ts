export interface IMenuItem {
  icon: JSX.Element;
  text: string;
  url?: string;
  submenus?: {
    text: string;
    url: string;
  }[];
}
