import Maintenance from "@/OLD/components/Treatments/Maintenance";
import { useTreatmentsNotExecuted } from "@/OLD/hooks/useAttendances";
import { useLoadPatient } from "@/presentation";
import { Table } from "antd";
import { useParams } from "next/navigation";
import React, { useState } from "react";

export default function Executions(props: {
  value: "Execução de Tratamento";
  modal: boolean;
  reloadSchedule: () => void;
  setModal: (value: boolean) => void;
}) {
  const params = useParams();

  const patientID = params?.id;
  const patient = useLoadPatient(patientID as string | undefined);
  const holderID =
    // @ts-expect-error main
    patient.data?.holders?.find((h) => h?.main)?.id ||
    patient.data?.holders?.at(0)?.id;

  const [selected, setSelected] = useState<number | null>(null);

  const searchQuery = useTreatmentsNotExecuted({
    enabled: !!patientID && props.modal && !patient.loading,
    patientID: patient?.data.id,
    holderID,
  });

  if (searchQuery.isLoading || !props.modal) return <p>Loading...</p>;

  if (searchQuery.data.length === 0) {
    return <p>Não há dados</p>;
  }

  if (searchQuery.data.length === 1) {
    return (
      <Maintenance
        treatmentId={searchQuery.data[0].id}
        close={() => props.setModal(false)}
      />
    );
  }

  if (!!selected) {
    return (
      <Maintenance treatmentId={selected} close={() => props.setModal(false)} />
    );
  }

  return (
    <div className="uk-flex-column uk-flex-between">
      <p
        style={{
          fontSize: "20px",
          color: "black",
          fontWeight: "semibold",
        }}
      >
        Selecione o tratamento a ser executado
      </p>
      <hr />
      <Table
        className="uk-margin-top"
        dataSource={searchQuery.data.map((d) => ({
          tID: (
            <span
              style={{
                cursor: "pointer",
              }}
              onClick={() => setSelected(d.id)}
            >{`${d.id} - ${d.items.length} itens`}</span>
          ),
          date: new Date(d.date).toLocaleDateString(),
        }))}
        columns={[
          {
            title: "Tratamento",
            dataIndex: "tID",
            key: "tID",
          },
          {
            title: "Data",
            dataIndex: "date",
            key: "date",
          },
        ]}
        locale={{}}
      />
    </div>
  );
}
