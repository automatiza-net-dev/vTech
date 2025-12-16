import moment from "moment";
import { DetailCard, Error, IDetailCard } from "infinity-forge";
import { Patient } from "@/domain";
import { FormCreateTutor, useConfigurationsSystem } from "@/presentation";
import { useQueryClient } from "infinity-forge";

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
      subTitle: "Tutor Ativo",
      active: !!(type === "Vet" && patient.tutor),
    },
    {
      id: 4,
      icon: "IconGender",
      color: "#FF7A00",
      title: patient.gender,
      subTitle: "Sexo",
      active: true,
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
      active: true,
    },
    {
      id: 7,
      icon: "IconHypertension",
      color: "#C700D9",
      title: patient.hypertension ? "Sim" : "Não",
      subTitle: "Hipertensão",
      active: type !== "Vet",
    },
    {
      id: 8,
      icon: "IconDiabets",
      color: "#002CCA",
      title: patient.diabetes ? "Sim" : "Não",
      subTitle: "Diabetes",
      active: type !== "Vet",
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

              if (
                detail.subTitle === "Vendas em aberto" &&
                type === "Vet" &&
                detail.active
              ) {
                const truthyData: DetailCard = {
                  id: 6,
                  icon: "IconShopping2",
                  color: "#7E43D6",
                  title: `Pet ${patient.vetMissingBills} | Tutor ${patient.vetMissingTutorBills}`,
                  subTitle: "Vendas em aberto",
                  active: true,
                };

                return (
                  <div
                    className="sc-dEAvcG dQKji"
                    style={{
                      color: "rgb(126, 67, 214)",
                      borderColor: "rgb(225, 225, 225)",
                    }}
                  >
                    <div>
                      <div
                        className="sc-cExZcH hoMTfw"
                        style={{
                          background: "rgba(126, 67, 214, 0.22)",
                          color: "rgb(126, 67, 214)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M22.4088 23.2111L20.5847 5.8405C20.5464 5.47686 20.2399 5.20073 19.8743 5.20073H16.4458V4.41906C16.4458 1.98248 14.4633 0 12.0267 0C9.58998 0 7.6075 1.98248 7.6075 4.41906V5.20073H4.17904C3.81338 5.20073 3.50687 5.47686 3.4686 5.8405L1.6445 23.2111C1.62345 23.4124 1.68881 23.6132 1.82413 23.7637C1.95963 23.9141 2.15262 24 2.35495 24H21.6982C21.9007 24 22.0937 23.9141 22.229 23.7637C22.3647 23.6132 22.4299 23.4124 22.4088 23.2111ZM9.03609 4.41906C9.03609 2.7702 10.3777 1.42859 12.0267 1.42859C13.6756 1.42859 15.0172 2.7702 15.0172 4.41906V5.20073H9.03609V4.41906ZM3.14816 22.5714L4.82229 6.62932H7.6075V8.20347C7.6075 8.59788 7.92739 8.91777 8.3218 8.91777C8.71621 8.91777 9.03609 8.59788 9.03609 8.20347V6.62932H15.0172V8.20347C15.0172 8.59788 15.3371 8.91777 15.7315 8.91777C16.1259 8.91777 16.4458 8.59788 16.4458 8.20347V6.62932H19.231L20.9051 22.5714H3.14816Z"
                            fill=""
                          ></path>
                        </svg>
                      </div>
                      <div className="content">
                        <span className="font-18-bold detail-title">
                          {`Pet ${patient.vetMissingBills}`}
                        </span>
                        <span className="font-14-bold">
                          {`Tutor ${patient.vetMissingTutorBills}`}
                        </span>
                        <span className="font-16-regular detail-subtitle">
                          Vendas em aberto
                        </span>
                      </div>
                    </div>
                  </div>
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
