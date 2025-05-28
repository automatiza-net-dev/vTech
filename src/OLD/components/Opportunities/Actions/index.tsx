// @ts-nocheck
import React, { useState, useCallback } from "react";

import { opportunitiesService } from "@/OLD/services/opportunities.service";

import { useRouter } from "next/router";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useAuth } from "@/OLD/hooks/useAuth";

import { Container } from "./styles";
import Update from "./Update";
import FormControll from "@/OLD/components/Kanban/CardsPanel/FormControll";

import CreateActivity from "@/OLD/components/OpportunitiesActivities/Create";
import {  Popconfirm } from "antd";

import { HiPencilAlt } from "react-icons/hi";
import { AiOutlineEye } from "react-icons/ai";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { BsXCircle } from "react-icons/bs";
import { BsCheckCircle, BsArrowCounterclockwise } from "react-icons/bs";
import { AxiosError } from "axios";
import { useToast } from "infinity-forge";

function Actions({
  setReload,
  opportunity,
  clients,
  colaborators,
  actTypes,
  crmStatus,
  contactTypes,
  subjects,
}) {
  const [updateVisible, setUpdateVisible] = useState(false);
  const [newActivityVisible, setNewActivityVisible] = useState(false);
  const [formData, setFormData] = useState(false);

  const editOpportunityPermission = useUserHasPermission("CRM02");
  const removeOpportunityPermission = useUserHasPermission("CRM03");
  const newActivityPermission = useUserHasPermission("CRM06");
  const addGainPermission = useUserHasPermission("CRM04");
  const addLossPermission = useUserHasPermission("CRM05");
  const reopenOpportunityPermission = useUserHasPermission("CRM10");

  const { createToast } = useToast();

  async function removeOpportunity(id) {
    try {
      await opportunitiesService.removeOpportunity(id);

      createToast({
        status: "success",
        message: "oportunidade removida com sucesso!",
      });
    } catch (error) {
      if (error instanceof AxiosError) {

        createToast({
          status: "error",
          message: error?.response?.data?.message,
        });
        
        return;
      }


      createToast({
        status: "error",
        message: "Houve um erro ao remover a oportunidade",
      });
      
     
    }
  }

  const router = useRouter();

  const reopenOpportunity = useCallback(() => {
    opportunitiesService
      ?.reopenOpportunity(opportunity?.id)
      .then((res) => {
        setReload((prv) => !prv);

        return createToast({
          status: "success",
          message: "Opportunidade reaberta com sucesso!",
        });
      })
      .catch((_err) =>
        createToast({
          status: "error",
          message: "não foi possível reabrir a oportunidade",
        })
      );
  }, [opportunity]);

  return (
    <Container className="uk-flex uk-flex-around">
      {!opportunity?.balance && (
        <>
          {editOpportunityPermission && (
            <FiEdit2 
              onClick={() => setUpdateVisible(true)}
              style={{ cursor: 'pointer', fontSize: '1.2rem' }}
            />
          )}
          {newActivityPermission && (
            <HiPencilAlt
              className="custom-cursor"
              size={15}
              onClick={() => setNewActivityVisible(true)}
            />
          )}
          {addGainPermission && opportunity?.status?.ganho ? (
            <BsCheckCircle
              className="custom-cursor"
              onClick={() =>
                setFormData({
                  op: opportunity,
                  form: "gain",
                  title: "Ganho oportunidade",
                  currencyField: "Valor do ganho (R$)",
                  selectField: "Motivo Ganho",
                  areaField: "Observações",
                })
              }
            />
          ) : null}
          {addLossPermission && opportunity?.status?.perda ? (
            <BsXCircle
              onClick={() =>
                setFormData({
                  op: opportunity,
                  form: "loss",
                  title: "Perda Oportunidade",
                  selectField: "Motivo Perda",
                  areaField: "Observações",
                })
              }
            />
          ) : null}
        </>
      )}
      {reopenOpportunityPermission && opportunity?.balance && (
        <BsArrowCounterclockwise
          className="custom-cursor"
          onClick={() => reopenOpportunity()}
        />
      )}
      <AiOutlineEye
        className="custom-cursor"
        onClick={() =>
          router.push(
            `/crm/oportunidades/oportunidades-atividades/${opportunity?.id}`
          )
        }
      />
      {removeOpportunityPermission && (
        <Popconfirm
          title="Deseja remover esta oportunidade?"
          onConfirm={() => removeOpportunity(opportunity?.id)}
        >
          <FiTrash2 
            twoToneColor="red"
            style={{ cursor: 'pointer', fontSize: '1.2rem', color: 'red' }}
          />
        </Popconfirm>
      )}
      {updateVisible && (
        <Update
          visible={updateVisible}
          setVisible={setUpdateVisible}
          opportunity={opportunity}
          setReload={setReload}
          clients={clients}
          colaborators={colaborators}
          crmStatus={crmStatus}
          contactTypes={contactTypes}
          subjects={subjects}
        />
      )}
      <CreateActivity
        colaborators={colaborators}
        actTypes={actTypes}
        visible={newActivityVisible}
        setVisible={setNewActivityVisible}
        setReload={setReload}
        opportunity={opportunity}
      />
      <FormControll
        formData={formData}
        setFormData={setFormData}
        setReload={setReload}
      />
    </Container>
  );
}

export default Actions;
