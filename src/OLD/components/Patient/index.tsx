import React, { useMemo, useState, useEffect } from "react";

import { PatientList } from "./List";
import { useRouter } from "next/router";

// Hooks
import { usePatientTutors } from "@/OLD/hooks/usePatientTutors";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Components
import { Input } from "./styles";
import { Button, PageWrapper } from "infinity-forge";
import FastCreateTutor from "@/OLD/components/Tutor/FastCreate";
import AccessDenied from "@/OLD/components/AccessDenied";

// Utils
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { FormCreatePatient } from "@/presentation";

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
    <PageWrapper title={!modal ? "Pets" : "Selecionar paciente"}>
      <div>
        {(!router?.query?.id || origin === "opportunities") && (
          <div>
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
                  </Input>
                  <Input>
                    <input
                      type="search"
                      placeholder="Nome responsável"
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          tutor: normalizeStr(e.target.value),
                        } as any)
                      }
                    />
                  </Input>
                  <Input>
                    <input
                      type="search"
                      placeholder="Fone responsável"
                      onChange={(e) =>
                        setFilters({ ...filters, phone: e.target.value } as any)
                      }
                    />
                  </Input>
                  <Input>
                    <input
                      type="search"
                      placeholder="CPF responsável"
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          document: e.target.value,
                        } as any)
                      }
                    />
                  </Input>
                  <div
                    style={{
                      gap: "10px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div>
                      {router.asPath.includes("crm") ? (
                        <Button
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
                    <div>
                      {" "}
                      <Button
                        onClick={() => {
                          setFilters((prv) => ({ ...prv, noSearch: false }));
                          setInternReload((prv) => !prv);
                        }}
                        text="Filtrar"
                      />
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
            // setNewPacient={setPayload}
            setTutorsReload={setReload}
          />
        )}
      </div>
    </PageWrapper>
  );
}
