import { ReactNode } from "react";

import { ModalProps } from "antd";

export interface ITriggerModalProps extends ModalProps {
  triggerContent: ReactNode;
  content: any;
}
