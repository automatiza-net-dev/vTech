// @ts-nocheck
import { memo, useState } from "react";

import { useParsedHospitalizations } from "@/OLD/hooks/useHospitalizations";
import { useRouter } from "next/router";

import { Container, PatientBox } from "./styles";
import Filters from "./Filters";
import { Dropdown, Menu, Modal, Input } from "antd";
import { HospitalizationTimeline } from "@/OLD/components/Hospitalization/HospitalizationTimeline";
import { Button, PageWrapper } from "infinity-forge";
import HospitalizationControl from "@/OLD/components/Hospitalization/Control";
import HeaderForm from "@/OLD/components/Hospitalization/HeaderForm";

import { VscTriangleDown } from "react-icons/vsc";

import moment from "moment";

const risks = [
  { id: 1, value: "Leve", color: "#2E8B57", textColor: "#F8F8FF" },
  { id: 2, value: "Médio", color: "#FFD700", textColor: "#1C1C1C" },
  { id: 3, value: "Grave", color: "#FF8C00", textColor: "#1C1C1C" },
  { id: 4, value: "Gravíssimo", color: "var(--red)", textColor: "#F8F8FF" },
];

const types = [
  { id: 1, value: "Internação" },
  { id: 2, value: "Observação" },
  { id: 3, value: "UTI" },
];

