import { useState } from "react";
import { Error, HighlightText, NextImage, Icon, Modal } from "infinity-forge";

import { Patient } from "@/domain";
import { Edit as EditPatient } from "@/OLD/components/Patient/Edit";
import { Edit as EditTutor } from "@/OLD/components/Tutor/Edit";

import * as S from "./styles";

export function Profile({
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
}: Patient) {
  const [modal, setModal] = useState(false);

  const DEFAULT_AVATAR =
    process?.env?.client === "sancla"
      ? "/images/pages/patient/pet.jpg"
      : "/images/pages/patient/humano.jpg";

  return (
    <Error name="Profile">
      <S.Profile>
        <div className="avatar">
          <img
            src={photo ? process.env.NEXT_PUBLIC_API + photo : DEFAULT_AVATAR}
          />
        </div>

        <div>
          {name && (
            <>
              <Modal
                open={modal}
                onClose={() => setModal(false)}
                styles={{
                  maxWidth: "1200px",
                  padding: "20px",
                  overflow: "auto",
                }}
              >
                {process.env.clientName === "Sanclá" ? (
                  <EditPatient id={id} setVisible={setModal} />
                ) : (
                  <EditTutor tutorId={id} setVisible={setModal} />
                )}
              </Modal>

              <h1>
                <span className="custom-link" onClick={() => setModal(true)}>
                  {name}
                </span>
              </h1>
            </>
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
