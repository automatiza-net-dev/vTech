import { Error, Icon } from "infinity-forge";
import moment from "moment";

import { INegotiationInfos } from "./interfaces";

import { ClientInfos } from "./client-infos";

import * as S from "./styles";

export function NegotiationInfos({
  onClick,
  children,
  negotiation,
}: INegotiationInfos) {
  return (
    <Error name="NegotiationInfos">
      <S.NegotiationInfos onClick={onClick}>
        <div className="top">
          <h2>
            Avaliação {moment(negotiation.created_at).format("DD/MM/YYYY")}
          </h2>
          <Icon name="IconTopChevron" />
        </div>

        <div className="main_content">
          <ClientInfos
            patientName={negotiation.patient.name}
            openUserName={negotiation.openUser.name}
          />

          {children}
        </div>
      </S.NegotiationInfos>
    </Error>
  );
}
