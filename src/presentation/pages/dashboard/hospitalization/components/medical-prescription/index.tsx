import {
  api,
  Select,
  FormHandler,
  LoaderCircle,
} from "infinity-forge";
import moment from "moment";

import { Hospitalization } from "./types";
import { NewPrescription } from "./new-prescription";

import * as S from "./styles";
import { Prescription } from "./prescription";
import { useQuery } from "@/presentation/use-query/use-query";

export function MedicalPrescription({ id }) {
  const { data, isLoading } = useQuery({
    queryKey: ["medicalPrescription", id],
    queryFn: async () => {
      const response = await api<Hospitalization>({
        url: `hospitalizations/info/${id}`,
        method: "get",
      });

      return response;
    },
  });

  if (isLoading) {
    return <LoaderCircle size={30} color="#000" />;
  }

  return (
    <S.MedicalPrescription>
      <hr />

      <div className="row">
        <span className="font-18-regular">
          <strong>Tipo:</strong> {data?.type}
        </span>

        <span className="font-18-regular">
          <strong>Data internação:</strong>{" "}
          {moment(data?.createdAt).format("DD/MM/YYYY HH:mm")}
        </span>

        <span className="font-18-regular">
          <strong>Data previsão alta:</strong>{" "}
          {moment(data?.expectedDischarge).format("DD/MM/YYYY HH:mm")}
        </span>
      </div>

      <div className="row">
        <span className="font-18-regular">
          <strong>Paciente:</strong>
          {data?.patient?.name} | RG: {data?.patient?.tag ?? "-"}
        </span>

        <span className="font-18-regular">
          <strong>Espécie:</strong> {data?.patient?.info?.specie} <br />
          <strong>Raça:</strong> {data?.patient?.info?.race} <br />
          <strong>Idade:</strong>{" "}
          {data?.patient?.info?.age
            ? moment()
                .subtract(data?.patient?.info?.age, "years")
                .format("DD/MM/YYYY")
            : "-"}
        </span>

        <span className="font-18-regular">
          <strong>Pelagem:</strong> {data?.patient?.info?.hair} <br />
          <strong>Peso:</strong> {data?.patient?.info?.weight}kg em{" "}
          {moment(data?.patient?.info?.weightDate).format("DD/MM/YYYY")}
        </span>
      </div>

      <hr />

      <FormHandler initialData={{ status: "Aberto" }} disableEnterKeySubmitForm>
        <div className="bottom">
          <span className="font-18-regular">
            <strong>Tutor:</strong> {data?.tutor?.name} <br />
            <strong>Telefone:</strong>{" "}
            {data?.tutor?.telephone || "Não cadastrado"} <br />
            <strong>Celular:</strong>{" "}
            {data?.tutor?.cellphone || "Não cadastrado"}
          </span>

          <div className="box-right">
            <Select
              onlyOneValue
              name="status"
              options={[
                { label: "Todos", value: "all" },
                { label: "Em aberto", value: "Aberto" },
                { label: "Executado", value: "Executado" },
                { label: "Cancelado", value: "Cancelado" },
                { label: "Interrompido", value: "Interrompido" },
              ]}
            />

            <NewPrescription hospitalizationId={id} />
          </div>
        </div>

        <hr />

        <div className="list_prescriptions">
          {data?.prescriptions?.map((item) => (
            <Prescription key={item.id} prescriptionId={id} {...item} />
          ))}
        </div>
      </FormHandler>

      <hr />
    </S.MedicalPrescription>
  );
}
