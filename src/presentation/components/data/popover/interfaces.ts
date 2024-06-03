export interface IPopoverStateProps {
  title?: string;
  forceClose?: boolean;
  noTranslate?: boolean;
  children: React.ReactElement;
  placement?: "topEnd" | "topStart";
}
