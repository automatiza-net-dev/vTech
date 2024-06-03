// @ts-nocheck
import React, { memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import { hospitalizationService } from "@/OLD/services/hospitalization.service";

import { Modal, notification } from "antd";
import FormChild from "./FormChild";

import moment from "moment";

const situations = [
  { id: "1", value: "Admissão de Internação" },
  { id: "2", value: "Admissão de Observação" },
  { id: "3", value: "Admissão de Uti" }
];

const Hospitalization = memo(function ({
  patient,
  visible,
  setVisible,
  reload,
  setReload,
  modal = true,
  updateData = false
}) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const submitHospitalization = useCallback(() => {
    setLoading(true);
    let error = false;
    hospitalizationService
      .createHospitalization({
        tutorId: patient?.tutors?.find((tutor) => tutor?.is_main)?.id,
        patientId: patient?.id,
        type: parseInt(data?.type),
        complaint: data?.complaint,
        expectedDischarge: data?.expectedDischarge,
        risk: data?.risk,
        diagnosis: data?.diagnosis,
        bedId: data?.bedId,
        prognosis: data?.prognosis
      })
      .then((_res) =>
        notification.success({
          message: "Entrada na internação realizada com sucesso!"
        })
      )
      .catch((err) => {
        error = true;
        setLoading(false);
        return err?.response?.data?.errors
          ? notification.error({
              message: `${err.response.data.errors[0].message}`
            })
          : notification.error({
              message: "Houve um erro ao registrar a internação do paciente..."
            });
      })
      .finally(() => {
        setLoading(false);
        if (!error) {
          setVisible(false);
          setData({});
          setReload(!reload);
          router.push("/dashboard/internacao");
        }
      });
  }, [patient, data]);

  useEffect(() => {
    updateData &&
      setData({
        complaint: updateData?.timeline_info?.complaint,
        diagnosis: updateData?.timeline_info?.diagnosis,
        expectedDischarge: moment(updateData?.timeline_info?.expectedDischarge),
        bedId: updateData?.timeline_info?.bed?.id,
        risk: updateData?.timeline_info?.hospitalization?.risk,
        type: updateData?.timeline_info?.hospitalization?.type,
        user: updateData?.timeline_info?.technician?.name,
        prognosis: updateData?.timeline_info?.prognosis,
        type: situations?.find((item) =>
          item?.value.includes(updateData?.timeline_info.type)
        )?.id,
        risk: updateData?.timeline_info?.risk
      });
  }, [updateData]);

  return modal ? (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      title={`Internação - Admissão, Paciente: ${patient?.name}, Rg: ${
        patient?.tag ?? "-"
      }`}
      footer={null}
      width={600}
    >
      <FormChild
        data={data}
        setData={setData}
        setVisible={setVisible}
        submit={submitHospitalization}
        visible={visible}
      />
    </Modal>
  ) : (
    <FormChild
      data={data}
      setData={setData}
      setVisible={setVisible}
      submit={submitHospitalization}
      visible={visible}
      edit={false}
    />
  );
});

export default Hospitalization;
