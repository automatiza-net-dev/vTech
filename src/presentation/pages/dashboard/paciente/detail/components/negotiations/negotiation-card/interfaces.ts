import { Negotiation, Tutor } from "@/domain";
import { Dispatch, SetStateAction } from "react";

export type NegotiationCardProps = {
  negotiation: Negotiation | null;
  isFetching: boolean;
  setNegotiation: Dispatch<SetStateAction<Negotiation | null>>;
  tutors?: Tutor[]
} & Negotiation;
