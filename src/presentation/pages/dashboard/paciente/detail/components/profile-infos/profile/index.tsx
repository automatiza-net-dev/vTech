import { Error, HighlightText, Icon } from "infinity-forge";

import { Patient } from "@/domain";
import { FormCreatePatient } from "../../../../create";

import * as S from "./styles";

export function Profile(props: Patient) {
  const {
    tag,
    name,
    id,
    tags,
    tutor,
    photo,
    isHospitalized,
    cellphone,
    email,
    community,
  } = props;

  const DEFAULT_AVATAR =
    process?.env?.client === "sancla"
      ? "/images/pages/patient/pet.jpg"
      : "/images/pages/patient/humano.jpg";

  return (
    <Error name="Profile">
      <S.Profile>
        <div className="avatar">
          <img src={photo || DEFAULT_AVATAR} />
        </div>

        <div>
          {name && (
            <FormCreatePatient
              trigger={
                <h1>
                  <span>{name}</span>
                </h1>
              }
              patientId={props.id}
              isModal
            />
          )}

          {isHospitalized && (
            <span className="status">
              <HighlightText text={"internado"} color="#36A2EB" />
            </span>
          )}

          <div className="infos">
            {tag && (
              <span>
                RG {tag} {community ? "- Comunidade Sanclá" : ""}
              </span>
            )}

            {process.env.clientName === "Sanclá" ? (
              <>
                <span>
                  <a href={tutor?.cellphone ? `tel:${tutor?.cellphone}` : ""}>
                    <Icon name="IconWhatsInverse" />{" "}
                    {tutor?.cellphone || "Telefone não informado"}
                  </a>
                </span>

                <span>
                  <a href={tutor?.email ? `mailto:${tutor?.email}` : ""}>
                    {tutor?.email || "Email não informado"}
                  </a>
                </span>
              </>
            ) : (
              <>
                <span>
                  <a href={cellphone ? `tel:${cellphone}` : ""}>
                    <Icon name="IconWhatsInverse" />{" "}
                    {cellphone || "Telefone não informado"}
                  </a>
                </span>

                <span>
                  <a href={email ? `mailto:${email}` : ""}>
                    {email || "Email não informado"}
                  </a>
                </span>
              </>
            )}

            {tags && <div dangerouslySetInnerHTML={{ __html: tags }} />}
          </div>
        </div>
      </S.Profile>
    </Error>
  );
}
