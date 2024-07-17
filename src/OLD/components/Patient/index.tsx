import React, { useMemo, useState, useEffect } from "react";

import { Button } from "@/OLD/components/mini-components";
import { PatientList } from "./List";
import { useRouter } from "next/router";

// Hooks
import { usePatientTutors } from "@/OLD/hooks/usePatientTutors";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Components
import { Input } from "./styles";
import FastCreateTutor from "@/OLD/components/Tutor/FastCreate";
import AccessDenied from "@/OLD/components/AccessDenied";

// Icons
import { SearchIcon } from "@/OLD/common/icons";

// Utils
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { FormCreatePatient } from "@/presentation";

import { Button as ButtonInfinityForge } from "infinity-forge";

export function Patient({
  setPayload = false,
  payload = false,
  setDrawerIsOpen = false,
  setVisible = false,
  modal = false,
  setSearch = false,
  patientListVisible = false,
  origin = false,
  setReload = false,
}: any) {
  const router = useRouter();
  const [filters, setFilters] = useState({ noSearch: true });
  const [fastCreateVisible, setFastCreateVisible] = useState(false);
  const [internReload, setInternReload] = useState(false);

  const { fetchPatientTutors } = usePatientTutors(
    "",
    true,
    false,
    fastCreateVisible
  );

  const querySchedule = useMemo(() => {
    if (router.query.page === "agenda") {
      return "?isSchedule=true";
    }

    return "";
  }, [router]);

  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        setFilters((prv) => ({ ...prv, noSearch: false }));
        setInternReload((prv) => !prv);
      }
    });
  }, []);

  const listPatientsPermission = useUserHasPermission("PET00");

  return !listPatientsPermission || listPatientsPermission === "loading" ? (
    <AccessDenied loading={listPatientsPermission} />
  ) : (
    <div className="uk-padding">
      {(!router?.query?.id || origin === "opportunities") && (
        <div>
          <h3 className="uk-margin-remove">
            {!modal ? "Pets" : "Selecionar paciente"}
          </h3>
          <div className="uk-flex uk-margin-bottom uk-flex-between">
            <div className="">
              <div className="uk-margin-right uk-flex uk-flex-between uk-width-1-1">
                <Input>
                  <input
                    type="search"
                    placeholder="Nome do pet"
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        name: normalizeStr(e.target.value),
                      } as any)
                    }
                  />
                  <SearchIcon />
                </Input>
                <Input>
                  <input
                    type="search"
                    placeholder="RG do pet"
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        tag: e.target.value,
                      } as any)
                    }
                  />
                  <SearchIcon />
                </Input>
                <Input>
                  <input
                    type="search"
                    placeholder="Nome tutor"
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        tutor: normalizeStr(e.target.value),
                      } as any)
                    }
                  />
                  <SearchIcon />
                </Input>
                <Input>
                  <input
                    type="search"
                    placeholder="Fone tutor"
                    onChange={(e) =>
                      setFilters({ ...filters, phone: e.target.value } as any)
                    }
                  />
                  <SearchIcon />
                </Input>
                <Input>
                  <input
                    type="search"
                    placeholder="CPF tutor"
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        document: e.target.value,
                      } as any)
                    }
                  />
                  <SearchIcon />
                </Input>
                <div className="uk-flex uk-flex-right">
                  <div className="uk-margin-small-top">
                    {router.asPath.includes("crm") ? (
                      <ButtonInfinityForge
                        type="button"
                        onClick={() => {
                          setFastCreateVisible(true);
                          setVisible(false);
                        }}
                        text="Novo Paciente"
                      />
                    ) : (
                      <FormCreatePatient isModal />
                    )}
                  </div>
                  <div className="uk-margin-small-top">
                    {" "}
                    <Button
                      onClick={() => {
                        setFilters((prv) => ({ ...prv, noSearch: false }));
                        setInternReload((prv) => !prv);
                      }}
                    >
                      Filtrar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <PatientList
            internReload={internReload}
            patientListVisible={patientListVisible}
            querySchedule={querySchedule}
            filters={filters}
            modal={modal}
            setPayload={setPayload}
            setDrawerIsOpen={setDrawerIsOpen}
            setVisible={setVisible}
            setSearch={setSearch}
            origin={origin}
          />
        </div>
      )}

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
        />
      )}
    </div>
  );
}
