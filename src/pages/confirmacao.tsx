import { ScheduleStatus } from "@/domain";
import { useConfigurationsSystem } from "@/presentation";
import { useQuery } from "infinity-forge";
import { HeadComponent, Icon, LoaderCircle, api } from "infinity-forge";
import moment from "moment";

import { useRouter } from "next/router";
import { useState } from "react";

import { styled } from "styled-components";

type ConfirmtionSchedule = {
  businessUnit: {
    id: string;
    identification: string;
    address: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    district: string;
    postalCode: string;
  };
  user: {
    id: string;
    name: string;
  };
  holder: {
    id: string;
    name: string;
  };
  patient: {
    id: string;
    name: string;
  };
  startHour: string;
  endHour: string;
  confirmationDate: null;
  confirmationOrigin: null;
  status: ScheduleStatus;
  scheduleServiceTypes: {
    description: string;
    treatmentItem: string | null;
    productivityItem: string | null;
  }[];
};

export default function ConfirmacaoAgendamento() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { logo_url, type } = useConfigurationsSystem();

  const { data, isFetching, mutate } = useQuery({
    queryKey: ["agenda"],
    queryFn: async () => {
      const response = await api({
        url: `schedules/confirmation/${router.query.scheduleId}`,
        method: "get",
      });

      return response as ConfirmtionSchedule;
    },
    enabled: !!router.query.scheduleId,
  });

  const status = data?.status?.type;

  async function cancelSchedule() {
    try {
      setLoading(true);

      await api({
        url: "schedules/confirmation",
        method: "post",
        body: {
          scheduleId: router.query.scheduleId,
          confirmationType: "CANC",
          observation: "",
        },
      });

      await mutate();
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function confirmSchedule() {
    try {
      setLoading(true);

      await api({
        url: "schedules/confirmation",
        method: "post",
        body: {
          scheduleId: router.query.scheduleId,
          confirmationType: "AC",
          observation: "",
        },
      });

      await mutate();
    } catch {
    } finally {
      setLoading(false);
    }
  }

  if (isFetching || loading) {
    return (
      <div style={{ padding: 100, textAlign: "center" }}>
        <LoaderCircle size={50} color="#000" />
      </div>
    );
  }

  if (status !== "AN" && status !== "AC" && status !== "CANC") {
    return (
      <Styles>
        <HeadComponent
          headContent={{
            pageTitle: "Confirmacao",
          }}
        />

        <header>
          <div className="container">
            <img src={logo_url} />
          </div>
        </header>

        <section className="container">
          <h1 className="font-24-bold">Confirmação de agendamento</h1>

          <div>
            <div className="intern-container">
              <h2 className="font-20-bold">
                {status === "FAL"
                  ? "Faltou"
                  : "Agendamento não disponível para Confirmação ou Cancelamento"}
              </h2>
            </div>
          </div>
        </section>
      </Styles>
    );
  }

  const start = moment(data.startHour).locale("pt-br");

  const diaSemana = start.format("dddd");
  const dataFormatada = start.format("D [de] MMMM [de] YYYY");
  const horaFormatada = start.add(3, "hours").format("HH:mm");

  return (
    <Styles>
      <HeadComponent
        headContent={{
          pageTitle: "Confirmacao",
        }}
      />

      <header>
        <div className="container">
          <img src={logo_url} />
        </div>
      </header>

      <section className="container">
        <h1 className="font-24-bold">Confirmação de agendamento</h1>

        <div>
          <div className="intern-container">
            {status === "CANC" ? (
              <>
                <h2 className="font-20-bold">
                  Você cancelou este agendamento!
                </h2>

                <div className="icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M15 16L20 21M20 16L15 21M4 21C4 17.134 7.13401 14 11 14M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
                        stroke="#a40f33"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </g>
                  </svg>
                </div>
              </>
            ) : status === "AC" ? (
              <>
                <h2 className="font-20-bold">
                  Seu agendamento foi confirmado com sucesso!
                </h2>

                <div className="icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#8fefbc"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <circle
                        opacity="0.5"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke=""
                        stroke-width="1.5"
                      ></circle>
                      <path
                        d="M8.5 12.5L10.5 14.5L15.5 9.5"
                        stroke=""
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </g>
                  </svg>
                </div>

                <div className="cancel-content">
                  <button className="cancel font-16" onClick={cancelSchedule}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M15 16L20 21M20 16L15 21M4 21C4 17.134 7.13401 14 11 14M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
                          stroke="#a40f33"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </g>
                    </svg>
                    Cancelar Agendamento
                  </button>
                </div>
              </>
            ) : (
              <h2 className="font-20-bold">
                Olá, {type === "Vet" ? data?.holder?.name : data?.patient?.name}
                , temos um agendamento para voce!
              </h2>
            )}

            <div className="list">
              <div className="item">
                <div className="icon">
                  <svg
                    fill="#fff"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    data-name="Layer 1"
                    stroke="#fff"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M11,12v1H10a1,1,0,0,0,0,2h1v1a1,1,0,0,0,2,0V15h1a1,1,0,0,0,0-2H13V12a1,1,0,0,0-2,0Zm10.66406-1.74756-9-8a.99893.99893,0,0,0-1.32812,0l-9,8a.99991.99991,0,0,0,1.32812,1.49512L4,11.449V21a.99974.99974,0,0,0,1,1H19a.99974.99974,0,0,0,1-1V11.449l.33594.29859a.99991.99991,0,0,0,1.32812-1.49512ZM18,20H6V9.6712l6-5.33331L18,9.6712Z"></path>
                    </g>
                  </svg>
                </div>

                <div>
                  <h3 className="font-16-bold">Clínica</h3>

                  <p className="font-14-regular">
                    {data?.businessUnit?.identification}
                  </p>
                </div>
              </div>

              <div className="item">
                <div className="icon">
                  <svg
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#fff"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M24.1333 22.1333C28.0381 22.1333 31.2 18.9714 31.2 15.0667C31.2 11.1619 28.0381 8 24.1333 8C20.2286 8 17.0667 11.1619 17.0667 15.0667C17.0667 18.9714 20.2286 22.1333 24.1333 22.1333ZM33.2 15.0667C33.2 20.076 29.1426 24.1333 24.1333 24.1333C19.124 24.1333 15.0667 20.076 15.0667 15.0667C15.0667 10.0573 19.124 6 24.1333 6C29.1426 6 33.2 10.0573 33.2 15.0667Z"
                        fill="#ffffff"
                      ></path>{" "}
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M18.1254 27.6282C17.8971 27.1604 17.3814 26.9076 16.8786 27.0312C11.4745 28.3592 6 31.0671 6 35.1407V40V42H8H40H42V40V35.1407C42 31.0671 36.5255 28.3592 31.1214 27.0312C30.6186 26.9076 30.1029 27.1604 29.8746 27.6282L25.8105 27.6282C24.9218 27.6284 24.4693 27.6284 24.0248 27.6284C23.5637 27.6283 23.1112 27.6283 22.1893 27.6285L18.1254 27.6282ZM25.8109 29.6282C25.8107 29.6282 25.8106 29.6282 25.8105 29.6282C24.9162 29.6284 24.466 29.6284 24.024 29.6284C23.5658 29.6283 23.1162 29.6283 22.1898 29.6285L22.1892 29.6285L18.1252 29.6282L16.8758 29.6281L16.6456 29.1564C14.3233 29.7829 12.1328 30.655 10.5162 31.7244C8.69262 32.9307 8 34.0995 8 35.1407V40H40V35.1407C40 34.0995 39.3074 32.9307 37.4838 31.7244C35.8672 30.655 33.6767 29.7829 31.3544 29.1564L31.1242 29.6282L29.8746 29.6282L25.8109 29.6282Z"
                        fill="#ffffff"
                      ></path>{" "}
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M16 34.9038C16.5384 34.9038 17 34.4601 17 33.8816C17 33.3031 16.5384 32.8594 16 32.8594C15.4616 32.8594 15 33.3031 15 33.8816C15 34.4601 15.4616 34.9038 16 34.9038ZM16 36.9038C17.6569 36.9038 19 35.5507 19 33.8816C19 32.2125 17.6569 30.8594 16 30.8594C14.3431 30.8594 13 32.2125 13 33.8816C13 35.5507 14.3431 36.9038 16 36.9038Z"
                        fill="#ffffff"
                      ></path>{" "}
                      <path
                        d="M15.6354 28.6117C15.4178 29.3461 15.4391 30.25 15.8901 31.3606L14.0371 32.1131C13.5935 31.0208 13.4293 29.9763 13.5293 28.9999C13.5627 28.6732 13.6258 28.3541 13.7178 28.0435L15.6354 28.6117Z"
                        fill="#ffffff"
                      ></path>{" "}
                      <path
                        d="M32.5348 31.496L34.476 31.9777C34.7266 30.9679 34.7789 30.0189 34.65 29.1395L32.4114 28.4784C32.743 29.284 32.8379 30.2747 32.5348 31.496Z"
                        fill="#ffffff"
                      ></path>{" "}
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M31.4268 31.225C31.6053 31.0795 31.8285 31 32.0588 31H34.9412C35.1715 31 35.3947 31.0795 35.5732 31.225L37.632 32.904C37.8649 33.094 38 33.3785 38 33.679V38.0444C38 38.5967 37.5523 39.0444 37 39.0444H34.9412V37.0444H36V34.1539L34.5851 33H32.4149L31 34.1539V37.0444H32.0588V39.0444H30C29.4477 39.0444 29 38.5967 29 38.0444V33.679C29 33.3785 29.1351 33.094 29.368 32.904L31.4268 31.225Z"
                        fill="#ffffff"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>

                <div>
                  <h3 className="font-16-bold">Profissional</h3>

                  <p className="font-14-regular">{data?.user?.name}</p>
                </div>
              </div>

              <div className="item">
                <div className="icon">
                  <Icon name="IconBox" color="#fff" />
                </div>

                <div>
                  <h3 className="font-16-bold">Serviço</h3>

                  <p className="font-14-regular">
                    {data?.scheduleServiceTypes.at(0)?.description}
                  </p>
                </div>
              </div>

              {type === "Vet" && (
                <div className="item">
                  <div className="icon">
                    <Icon name="IconPet" color="#fff" />
                  </div>

                  <div>
                    <h3 className="font-16-bold">Pet</h3>

                    <p className="font-14-regular">{data?.patient?.name}</p>
                  </div>
                </div>
              )}

              <div className="item">
                <div className="icon">
                  <Icon name="IconCalendar" color="#fff" />
                </div>

                <div>
                  <h3 className="font-16-bold">Data e Horário</h3>

                  <p className="font-14-regular">
                    {`${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)
                      }, ${dataFormatada}, você tem um agendamento às ${horaFormatada}hs`}
                  </p>
                </div>
              </div>

              <div className="item">
                <div className="icon">
                  <svg
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#00"
                    stroke="#00"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M6 12A6 6 0 106 0a6 6 0 000 12zM3 5a1 1 0 000 2h6a1 1 0 100-2H3z"
                        fill="#fff"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>

                <div>
                  <h3 className="font-16-bold">Situação</h3>

                  <span className="font-14-bold">
                    <Icon name="IconClockNotFilled" />{" "}
                    {data?.status?.description}
                  </span>
                </div>
              </div>
            </div>

            {status === "CANC" && (
              <p className="messa-confirm font-16">
                Ao confirmar um agendamento cancelado será verificado se o
                horário ainda está disponível
              </p>
            )}

            <div className="buttons">
              {status === "CANC" && (
                <button className="confirm font-16" onClick={confirmSchedule}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g id="Interface / Check">
                        <path
                          id="Vector"
                          d="M6 12L10.2426 16.2426L18.727 7.75732"
                          stroke="#000000"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </g>
                    </g>
                  </svg>
                  Confirmar Agendamento
                </button>
              )}

              {status === "AC" && (
                <>
                  <button
                    className="search-clinic font-16-bold"
                    onClick={() => {
                      const address = data.businessUnit;
                      const fullAddress = `${address.address}, ${address.number} - ${address.district}, ${address.city} - ${address.state}, ${address.postalCode}`;
                      const encodedAddress = encodeURIComponent(fullAddress);
                      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
                      window.open(googleMapsUrl, "_blank");
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#376467"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12 16.5017C14.4853 16.5017 16.5 14.487 16.5 12.0017C16.5 9.5164 14.4853 7.50168 12 7.50168C9.51472 7.50168 7.5 9.5164 7.5 12.0017C7.5 14.487 9.51472 16.5017 12 16.5017ZM12 14.5034C10.6184 14.5034 9.49832 13.3833 9.49832 12.0017C9.49832 10.62 10.6184 9.5 12 9.5C13.3816 9.5 14.5017 10.62 14.5017 12.0017C14.5017 13.3833 13.3816 14.5034 12 14.5034Z"
                          fill="#376467"
                        ></path>{" "}
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11 1C11 0.447715 11.4477 0 12 0C12.5523 0 13 0.447715 13 1V2.04938C17.7244 2.51844 21.4816 6.27558 21.9506 11H23C23.5523 11 24 11.4477 24 12C24 12.5523 23.5523 13 23 13H21.9506C21.4816 17.7244 17.7244 21.4816 13 21.9506V23C13 23.5523 12.5523 24 12 24C11.4477 24 11 23.5523 11 23V21.9506C6.27558 21.4816 2.51844 17.7244 2.04938 13H1C0.447715 13 0 12.5523 0 12C-1.19209e-07 11.4477 0.447715 11 1 11H2.04938C2.51844 6.27558 6.27558 2.51844 11 2.04938V1ZM12 20.0016C7.58083 20.0016 3.99839 16.4192 3.99839 12C3.99839 7.58083 7.58083 3.99839 12 3.99839C16.4192 3.99839 20.0016 7.58083 20.0016 12C20.0016 16.4192 16.4192 20.0016 12 20.0016Z"
                          fill="#376467"
                        ></path>{" "}
                      </g>
                    </svg>
                    Encontrar a clínica
                  </button>

                  <button
                    className="add-calendar font-16"
                    onClick={() => {
                      const formatDate = (date: Date) =>
                        date.toISOString().replace(/-|:|\.\d\d\d/g, "");

                      const addHours = (date: Date, hours: number) => {
                        const copy = new Date(date);
                        copy.setHours(copy.getHours() + hours);
                        return copy;
                      };

                      const startDate = addHours(new Date(data.startHour), 3);
                      const endDate = addHours(new Date(data.endHour), 3);

                      const startFormatted = formatDate(startDate);
                      const endFormatted = formatDate(endDate);

                      const address = data.businessUnit;
                      const location = `${address.address}, ${address.number} - ${address.district}, ${address.city} - ${address.state}, ${address.postalCode}`;

                      const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=Consulta com ${data.user.name
                        }&dates=${startFormatted}/${endFormatted}&details=Consulta agendada para o paciente ${data.patient.name
                        }&location=${encodeURIComponent(
                          location,
                        )}&sf=true&output=xml`;

                      window.open(googleCalendarUrl, "_blank");
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M17 11C14.2386 11 12 13.2386 12 16C12 18.7614 14.2386 21 17 21C19.7614 21 22 18.7614 22 16C22 13.2386 19.7614 11 17 11ZM17 11V9M2 9V15.8C2 16.9201 2 17.4802 2.21799 17.908C2.40973 18.2843 2.71569 18.5903 3.09202 18.782C3.51984 19 4.0799 19 5.2 19H13M2 9V8.2C2 7.0799 2 6.51984 2.21799 6.09202C2.40973 5.71569 2.71569 5.40973 3.09202 5.21799C3.51984 5 4.0799 5 5.2 5H13.8C14.9201 5 15.4802 5 15.908 5.21799C16.2843 5.40973 16.5903 5.71569 16.782 6.09202C17 6.51984 17 7.0799 17 8.2V9M2 9H17M5 3V5M14 3V5M15 16H17M17 16H19M17 16V14M17 16V18"
                          stroke="#000000"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </g>
                    </svg>
                    Adicionar ao caledário do Google
                  </button>
                </>
              )}

              {status === "AN" && (
                <button className="cancel font-16" onClick={cancelSchedule}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M15 16L20 21M20 16L15 21M4 21C4 17.134 7.13401 14 11 14M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
                        stroke="#a40f33"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </g>
                  </svg>
                  Cancelar Agendamento
                </button>
              )}

              {status === "AN" && (
                <button className="confirm font-16" onClick={confirmSchedule}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g id="Interface / Check">
                        <path
                          id="Vector"
                          d="M6 12L10.2426 16.2426L18.727 7.75732"
                          stroke="#000000"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </g>
                    </g>
                  </svg>
                  Confirmar Agendamento
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Styles>
  );
}

const Styles = styled("div")`
  min-height: 100dvh;
  background-color: #f5f5f5;

  p {
    margin: 0;
  }

  header {
    padding: 8px 0;
    background-color: #fff;
    box-shadow: 0 0.1rem 1rem 0.25rem #0000000d;

    img {
      height: auto;
      width: 120px;
    }
  }

  .container {
    margin: 0 auto;
    max-width: 1300px;
    padding: 0 15px;
  }

  section {
    padding-bottom: 20px !important;
  }

  section > h1 {
    margin: 20px 0;
    color: ${(p) => p.theme.black};
  }

  section > div {
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 30px 20px;
  }

  .intern-container {
    max-width: 900px;
    margin: 0 auto;
  }

  .intern-container > .icon {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;

    svg {
      height: 80px;
      width: auto;
      margin: 0 auto;
    }
  }

  .intern-container > .cancel-content {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
  }

  .intern-container > h2 {
    display: block;
    text-align: center;
    margin-bottom: 30px;
    color: ${(p) => p.theme.black};
  }

  .list {
    padding: 20px;
    border-radius: 10px;
    background-color: #f9f9f9;

    .item {
      display: flex;
      align-items: start;
      gap: 15px;

      & + .item {
        margin-top: 20px;
      }

      .icon {
        width: 40px;
        height: 40px;
        background-color: #5e6278;
        flex-shrink: 0;
        border-radius: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      svg {
        width: auto;
        height: 18px;
      }

      h3 {
        display: block;
        margin: 5px 0;
        color: ${(p) => p.theme.darkColor};
      }

      p {
        color: #828282;
      }

      span {
        border-radius: 5px;
        padding: 2px 6px;
        color: ${(p) => p.theme.black};
        background-color: #ddd;
        display: flex;
        align-items: center;

        svg {
          width: 14px;
          height: auto;
          margin-right: 5px;
          fill: ${(p) => p.theme.black};
        }
      }
    }
  }

  .messa-confirm {
    text-align: center;
    color: ${(p) => p.theme.darkColor};
    margin-top: 30px;
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
    gap: 20px;
  }

  button {
    height: 40px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 15px;
    border-radius: 5px;
    border: none;
    transition: opacity 0.3s ease-in-out;

    &:hover {
      opacity: 0.8;
    }

    svg {
      width: auto;
      height: 16px;
    }

    &.confirm {
      background-color: #8fefbc;
      color: ${(p) => p.theme.darkColor};
    }

    &.search-clinic {
      color: #376467;
      background-color: unset;
      padding: 0;
    }

    &.add-calendar {
      color: ${(p) => p.theme.darkColor};
      background-color: #d4eff0;
    }

    &.cancel {
      color: #a40f33;
      background-color: #ffdbe6;
    }
  }

  @media only screen and (max-width: 1400px) {
    .intern-container > .icon svg {
      height: 60px;
    }
  }

  @media only screen and (max-width: 1024px) {
    header img {
      width: 100px;
    }

    section > div {
      padding: 25px 15px;
    }

    .intern-container > h2,
    .intern-container > .icon,
    .intern-container > .cancel-content {
      margin-bottom: 20px;
    }

    .messa-confirm {
      margin-top: 20px;
    }

    section > h1 {
      margin: 20px 0;
    }

    .intern-container > .icon svg {
      height: 40px;
    }

    .list .item {
      gap: 10px;

      .icon {
        width: 30px;
        height: 30px;
        border-radius: 10px;
      }

      svg {
        height: 14px;
      }

      h3 {
        margin: 3px 0;
      }

      span {
        padding: 1px 4px;

        svg {
          width: 12px;
        }
      }
    }

    .buttons {
      gap: 15px;
      flex-wrap: wrap;
      margin-top: 20px;
    }

    button {
      height: 34px;
      padding: 0 10px;
      gap: 5px;
    }
  }

  @media only screen and (max-width: 768px) {
    section > h1 {
      margin: 15px 0;
    }

    .intern-container > .icon svg {
      height: 35px;
    }

    .buttons {
      gap: 10px;
      margin-top: 15px;
    }

    .intern-container > h2,
    .intern-container > .icon,
    .intern-container > .cancel-content {
      margin-bottom: 15px;
    }

    .messa-confirm {
      margin-top: 15px;
    }

    .container {
      padding: 0 8px;
    }

    section > div {
      padding: 20px 8px;
    }

    .list {
      padding: 8px;

      .item + .item {
        margin-top: 10px;
      }
    }
  }

  @media only screen and (max-width: 550px) {
    .buttons {
      gap: 10px;
    }
  }
`;
