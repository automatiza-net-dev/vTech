import { useState } from "react";
import { useRouter } from "next/router";

import { Error, Icon } from "infinity-forge";

import { Event } from "@/domain";
import { FormCreateTutor, PermissionItem } from "@/presentation";

import { ContactForm } from "./contact-form";

import * as S from "./styles";

export function UserInfos({ event, setOpen }: { event: Event; setOpen }) {
  const [showContact, setShowContact] = useState(false);
  
  const router = useRouter();

  const contactInfo = {
    user: {
      text:
        process.env.client === "sancla"
          ? event?.event?.holder?.name
          : event?.event?.patient?.name,
      icon: <Icon name="IconUser" />,
    },
    github:
      process.env.client === "sancla"
        ? {
            text: `${event?.event?.patient?.name} - RG: ${event?.event?.patient?.tag}`,
            icon: <Icon name="IconPet" />,
          }
        : {},
    phone: {
      text:
        process.env.client === "sancla"
          ? event?.event?.holder?.tutor?.cellphone || "Telefone não informado"
          : event?.event.patient.cellphone || "Telefone não informado",
      icon: <Icon name="PhoneIcon" />,
    },
  };

  const actions = {
    fichaPaciente: {
      className: "ficha",
      text: "Ficha paciente",
      onClick: () =>
        router.push(`/dashboard/paciente/${event?.event?.patient?.id}`),
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
                    tutorId={
                      process.env.client === "sancla"
                        ? event?.event?.holder?.id
                        : event.event.patient.id
                    }
                    trigger={
                      <div key={key}>
                        <span>
                          {item?.icon} {item?.text}
                        </span>
                      </div>
                    }
                  />
                );
              }

              return (
                <div key={key}>
                  <span>
                    {item?.icon} {item?.text}
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
                    {item?.text} {item?.icon}
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
                {item?.text} {item?.icon}
              </button>
            );
          })}
        </div>

        {showContact && <ContactForm event={event} setOpen={setOpen} />}
      </S.UserInfos>
    </Error>
  );
}
