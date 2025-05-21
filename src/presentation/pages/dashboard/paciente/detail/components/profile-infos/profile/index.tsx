import { useState } from "react";

import { Error, HighlightText, Icon, useQueryClient } from "infinity-forge";


import { Patient } from "@/domain";
import { FormCreatePatient } from "../../../../create";
import { useConfigurationsSystem } from "@/presentation";

import * as S from "./styles";

export function ProfileImage({ src }: { src: string | null }) {
  const [imgError, setImgError] = useState(false);

  const { type } = useConfigurationsSystem();

  const DEFAULT_AVATAR =
    type === "Vet"
      ? "/images/pages/patient/pet.jpg"
      : "/images/pages/patient/humano.jpg";

  return (
    <img
      src={imgError ? DEFAULT_AVATAR : src || DEFAULT_AVATAR}
      onError={() => {
        setImgError(true);
      }}
      className="avatar-image"
    />
  );
}

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

  const { type } = useConfigurationsSystem();
  const refetch = useQueryClient(st => st.refetch);

  return (
    <Error name="Profile">
      <S.Profile>
        <div className="avatar">
          <ProfileImage src={photo} />
        </div>

        <div>
          {name && (
            <FormCreatePatient
              onSuccess={async () =>  await refetch(["RemotePatient"].toString(), { mode: "include" })}
              trigger={
                <h1 className="font-20-regular">
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

            {type === "Vet" ? (
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
