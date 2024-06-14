import { useState } from "react";

import { Edit as EditTutor } from "@/OLD/components/Tutor/Edit";
import { DetailCard, Error, IDetailCard, Modal } from "infinity-forge";

import { Patient } from "@/domain";
import { Profile } from "./profile";

import * as S from "./styles";
import moment from "moment";

export type DetailCard = {
  active: boolean;
} & IDetailCard;

export function ProfileInfos({ patient }: { patient: Patient }) {
  const [modal, setModal] = useState(false);

  const details: DetailCard[] = [
    {
      id: 1,
      icon: "IconPet",
      color: "#4BC0C0",
      title: patient?.race,
      subTitle: patient?.specie,
      active: process.env.clientName === "Sanclá",
    },
    {
      id: 2,
      icon: "IconWeight",
      color: "#E44A83",
      title: patient?.weight ? patient.weight + "kg" : "Não informado",
      subTitle: "Peso",
      active: true,
    },
    {
      id: 3,
      icon: "IconPerson",
      color: "#F4BF00",
      title: patient?.tutor?.name,
      subTitle: "Tutor Ativo",
      active: !!(process.env.clientName === "Sanclá" && patient.tutor),
    },
    {
      id: 4,
      icon: "IconGender",
      color: "#FF7A00",
      title: patient?.genderText || "-",
      subTitle: "Sexo",
      active: true,
    },
    {
      id: 5,
      icon: patient.death ? "IconDeath" : "IconClock",
      color: patient.death ? "#E02F2F" : "#36A2EB",
      title: patient?.age,
      subTitle: patient.death
        ? `Óbito em ${moment(patient.death_date).format("DD/MM/YYYY")}`
        : "Idade",
      active: true,
    },
    {
      id: 6,
      icon: "IconShopping2",
      color: "#7E43D6",
      title: patient.missingBills || "R$ 0,00",
      subTitle: "Vendas em aberto",
      active: true,
    },
    {
      id: 7,
      icon: "IconHypertension",
      color: "#C700D9",
      title: patient.hypertension ? "Sim" : "Não",
      subTitle: "Hipertensão",
      active: process.env.clientName === "LiftOne",
    },
    {
      id: 8,
      icon: "IconDiabets",
      color: "#002CCA",
      title: patient.diabetes ? "Sim" : "Não",
      subTitle: "Diabetes",
      active: process.env.clientName === "LiftOne",
    },
  ];

  return (
    <Error name="ProfileInfos">
      <S.ProfileInfos>
        <Profile {...patient} />

        {details && (
          <div className="details-box">
            {details?.map((detail) => {
              if (detail.subTitle === "Tutor Ativo" && detail.active) {
                return (
                  <>
                    <Modal
                      open={modal}
                      styles={{
                        maxWidth: "1200px",
                        padding: "20px",
                        overflow: "auto",
                      }}
                      onClose={() => setModal(false)}
                    >
                      <EditTutor
                        tutorId={patient?.tutor?.id}
                        setVisible={setModal}
                      />
                    </Modal>

                    <span
                      onClick={() => setModal(true)}
                      className="custom-link"
                    >
                      <DetailCard key={detail.id} {...detail} />
                    </span>
                  </>
                );
              }

              return (
                detail.active && <DetailCard key={detail.id} {...detail} />
              );
            })}
          </div>
        )}
      </S.ProfileInfos>
    </Error>
  );
}
