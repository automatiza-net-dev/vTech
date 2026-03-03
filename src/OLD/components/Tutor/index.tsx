// @ts-nocheck
import React, { useState } from "react";

import { List } from "./List";
import { CreateTutor } from "./Create";
import { useAuth } from "@/OLD/hooks/useAuth";

import { Input } from "./styles";
import FastCreateTutor from "@/OLD/components/Tutor/FastCreate";
import AccessDenied from "@/OLD/components/AccessDenied";
import { Modal } from "antd";

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { usePatientTutors } from "@/OLD/hooks/usePatientTutors";

import { Button, PageWrapper, useAuthAdmin } from "infinity-forge";
import { FormCreateTutor, useConfigurationsSystem } from "@/presentation";
import { useRouter } from "next/router";

export function Tutor({
  setPayload = false,
  payload = false,
  setDrawerIsOpen = false,
  setVisible = false,
  modal = false,
  setSearch = false,
  patientListVisible = false,
  origin = false,
  setReload = false,
  reload = false,
}: any) {
  const [filters, setFilters] = useState({ noSearch: true });
  const [fastCreateVisible, setFastCreateVisible] = useState(false);
  const [localReload, setLocalReload] = useState(false);
  const [createTutorVisible, setCreateTutorVisible] = useState(false);

  const { fetchPatientTutors } = usePatientTutors(filters);
  const { type } = useConfigurationsSystem();

  const router = useRouter();

  const listTutorsPermission = useUserHasPermission("TUT00");

  return !listTutorsPermission || listTutorsPermission === "loading" ? (
    <AccessDenied loading={listTutorsPermission} />
  ) : (
    <PageWrapper
      title={type === "Vet" ? "Responsáveis" : "Clientes"}
    >
      <div>
        <div className="uk-flex uk-margin-bottom uk-flex-between uk-width-1-1">
          <div className="uk-width-1-1">
            <div className="uk-margin-right uk-flex uk-flex-around">
              <Input>
                <input
                  type="search"
                  placeholder={`Nome ${
                    type === "Vet"
                      ? "Responsável"
                      : "Cliente"
                  }`}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      name: normalizeStr(e.target.value),
                    })
                  }
                />
              </Input>
              <Input>
                <input
                  type="search"
                  placeholder={`Telefone ${
                    type === "Vet"
                      ? "Responsável"
                      : "Cliente"
                  }`}
                  onChange={(e) =>
                    setFilters({ ...filters, phone: e.target.value })
                  }
                />
              </Input>
              {type === "Vet" && (
                <Input>
                  <input
                    type="search"
                    placeholder="Nome paciente"
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        patient: normalizeStr(e.target.value),
                      })
                    }
                  />
                </Input>
              )}
              <Input>
                <input
                  type="search"
                  placeholder={`CPF ${
                    type === "Vet"
                      ? "Responsável"
                      : "Cliente"
                  }`}
                  onChange={(e) =>
                    setFilters({ ...filters, document: e.target.value })
                  }
                />
              </Input>
              <div style={{ gap: "10px", display: "flex" }}>
                {router.asPath.includes("crm") ? (
                  <Button
                    text="Cadastrar"
                    onClick={() => {
                      setFastCreateVisible(true);
                      setVisible(false);
                    }}
                    type="button"
                  />
                ) : (
                  <FormCreateTutor isModal origin="Cadastro" />
                )}

                <div>
                  <Button
                    onClick={() => {
                      setFilters((prv) => ({ ...prv, noSearch: false }));
                      setReload
                        ? setReload((prv) => !prv)
                        : setLocalReload((prv) => !prv);
                    }}
                    text="Filtrar"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <List
          filters={filters}
          patientListVisible={patientListVisible}
          modal={modal}
          setPayload={setPayload}
          setDrawerIsOpen={setDrawerIsOpen}
          setVisible={setVisible}
          setSearch={setSearch}
          origin={origin}
          setReload={setReload ? setReload : setLocalReload}
          reload={reload ? reload : localReload}
          setFilters={setFilters}
        />
      </div>

      {fastCreateVisible && (
        <FastCreateTutor
          visible={fastCreateVisible}
          setVisible={setFastCreateVisible}
          fetchData={fetchPatientTutors}
          payload={payload}
          setPayload={setPayload}
          setSearch={setPayload}
          setNewPacient={setPayload}
          setTutorsReload={setReload}
          prevValues={filters}
          origin={origin}
          prevPhone={filters?.phone}
        />
      )}
    </PageWrapper>
  );
}
