import { useState } from "react";
import { useRouter } from "next/router";

import { Error, Icon } from "infinity-forge";

import { Event } from "@/domain";
import {
  DateToYYYYMMDD,
  FormCreateTutor,
  PermissionItem,
  useScheduling,
  useSystem,
} from "@/presentation";

import { ContactForm } from "./contact-form";

import * as S from "./styles";

export function UserInfos({ event, setOpen }: { event: Event; setOpen }) {
  const [showContact, setShowContact] = useState(false);

  const router = useRouter();
  const { unit } = useSystem();
  const selectedDate = useScheduling((state) => state.selectedDate);

  const dateFormatted = DateToYYYYMMDD(selectedDate || new Date());

  const contactInfo = {
    user: {
      text:
      unit?.system?.type === "Vet"
          ? event?.event?.holder?.name
          : event?.event?.patient?.name,
      icon: <Icon name="IconUser" />,
    },
    phone: {
      text:
         unit?.system?.type === "Vet"
          ? event?.event?.holder?.tutor?.cellphone || "Telefone não informado"
          : event?.event?.patient?.cellphone || "Telefone não informado",
      icon: <Icon name="PhoneIcon" />,
    },
    github:
       unit?.system?.type === "Vet"
        ? {
            text: `${event?.event?.patient?.name} - RG: ${event?.event?.patient?.tag}`,
            icon: <Icon name="IconPet" color="#000" />,
          }
        : {},
    race: {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="Capa_1"
          enableBackground="new 0 0 511.856 511.856"
          height="512"
          viewBox="0 0 511.856 511.856"
          width="512"
          style={{ fill: "#000" }}
        >
          <g>
            <path d="m472.426 75.116c-49.455-49.466-127.99-52.553-181.022-8.841-6.182 5.072-7.476 6.522-35.476 34.556-27.383-27.416-29.244-29.443-35.45-34.534-53.469-44.073-131.962-40.277-181.048 8.819-52.573 52.584-52.574 138.163.001 190.772 218.662 218.652 206.031 206.795 209.718 208.669 4.484 2.46 10.06 2.13 14.092-.301 3.111-1.74-.619 1.623 209.187-208.371 52.572-52.606 52.571-138.184-.002-190.769zm-287.728 175.188c-14.155-27.116-32.329-36.017-45.086-38.71-11.534-2.431-21.833-6.834-30.612-13.09-18.109-12.896-23.836-22.896-21.475-27.093.843-1.5 2.709-2.469 4.754-2.469h40.72c6.933 0 7.99-3.463 21.795-9.429 1.234 11.76 4.468 25.381 11.908 37.723 4.27 7.084 13.483 9.386 20.59 5.103 7.095-4.277 9.38-13.496 5.103-20.59-5.307-8.803-7.323-19.283-7.979-27.866 3.114.351 6.091 1.048 8.913 2.125 20.941 7.996 29.241 34.049 29.303 34.245.944 3.151 9.283 20.889 19.063 36.097 24.303 37.96 54.484 58.943 81.289 66.883 6.329 1.875 13.436 3.421 19.738 3.682l49.638 6.617c-84.802 84.816-118.787 118.854-136.433 136.516-9.647-9.655-26.108-26.137-48.998-49.045v-13.06c-.001-56.438-7.481-99.381-22.231-127.639zm132.609-85.992c19.011 2.279 43.034 11.896 56.214 29.417 1.778 2.363 4.214 4.148 7.004 5.13.561.198 11.123 3.879 24.027 5.806-8.112 14.67-19.864 20.759-35.035 18.11-2.616-.456-5.307-.21-7.798.714-1.091.405-23.948 9.16-41.289 36.719-14.251-6.413-31.416-19.505-46.753-40.278 10.879-20.558 25.515-39.217 43.63-55.618zm133.904 80.363c-11.331 11.33-22.031 22.031-32.149 32.149l-67.234-8.962c6.862-8.239 13.698-12.751 17.49-14.838 17.69 1.863 33.655-3.158 46.412-14.662 15.239-13.742 21.521-33.473 21.141-32.456 5.309-14.227-4.843-29.493-20.019-30.131-8.64-.355-17.578-2.588-22.509-4.014-12.314-14.462-29.3-24.616-46.492-30.766 4.053-2.615 8.203-5.149 12.468-7.573 7.202-4.094 9.722-13.25 5.628-20.453s-13.25-9.721-20.453-5.628c-36.41 20.695-67.427 48.52-89.562 83.473-1.69-3.339-3.335-6.761-4.919-10.275-2.219-6.619-14.849-40.115-46.696-52.448-22.176-8.588-47.52-4.934-75.374 10.85h-36.665c-24.39 0-42.977 23.926-32.196 49.534 4.863 11.553 15.172 22.826 31.511 34.462 12.159 8.664 26.233 14.724 41.827 18.011 9.69 2.045 40.193 16.806 43.255 119.781-28.601-28.616-66.305-66.331-116.028-116.051-40.883-40.91-40.884-107.46-.002-148.352 38.25-38.259 98.752-41.499 140.777-6.859 5.406 4.435 5.358 4.652 43.898 43.19 5.855 5.855 15.356 5.857 21.213 0 38.419-38.417 38.464-38.732 43.924-43.212 41.842-34.485 102.353-31.528 140.753 6.882 40.882 40.891 40.881 107.441.001 148.348z" />
          </g>
        </svg>
      ),
      text:
         unit?.system?.type !== "Vet"
          ? ""
          : event?.event?.specie?.description +
            " > " +
            event?.event?.race?.description,
    },
  };

  const actions = {
    fichaPaciente: {
      className: "ficha",
      text: "Ficha paciente",
      onClick: () => {
        router.push(
          `/dashboard/paciente/${event.event.patient.id}?scheduleId=${event.event.id}&scheduleDate=${dateFormatted}`
        );
      },
    },
    contato: {
      className: "contact",
      text: "Contato",
      hash: "AGE09",
      onClick: () => setShowContact(!showContact),
    },
  };

  return (
    <Error name="UserInfos">
      <S.UserInfos>
        <div className="top">
          <div className="contacts">
            {Object.keys(contactInfo).map((key) => {
              const item = contactInfo[key];

              if (!item?.text) {
                return;
              }

              if (key === "user") {
                return (
                  <FormCreateTutor
                    isModal
                    origin="Agenda"
                    tutorId={
                       unit?.system?.type === "Vet"
                        ? event?.event?.holder?.id
                        : event.event.patient.id
                    }
                    trigger={
                      <div key={key}>
                        <span>
                          {item?.icon} <span dangerouslySetInnerHTML={{ __html: item?.text || "" }} />
                        </span>
                      </div>
                    }
                  />
                );
              }

              return (
                <div key={key}>
                  <span>
                    {item?.icon} <span dangerouslySetInnerHTML={{ __html: item?.text || "" }} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bottom">
          {Object.keys(actions).map((key) => {
            const item = actions[key];

            if (item?.hash) {
              return (
                <PermissionItem key={key} hash={item?.hash}>
                  <button
                    type="button"
                    onClick={item?.onClick}
                    className={`reset-button ${
                      item.className ? item.className : ""
                    }`}
                  >
                  <span dangerouslySetInnerHTML={{ __html: item?.text || "" }} />   {item?.icon}
                  </button>
                </PermissionItem>
              );
            }

            return (
              <button
                key={key}
                type="button"
                onClick={item?.onClick}
                className={`reset-button ${
                  item.className ? item.className : ""
                }`}
              >
               <span dangerouslySetInnerHTML={{ __html: item?.text || "" }} />  {item?.icon}
              </button>
            );
          })}
        </div>

        {showContact && <ContactForm event={event} setOpen={setOpen} />}
      </S.UserInfos>
    </Error>
  );
}
