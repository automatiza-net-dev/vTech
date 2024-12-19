// @ts-nocheck
import React, { useState, memo, useCallback, useEffect } from "react";

import FormChild from "../../FormChild";
import { Modal, notification } from "antd";

import { opportunitiesService } from "@/OLD/services/opportunities.service";

import { useProfile } from "@/OLD/hooks/useProfile";

import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import moment from "moment";

const Update = memo(function ({
  visible,
  setVisible,
  opportunity,
  setReload,
  clients,
  colaborators,
  crmStatus,
  contactTypes,
  subjects,
}) {
  const [data, setData] = useState({});
  const [values, setValues] = useState(false);
  const [loading, setLoading] = useState(false);

  const { clinic } = useProfile();

  useEffect(() => {
    setData({
      contact: opportunity?.contact,
      userId: opportunity?.user?.id,
      contactId: opportunity?.contact?.id,
      statusId: opportunity?.status?.id,
      description: "verificar",
      observation: "verificar",
      value: currencyFormatter(opportunity?.value),
      contactDate: moment(opportunity?.contactDate),
      active: opportunity?.active,
      description: opportunity?.description,
      observation: opportunity?.observation,
      contactTypeId: opportunity?.contactType?.id,
      originId: opportunity?.clientOrigin?.id,
      contactSubjectId: opportunity?.contactSubject?.id,
      closingUser: opportunity?.closingUser?.name,
      closingDate: opportunity?.closingDate
        ? moment(opportunity?.closingDate).format("DD/MM/YYYY")
        : "-",
      value: currencyFormatter(opportunity?.value),
      gain: opportunity?.balance,
      observation: opportunity?.observation,
      gender: opportunity?.client?.gender,
      castrated: JSON.stringify(opportunity?.client?.patientAnimal?.castrated),
      weight: opportunity?.client?.weight,
      tutorOriginId: opportunity?.clientOrigin?.id,
      originDescription: opportunity?.clientOrigin?.description,
      clientOriginItemDescription: opportunity?.clientOriginItemDescription,
    });

    setValues({
      collabName: opportunity?.user?.name,
      patientName: opportunity?.client?.name,
      tutorName: opportunity?.contact?.name,
    });
  }, [JSON.stringify(opportunity)]);

  const updateOpportunity = useCallback(() => {
    setLoading(true);

    opportunitiesService
      .update(opportunity?.id, {
        contactDate: data?.contactDate
          ? moment(data?.contactDate).toISOString()
          : null,
        originId: data?.originId,
        businessUnitId: clinic?.id,
        userId: data?.userId,
        clientId: data?.clientId,
        statusId: data?.statusId,
        description: data?.description,
        observation: data?.observation,
        contactId: data?.contactId,
        contactTypeId: data?.contactTypeId,
        contactSubjectId: data?.contactSubjectId,
        value: convertIntlCurrency(data?.value),
        active: data?.active,
      })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        setVisible(false);
        return notification.success({
          message: "Oportunidade atualizada com sucesso!",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message:
            "Houve um erro ao atualizar as informações da oportunidade, verifique os campos informados",
        });
      });
  }, [JSON.stringify(data), clinic?.id, JSON.stringify(opportunity)]);

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={1000}
      title="Alterar Oportunidade"
    >
      <FormChild
        op={opportunity}
        clients={clients}
        colaborators={colaborators}
        crmStatus={crmStatus}
        contactTypes={contactTypes}
        subjects={subjects}
        data={data}
        setData={setData}
        submit={updateOpportunity}
        type="update"
        prvsValues={values}
        setVisible={setVisible}
        setReload={setReload}
      />
    </Modal>
  );
});

export default Update;
