// @ts-nocheck
// Core
import { memo, useState } from "react";

// Services
import { clinicService } from "@/OLD/services/clinic.service";

// Components
import { AutoComplete, DatePicker, Modal, notification } from "antd";
import Editor from "@/OLD/components/Editor";
import FormFooter from "@/OLD/components/mini-components/CustomFormFooter";
import { DateTimeField } from "@mui/x-date-pickers";

// Utils
import moment from "moment";
import { useMutation, useQuery } from "react-query";
import { petsService } from "@/OLD/services/patient.service";

function DeathForm({
  open = false,
  close = () => ({}),
  patient,
}) {
  const [body, setBody] = useState("");
  const [data, setData] = useState({});

  const vetsQuery = useQuery({
    queryKey: ["allVets"],
    queryFn: () =>
      clinicService.getColaborators({}).then((res) =>
        res.data.map((item) => {
          return {
            value: item?.name,
            id: item?.id,
          };
        })
      ),
  });

  const deathMutation = useMutation(
    (payload) => petsService.editPatient(payload, patient.id),
    {
      onSuccess: () => {
        close();
      },
      onError: (e) => {
        notification.error({
          message: "Erro ao salvar óbito",
        });
      },
    }
  );

  const handleSubmittion = () => {
    const technician = vetsQuery.data.find(
      (item) => item.id === data.selectedVetId
    );

    const payload = {
      name: patient?.name,
      active: true,
      holderId: patient?.tutorData?.id,
      castrated: patient.castrated ?? false,
      raceId: patient.patientAnimal?.race?.id,
      type: patient?.type,
      gender: patient?.gender,
      birthDate: patient?.birth_date,

      death: true,
      deathDate: data.executedAt.toJSON(),
      technicianId: technician?.id,
      deathObservation: body,
    };
    deathMutation.mutate(payload);
  };

  return (
    <Modal
      visible={open}
      onCancel={close}
      title={"Óbito de paciente"}
      footer={null}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmittion();
        }}
      >
        <>
          <div className="uk-width-1-1">
            <label>Veterinário responsável</label>
            <AutoComplete
              className="uk-width-1-1"
              options={vetsQuery.data ?? []}
              value={data?.user}
              onSelect={(e, option) =>
                setData({ ...data, user: e, selectedVetId: option.id })
              }
              onChange={(e) => setData({ ...data, user: e })}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().includes(inputValue.toUpperCase())
                  ? option
                  : null
              }
            />
          </div>
          <div className="uk-margin-top uk-flex uk-flex-between">
            <div className="uk-width-1-1">
              <label>Data</label>
              <br />
              <DateTimeField
                onChange={(val) => setData({ ...data, executedAt: val })}
                slotProps={{ textField: { variant: "standard" } }}
                value={
                  data?.executedAt
                    ? moment(data?.executedAt, "YYYY-MM-DD[T]HH:mm:ss")
                    : null
                }
                className="uk-width-1-1"
              />
            </div>
          </div>

          <div className="uk-margin-top">
            <label>Relatório do Óbito</label>
            <Editor editorState={body} setEditorState={setBody} value={body} />
          </div>

          <FormFooter setVisible={close} />
        </>
      </form>
    </Modal>
  );
};

export default DeathForm;
