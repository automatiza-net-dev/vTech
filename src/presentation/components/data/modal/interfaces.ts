interface IModalProps {
  style?: any;
  Wrapper?: any;
  title?: string;
  warning?: string;
  maxwidth: string;
  forceOpen?: boolean;
  stateModal: boolean;
  children: React.ReactNode;
  onCloseModal?: () => void;
  disableOverflow?: boolean;
  setModal?: React.Dispatch<boolean>;
}

export type { IModalProps };
