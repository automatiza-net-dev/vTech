import { useState, useEffect } from "react";

import { clinicService } from "@/OLD/services/clinic.service";

import Editor from "@/OLD/components/Editor";
import { DateTimeField } from "@mui/x-date-pickers";
import { Select, FormHandler, useToast, Button } from "infinity-forge";

import moment from "moment";
import { useLoadPatient } from "@/presentation";
import { useMutation, useQuery } from "infinity-forge";
import { useQueryClient } from "@/presentation/use-query";
import { petsService } from "@/OLD/services/patient.service";

function DeathForm({ modal = false, setModal = () => ({}), timeline_info }: any) {
  const [body, setBody] = useState("");
  const [data, setData] = useState<any>({});
  const [selectedVet, setSelectedVet] = useState<any>({ user: null });

  const { createToast } = useToast();

  const patient = useLoadPatient();

  const refetch = useQueryClient((st) => st.refetch);

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

  const deathMutation = useMutation({
    queryKey: ["deathMutation"],
    queryFn: async (payload) => {
      const response = await petsService.deathPatient(payload, patient?.data?.id)
      
     return response
    },
    onSuccess: async () => {
      await refetch(["RemotePatient", patient.data.id]);
      await refetch(["LastUpdates", patient.data.id]);

      close();
    },
    onError: async (e) => {
      createToast({
        message: "houve um erro ao salvar o óbito",
        status: "error",
      });
    },
  });


  const handleSubmittion = () => {
    if (!data?.selectedVetId) {
      return createToast({
        message: "Selecione um veterinário responsável",
        status: "error",
      });
    }
    if (!data?.executedAt) {
      return createToast({
        message: "Selecione a data em que ocorreu o óbito",
        status: "error",
      });
    }
    if (body === "") {
      return createToast({
        message: "Informe o relatório do óbito",
        status: "error",
      });
    }

    const technician = vetsQuery.data.find(
      (item) => item.id === data.selectedVetId
    );

    const payload = {
      technicianId: technician?.id,
      deathDate: data?.executedAt?.toJSON(),
      deathObservation: body,
    };

    deathMutation.mutate(payload);
  };

  useEffect(() => {
    if (!modal) {
      setSelectedVet({ user: timeline_info?.technician?.id });
      setData({
        executedAt: moment(timeline_info?.realized),
      });
      setBody(timeline_info?.deathObservation);
    } else {
      setSelectedVet({ user: "" });
    }
  }, [timeline_info, modal]);

  return (
    <FormHandler isStickyButtons>
      <>
        <div className="uk-width-1-1">
          <label>Veterinário responsável</label>
          {vetsQuery?.data &&
            vetsQuery?.data?.length > 0 &&
            selectedVet.user !== null && (
              <FormHandler initialData={selectedVet}>
                <Select
                  menuPlacement="bottom"
                  name="user"
                  options={vetsQuery.data.map((user) => ({
                    label: user?.value,
                    value: user?.id,
                  }))}
                  disabled={!modal}
                  onlyOneValue
                  onChangeInput={async (value) => {
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
              disabled={!modal}
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
          <Editor
            editorState={body}
            setEditorState={setBody}
            value={body}
            readOnly={!modal}
          />
        </div>

        {modal && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleSubmittion}
              text="Salvar"
              style={{ marginRight: "10px" }}
            />

            <Button
              onClick={() => {
                setModal(false);
              }}
              style={{ backgroundColor: "#ff7b5a" }}
              text="Cancelar"
            />
          </div>
        )}
      </>
    </FormHandler>
  );
}

export default DeathForm;
