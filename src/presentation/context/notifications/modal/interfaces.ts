export interface ModalProps {
  actions?: React.ReactNode
  open: boolean
  center?: boolean
  styles?: React.CSSProperties
  stylesContent?: React.CSSProperties
  onClose: (setShowPortal: React.Dispatch<React.SetStateAction<boolean>>) => void
  children?: React.ReactNode
  hideCloseButton?: boolean
  closePortalOnCloseModal?: boolean;
  isNotPossibleClose?: boolean;
}