const HospitalizationConsult = memo(function HospitalizationConsult() {
  const [filters, setFilters] = useState({});
  const [reload, setReload] = useState(false);
  const [tlVisible, setTlVisible] = useState(false);
  const [selectedHospitalization, setSelectedHospitalization] = useState({});
  const [controlVisible, setControlVisible] = useState(false);
  const [hospitalizationData, setHospitalizationData] = useState(false);

  const { hospitalizations } = useParsedHospitalizations(filters, reload);

  const router = useRouter();

  return (
    <PageWrapper title="Consulta de internações">
      <Container>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={() => setReload((prv) => !prv)} text="Filtrar" />
        </div>
        <Filters filters={filters} setFilters={setFilters} />
        <hr />
        <div className="uk-flex uk-flex-wrap">
          {hospitalizations?.length > 0 &&
            hospitalizations?.map((hospitalization) => (
              <PatientBox
                className=""
                backgroundNameColor={
                  risks.find((risk) => risk?.id === hospitalization?.risk)
                    ?.color
                }
                textColor={
                  risks.find((risk) => risk?.id === hospitalization?.risk)
                    ?.textColor
                }
              >
                <Dropdown
                  trigger="click"
                  overlay={
                    <Menu
                      items={[
                        {
                          key: "hospitalizationData",
                          label: "Dados da internação",
                          onClick: () =>
                            setHospitalizationData(hospitalization),
                        },
                        {
                          key: "medicalPrescription",
                          label: "Prescrições médicas",
                          onClick: () => {
                            setSelectedHospitalization(hospitalization);
                            setControlVisible(true);
                          },
                        },
                        {
                          key: "hospitalization",
                          label: "Registros de internação",
                          onClick: () => {
                            setTlVisible(true);
                            setSelectedHospitalization(hospitalization);
                          },
                        },
                        {
                          key: "patientAttendances",
                          label: "Ficha do patiente",
                          onClick: () =>
                            router.push(
                              `/dashboard/paciente/${hospitalization?.patient?.id}`
                            ),
                        },
                        !hospitalization?.finishedAt && {
                          key: "hospitalizationSchedules",
                          label: "Agenda internações",
                          onClick: () => {
                            router.push("/dashboard/internacao");
                          },
                        },
                      ]}
                    />
                  }
                >
                  <h4 className="patient-oc uk-margin-remove uk-flex uk-flex-between uk-flex-middle">
                    <span>
                      {hospitalization?.patient?.name}&nbsp;-&nbsp;RG:&nbsp;
                      {hospitalization?.patient?.tag}
                    </span>
                    <VscTriangleDown className="uk-margin-small-bottom" />
                  </h4>
                </Dropdown>
                <span className="uk-margin-remove">
                  {hospitalization?.patient?.patientAnimal?.race?.description}
                </span>
                <div className="uk-flex uk-flex-between uk-margin-small-top">
                  <div>
                    <p className="uk-text-muted uk-margin-remove">
                      Tutor: {hospitalization?.tutor?.name}
                    </p>
                    <p className="uk-text-muted uk-margin-remove">
                      Data internação:{" "}
                      {moment(
                        hospitalization?.createdAt,
                        "YYYY-MM-DD[T]HH:mm:ss"
                      ).format("DD/MM/YYYY")}
                    </p>
                    <p className="uk-text-muted uk-margin-remove">
                      Data da previsão de alta:{" "}
                      {moment(
                        hospitalization?.expectedDischarge,
                        "YYYY-MM-DD[T]HH:mm:ss"
                      ).format("DD/MM/YYYY")}
                    </p>
                    {hospitalization?.releasedAt && (
                      <p className="uk-text-muted uk-margin-remove">
                        Data da alta:&nbsp;
                        {hospitalization?.releasedAt
                          ? moment(
                              hospitalization?.releasedAt,
                              "YYYY-MM-DD[T]HH:mm:ss"
                            ).format("DD/MM/YYYY")
                          : "-"}
                      </p>
                    )}
                    {hospitalization?.deathAt && (
                      <p className="uk-margin-remove">
                        <span>
                          Data óbito:&nbsp;
                          {moment(hospitalization?.deathAt).format(
                            "DD/MM/YYYY"
                          )}
                        </span>
                      </p>
                    )}
                    <p className="uk-margin-remove">
                      <span className="uk-margin-remove">
                        Dias Internado:&nbsp;
                        {!hospitalization?.releasedAt
                          ? moment(new Date()).diff(
                              moment(hospitalization.createdAt),
                              "days"
                            )
                          : moment(hospitalization?.releasedAt).diff(
                              moment(hospitalization.createdAt),
                              "days"
                            ) > 0
                          ? moment(hospitalization?.releasedAt).diff(
                              moment(hospitalization.createdAt),
                              "days"
                            )
                          : 1}
                        &nbsp;dias
                      </span>
                    </p>
                  </div>
                </div>
              </PatientBox>
            ))}
        </div>
        {tlVisible && (
          <HospitalizationTimeline
            visible={tlVisible}
            setVisible={setTlVisible}
            modal={true}
            patientData={selectedHospitalization}
          />
        )}
        {controlVisible && (
          <HospitalizationControl
            id={selectedHospitalization?.id}
            visible={controlVisible}
            origin={"consult"}
            close={() => setControlVisible(false)}
          />
        )}
        {hospitalizationData && (
          <Modal
            title="Dados da internação"
            visible={!!hospitalizationData}
            onCancel={() => setHospitalizationData(false)}
            footer={
              <footer style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={() => setHospitalizationData(false)}
                  text="Fechar"
                />
              </footer>
            }
          >
            <HeaderForm patientData={hospitalizationData} />
            <div>
              <label>Queixa</label>
              <Input disabled value={hospitalizationData?.complaint} />
            </div>
            <div className="uk-margin-small-top">
              <label>Diagnóstico até o momento</label>
              <Input disabled value={hospitalizationData?.diagnosis || "-"} />
            </div>
            <div className="uk-margin-small-top">
              <label>Veterinário responsável</label>
              <Input disabled value={hospitalizationData?.technician} />
            </div>
            <div className="uk-margin-small-top">
              <label>Tutor</label>
              <Input disabled value={hospitalizationData?.tutor?.name} />
            </div>
            <div className="uk-margin-small-top">
              <label>Gravidade</label>
              <Input
                disabled
                value={
                  risks.find((item) => item?.id === hospitalizationData?.risk)
                    ?.value
                }
              />
            </div>
          </Modal>
        )}
      </Container>
    </PageWrapper>
  );
});

export default HospitalizationConsult;
