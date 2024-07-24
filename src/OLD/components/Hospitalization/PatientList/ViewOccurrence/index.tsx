// @ts-nocheck
// Core
import React, { memo, useEffect, useState, useCallback } from "react";

// Components
import { Modal, Button, Input, notification, AutoComplete } from "antd";
import HeaderForm from "@/OLD/components/Hospitalization/HeaderForm";
import Editor from "@/OLD/components/Editor";
import Print from "@/OLD/components/mini-components/Print";
import { DatePicker } from "@mui/x-date-pickers";

// Hooks
import { useColaborators } from "@/OLD/hooks/useColaborators";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Services
import { hospitalizationOccurences } from "@/OLD/services/hospitalizationsOcurrences.service";

// Utils
import moment from "moment";
import { normalizeStr } from "@/OLD/utils/normalizeString";

const ViewOccurrence = memo(function ViewOccurrence({
  visible,
  setVisible,
  occurrenceData,
  patientData,
  setReload,
  selectedHour = false,
}) {
  const [body, setBody] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { occurrence } = occurrenceData;
  const { colaborators } = useColaborators(visible);

  const editPermission = useUserHasPermission("INT06");
  const editPermissionFinished = useState("INT07");

  useEffect(() => {
    visible &&
      setData({
        ...occurrenceData,
        executedAt: moment(occurrenceData?.executed_at),
        userName: occurrenceData?.user?.name,
        userId: occurrenceData?.user?.id,
      });
    visible && setBody(occurrenceData?.description);
  }, [visible, occurrenceData]);

  const updateMedicalReport = useCallback(async () => {
    try {
      setLoading(true);

      const r = await hospitalizationOccurences.updateOccurrence(
        occurrenceData?.id,
        {
          hospitalizationId: patientData?.id,
          occurrenceId: occurrence?.id,
          description: body,
          executedAt: data?.executedAt,
          resume: data?.resume,
          active: data?.active,
          previewedAt: occurrenceData?.previewed_at,
          userId: data?.userId,
        }
      );

      setVisible(false);
      setLoading(false);
      setReload((prv) => !prv);
      return notification.success({
        message: "Relatório atualizado com sucesso!",
      });
    } catch (error) {
      return notification.error({
        message: "Houve um erro ao atualizar o relatório.",
      });
    }
  }, [body, occurrenceData, patientData?.id, data]);

  const verifyEdit = () => {
    if (occurrence?.type === "RM" || occurrence?.type === "OC") {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Modal
      title={`${occurrence?.description} (${occurrence?.type})`}
      visible={visible}
      setVisible={setVisible}
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <HeaderForm patientData={patientData} />
      <hr />
      <div>
        <label>Data</label>
        <DatePicker
          className="uk-width-1-1"
          value={data?.executedAt}
          disabled={!verifyEdit()}
          format="DD/MM/YYYY - HH:mm"
          slotProps={{ textField: { variant: "standard" } }}
          onChange={(val) => setData((prv) => ({ ...prv, executedAt: val }))}
        />
      </div>
      <div className="uk-margin-top">
        <label>Veterinário responsável</label>
        <AutoComplete
          disabled={!verifyEdit()}
          options={colaborators?.map((collab) => ({
            ...collab,
            value: collab?.name,
          }))}
          className="uk-width-1-1"
          value={data.userName}
          onChange={(val) =>
            setData((prv) => ({ ...prv, userName: val, userId: false }))
          }
          onSelect={(_, opt) =>
            setData((prv) => ({
              ...prv,
              userName: opt?.value,
              userId: opt?.id,
            }))
          }
        />
      </div>
      {occurrenceData?.resume && (
        <div className="uk-margin-top">
          <label>{occurrenceData?.occurrence?.description}</label>
          <Input
            value={data?.resume}
            disabled={!verifyEdit()}
            onChange={(e) =>
              setData((prv) => ({ ...prv, resume: e.target.value }))
            }
          />
        </div>
      )}
      <div className="uk-margin-top">
        <label>Relatório</label>
        <Editor
          editorState={body}
          setEditorState={setBody}
          readOnly={!verifyEdit()}
        />
      </div>
      <div className="uk-margin-top">
        <label>Anexos</label>
        <br />
        {occurrenceData?.attachments?.length > 0 &&
          occurrenceData?.attachments.map((photo) => (
            <img
              src={`${process.env.NEXT_PUBLIC_API}${photo?.attachment}`}
              width="200"
            />
          ))}
      </div>
      <hr />
      <footer className="uk-flex uk-flex-right">
        <section>
          {verifyEdit() && (
            <Button
              className="uk-margin-right"
              onClick={() => updateMedicalReport()}
              type="primary"
            >
              Atualizar
            </Button>
          )}
          <Print
            triggerComponent={
              <Button className="uk-margin-top">Imprimir</Button>
            }
            content={body}
            title={"Relatório médico"}
            string={true}
            tutor={patientData?.tutor}
            patient={patientData?.patient}
            onBeforePrint={async () => await updateMedicalReport()}
          />

          <Button className="uk-margin-left" onClick={() => setVisible(false)}>
            Fechar
          </Button>
        </section>
      </footer>
    </Modal>
  );
});

export default ViewOccurrence;
