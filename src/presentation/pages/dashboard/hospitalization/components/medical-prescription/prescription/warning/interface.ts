
export interface IWarningProps extends Partial<any> {
  onCancel?: () => void
  onConfirm?: () => void
  button?: {
    Element?: () => React.ReactNode;
  };
  warningTitle?: string;
  warningDescription?: string;
}
