import { DetailCard, Error, IDetailCard } from "infinity-forge";

import { Patient } from "@/domain";
import { Profile } from "./profile";

import * as S from "./styles";

export function ProfileInfos({ patient }: { patient: Patient }) {

  const details: IDetailCard[] = [
    {
      id: 1,
      icon: "IconPet",
      color: "#4BC0C0",
      title: patient?.race,
      subTitle: patient?.specie,
    },
    {
      id: 2,
      icon: "IconWeight",
      color: "#E44A83",
      title: patient?.weight,
      subTitle: "Peso",
    },
    {
      id: 3,
      icon: "IconPerson",
      color: "#F4BF00",
      title: patient.tutor.name,
      subTitle: "Tutor Ativo",
    },
    {
      id: 4,
      icon: "IconGender",
      color: "#FF7A00",
      title: patient?.genderText,
      subTitle: "Sexo",
    },
    {
      id: 5,
      icon: "IconClock",
      color: "#36A2EB",
      title: patient?.age,
      subTitle: "Idade",
    },
    {
      id: 6,
      icon: "IconShopping2",
      color: "#7E43D6",
      title: patient.missingBills,
      subTitle: "Vendas em aberto",
    },
  ];

  return (
    <Error name="ProfileInfos">
      <S.ProfileInfos>
        <Profile {...patient} />

        {details && (
          <div className="details-box">
            {details?.map((detail) => (
              <DetailCard key={detail.id} {...detail} />
            ))}
          </div>
        )}
      </S.ProfileInfos>
    </Error>
  );
}
