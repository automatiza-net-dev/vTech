// @ts-nocheck
// Core
import { memo, useState } from "react";

// Services
import { clinicService } from "@/OLD/services/clinic.service";

// Components
import { AutoComplete, Modal, notification } from "antd";
import Editor from "@/OLD/components/Editor";
import FormFooter from "@/OLD/components/mini-components/CustomFormFooter";
import { DateTimeField } from "@mui/x-date-pickers";
import { Select, FormHandler } from "infinity-forge";

// Utils
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { petsService } from "@/OLD/services/patient.service";
import { useLoadPatient } from "@/presentation";

function DeathForm({ modal = false, setModal = () => ({}) }) {
  const [body, setBody] = useState("");
  const [data, setData] = useState({});

  const patient = useLoadPatient();

  const queryClient = useQueryClient();

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
    (payload) => petsService.deathPatient(payload, patient?.data?.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["RemotePatient", patient.data.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["LastUpdates", patient.data.id],
        });

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
      technicianId: technician?.id,
      deathDate: data.executedAt.toJSON(),
      deathObservation: body,
    };

    deathMutation.mutate(payload);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmittion();
      }}
    >
      <>
        <div className="uk-width-1-1">
          <label>Veterinário responsável</label>
          {vetsQuery?.data && vetsQuery?.data?.length > 0 && (
            <FormHandler>
              <Select
                menuPlacement="bottom"
                name="user"
                options={vetsQuery.data.map((user) => ({
                  label: user?.value,
                  value: user?.id,
                }))}
                disabled={!modal}
                onlyOneValue
                onChangeSelect={async (value) => {
                  const selectedUser = vetsQuery.data.find(
                    (user) => user.id === value
                  );

                  setData({
                    ...data,
                    user: selectedUser.value,
                    selectedVetId: value,
                  });
                }}
              />
            </FormHandler>
          )}
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

        <FormFooter setVisible={setModal} />
      </>
    </form>
  );
}

export default DeathForm;
