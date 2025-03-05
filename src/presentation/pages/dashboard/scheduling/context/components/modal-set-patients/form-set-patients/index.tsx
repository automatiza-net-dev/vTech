import { Input, InputMask, FormHandler, BadRequestError } from "infinity-forge";

import {
  useSystem,
  useScheduling,
  FormCreatePatient,
  useLoadAllPatientTutor,
  useLoadSchedulesPatients,
} from "@/presentation";

import { TableAnimals } from "./table";
import { TableClients } from "./table-clients";

import * as S from "./styles";

export function FormSetClients() {
  const patientFilters = useScheduling((state) => state.patientsFilters);
  const setPatientsFilters = useScheduling((state) => state.setPatientsFilters);

  const { unit } = useSystem();

  const vetPatients = useLoadSchedulesPatients({
    patientFilters,
    enabled: !patientFilters
      ? false
      : unit?.system?.type === "Vet"
      ? true
      : false,
  });

  const normalPatients = useLoadAllPatientTutor({
    patientFilters,
    enabled: !patientFilters
      ? false
      : unit?.system?.type !== "Vet"
      ? true
      : false,
  });

  const data = vetPatients.data || normalPatients.data;
  const isFetching = vetPatients.isFetching || normalPatients.isFetching;

  return (
    <S.FormSetClients>
      <FormHandler
        cleanFieldsOnSubmit={false}
        isStickyButtons
        onSucess={async (data: {
          name: string;
          document: string;
          phone: string;
          tag: string;
          tutor: string;
        }) => {
          if (
            data?.name?.length >= 2 ||
            data?.tag?.length > 0 ||
            data?.tutor?.length >= 3 ||
            data?.phone?.length >= 3 ||
            data?.document?.length >= 3
          ) {
            setPatientsFilters(data);

            return;
          }

          throw new BadRequestError({
            code: "400",
            message:
              unit?.system?.type === "Vet"
                ? `Preencha pelo menos um dos campos de filtro (Nome do pet 2 caracteres, Telefone 3 caracteres, CPF 3 caracteres, Tutor 3 caracteres, RG Pet 1 caractere)`
                : "Preencha pelo menos um dos campos de filtro (Telefone 3 caracteres, CPF 3 caracteres, nome 3 caracteres)",
          });
        }}
        button={{ text: "Filtrar" }}
        customAction={{
          Component: () => (
            <FormCreatePatient
              isModal
              origin="Agenda"
              onSuccess={(response) => setPatientsFilters({ id: response?.id })}
            />
          ),
        }}
      >
        {unit?.system?.type === "Vet" && (
          <>
            <div className="row first">
              <Input
                icon={{
                  element: (
                    <svg
                      style={{ position: "relative", left: "-7px" }}
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 512 512"
                      xmlSpace="preserve"
                    >
                      <g>
                        <path
                          d="M191.4,164.127c29.081-9.964,44.587-41.618,34.622-70.699c-9.952-29.072-41.6-44.592-70.686-34.626
		c-29.082,9.956-44.588,41.608-34.632,70.69C130.665,158.582,162.314,174.075,191.4,164.127z"
                        />
                        <path
                          d="M102.394,250.767v0.01c16.706-25.815,9.316-60.286-16.484-76.986c-25.81-16.691-60.273-9.316-76.978,16.489
		v0.01c-16.695,25.805-9.306,60.268,16.495,76.958C51.236,283.957,85.694,276.573,102.394,250.767z"
                        />
                        <path
                          d="M320.6,164.127c29.086,9.948,60.734-5.545,70.695-34.636c9.956-29.081-5.55-60.734-34.631-70.69
		c-29.086-9.966-60.734,5.555-70.686,34.626C276.013,122.509,291.519,154.163,320.6,164.127z"
                        />
                        <path
                          d="M256,191.489c-87.976,0-185.048,121.816-156.946,208.493c27.132,83.684,111.901,49.195,156.946,49.195
		c45.045,0,129.813,34.489,156.945-49.195C441.048,313.305,343.976,191.489,256,191.489z"
                        />
                        <path
                          d="M503.068,190.289v-0.01c-16.705-25.805-51.166-33.18-76.976-16.489c-25.801,16.7-33.19,51.171-16.486,76.986
		v-0.01c16.7,25.806,51.158,33.19,76.968,16.481C512.374,250.557,519.764,216.095,503.068,190.289z"
                        />
                      </g>
                    </svg>
                  ),
                }}
                name="name"
                placeholder="Nome do pet"
              />

              <Input
                icon={{
                  element: (
                    <svg
                      style={{ position: "relative", left: "-7px" }}
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 512 512"
                      xmlSpace="preserve"
                    >
                      <g>
                        <path
                          d="M191.4,164.127c29.081-9.964,44.587-41.618,34.622-70.699c-9.952-29.072-41.6-44.592-70.686-34.626
		c-29.082,9.956-44.588,41.608-34.632,70.69C130.665,158.582,162.314,174.075,191.4,164.127z"
                        />
                        <path
                          d="M102.394,250.767v0.01c16.706-25.815,9.316-60.286-16.484-76.986c-25.81-16.691-60.273-9.316-76.978,16.489
		v0.01c-16.695,25.805-9.306,60.268,16.495,76.958C51.236,283.957,85.694,276.573,102.394,250.767z"
                        />
                        <path
                          d="M320.6,164.127c29.086,9.948,60.734-5.545,70.695-34.636c9.956-29.081-5.55-60.734-34.631-70.69
		c-29.086-9.966-60.734,5.555-70.686,34.626C276.013,122.509,291.519,154.163,320.6,164.127z"
                        />
                        <path
                          d="M256,191.489c-87.976,0-185.048,121.816-156.946,208.493c27.132,83.684,111.901,49.195,156.946,49.195
		c45.045,0,129.813,34.489,156.945-49.195C441.048,313.305,343.976,191.489,256,191.489z"
                        />
                        <path
                          d="M503.068,190.289v-0.01c-16.705-25.805-51.166-33.18-76.976-16.489c-25.801,16.7-33.19,51.171-16.486,76.986
		v-0.01c16.7,25.806,51.158,33.19,76.968,16.481C512.374,250.557,519.764,216.095,503.068,190.289z"
                        />
                      </g>
                    </svg>
                  ),
                }}
                name="tag"
                placeholder="RG do pet"
              />
            </div>
          </>
        )}

        <div className="row">
          <Input
            icon={{
              element: (
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" />
                </svg>
              ),
            }}
            name={unit?.system?.type === "Vet" ? "tutor" : "name"}
            placeholder="Nome"
          />

          <InputMask
            icon={{
              element: (
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" />
                </svg>
              ),
            }}
            name="phone"
            placeholder="Telefone"
            mask="(__) _____-____"
          />

          <InputMask
            icon={{
              element: (
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" />
                </svg>
              ),
            }}
            name="document"
            placeholder="CPF"
            mask="___.___.___-__"
          />
        </div>

        <div className="table-box">
          <div className="table" data-cy="table_patients">
            {unit?.system?.type === "Vet" ? (
              <TableAnimals data={data} isLoading={isFetching} />
            ) : (
              <TableClients data={data} isLoading={isFetching} />
            )}
          </div>
        </div>
      </FormHandler>
    </S.FormSetClients>
  );
}
