import { Error, HighlightText, NextImage, Icon } from "infinity-forge";

import { Patient, Tutor } from "@/domain";

import * as S from "./styles";

export function Profile({
  tag,
  name,
  tags,
  tutor,
  photo,
  isHospitalized,
}: Patient) {
  const DEFAULT_AVATAR =
    process?.env?.client === "sancla"
      ? "/images/logo/sancla-default-profile.png"
      : "/images/logo/liftone-default-profile.jpg";

  return (
    <Error name="Profile">
      <S.Profile>
        <div className="avatar">
          <NextImage src={photo || DEFAULT_AVATAR} />
        </div>

        <div>
          {name && <h1>{name}</h1>}

          {isHospitalized && (
            <span className="status">
              <HighlightText text={"internado"} color="#36A2EB" />
            </span>
          )}

          <div className="infos">
            {tag && <span>RG {tag}</span>}

            <span>
              <a href={`tel:${tutor?.cellphone}`}>
                <Icon name="IconWhatsInverse" />{" "}
                {tutor?.cellphone || "Telefone não informado"}
              </a>
            </span>

            <span>
              <a href={`mailto:${tutor?.email}`}>
                {tutor?.email || "Email não informado"}
              </a>
            </span>

            {tags && <div dangerouslySetInnerHTML={{ __html: tags }} />}
          </div>
        </div>
      </S.Profile>
    </Error>
  );
}
