import { MouseEventHandler, ReactNode } from "react";
import { NegotiationCardProps } from "../../interfaces";

export interface INegotiationInfos {
  children: ReactNode;
  negotiation: NegotiationCardProps;
  onClick: MouseEventHandler<HTMLDivElement>;
}
