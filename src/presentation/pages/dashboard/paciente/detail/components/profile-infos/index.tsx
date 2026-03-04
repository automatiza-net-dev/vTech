import moment from "moment";
import { DetailCard, Error, IDetailCard } from "infinity-forge";
import { Patient } from "@/domain";
import { FormCreateTutor, useConfigurationsSystem } from "@/presentation";
import { useQueryClient } from "infinity-forge";
import { useEffect } from "react";
import { currencyFormatter } from "@/OLD/components/Budget";

import { Profile } from "./profile";

import * as S from "./styles";

export type DetailCard = {
  active: boolean;
} & IDetailCard;

export function ProfileInfos({ patient }: { patient: Patient }) {
  const { refetch } = useQueryClient();

  const { type } = useConfigurationsSystem();

  const details: DetailCard[] = [
    {
      id: 1,
      icon: "IconPet",
      color: "#4BC0C0",
      title: patient?.race,
      subTitle: patient?.specie,
      active: type === "Vet",
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
      subTitle: "Responsável Ativo",
      active: !!(type === "Vet" && patient.tutor),
    },
    {
      id: 5,
      icon: patient.death ? "IconDeath" : "IconClock",
      color: patient.death ? "#E02F2F" : "#36A2EB",
      title: patient?.age,
      subTitle: patient.death
        ? `Óbito em ${moment(patient.deathDate).format("DD/MM/YYYY")}`
        : "Idade",
      active: true,
    },
    {
      id: 6,
      icon: "IconShopping2",
      color: "#7E43D6",
      title: patient.missingBills || "R$ 0,00",
      subTitle: "Vendas em aberto",
      active: type !== "Vet",
    },
    {
      id: 7,
      icon: "IconShopping2",
      color: "#7E43D6",
      title: patient.vetMissingBills || "R$ 0,00",
      subTitle: "Vendas em aberto (Pet)",
      active: type === "Vet",
    },
    {
      id: 8,
      icon: "IconShopping2",
      color: "#7E43D6",
      title: patient.vetMissingTutorBills || "R$ 0,00",
      subTitle: "Vendas em aberto (Responsável)",
      active: type === "Vet",
    },

    {
      id: 9,
      icon: "IconHypertension",
      color: "#C700D9",
      title: patient.hypertension ? "Sim" : "Não",
      subTitle: "Hipertensão",
      active: type !== "Vet",
    },
    {
      id: 9,
      icon: "IconDiabets",
      color: "#002CCA",
      title: patient.diabetes ? "Sim" : "Não",
      subTitle: "Diabetes",
      active: type !== "Vet",
    },
  ];

  useEffect(() => {
    const wrappers = document.querySelectorAll('.detail-wrapper .content');

    wrappers.forEach((content) => {
      // evita duplicar
      if (content.querySelector('.credit-info')) {
        content.querySelectorAll('.credit-info').forEach((e) => e.remove())
      }

      const span = document.createElement('span');
      span.className = 'font-14-regular detail-subtitle credit-info';
      span.textContent = `CRÉDITO Disponível: ${currencyFormatter(patient.vetMissingTutorCredits)}`;

      span.style.color = 'green';
      span.style.fontWeight = 'bold';
      span.style.fontSize = '12px';

      content.appendChild(span);
    });
  }, [patient]);


  return (
    <Error name="ProfileInfos">
      <S.ProfileInfos>
        <Profile {...patient} />

        {details && (
          <div className="details-box">
            {details?.map((detail) => {
              if (detail.subTitle === "Responsável Ativo" && detail.active) {
                return (
                  <FormCreateTutor
                    isModal
                    tutorId={patient.tutor.id}
                    onSuccess={async () =>
                      await refetch(["RemotePatient"], { mode: "include" })
                    }
                    trigger={
                      <span
                        className="custom-link"
                        style={{
                          width: "100%",
                          display: "block",
                          textAlign: "left",
                        }}
                      >
                        <DetailCard key={detail.id} {...detail} />
                      </span>
                    }
                  />
                );
              }

              if (detail.active && detail.subTitle === 'Vendas em aberto (Responsável)') {

                return (
                  <div key={detail.id} className='detail-wrapper'>
                    <DetailCard  {...detail} />
                  </div>
                )
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
