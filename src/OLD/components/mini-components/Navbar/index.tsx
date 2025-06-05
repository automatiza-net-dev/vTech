// @ts-nocheck
import React from "react";

import { useRouter } from "next/router";

import {
  Container,
  Left,
  Top,
  Body,
  Input,
  ArrowContent,
  SelectOptions,
} from "./styles";
import Link from "next/link";
import { userService } from "@/OLD/services/user.service";
import { sessionService } from "@/OLD/services/session.service";

import { useAuth } from "@/OLD/hooks/useAuth";
import { InfraTypes, container } from "@/container";
import { useAuthAdmin } from "infinity-forge";
import { useQuery } from "infinity-forge";
import { useConfigurationsSystem } from "@/presentation";

const icons = [
  {
    icon: <></>,
    label: "Dashboard",
    to: "/dashboard",
  },
  {
    icon: <></>,
    label: "Agenda",
    to: "/agenda",
  },
  {
    icon: <></>,
    label: "Pacientes",
    to: "/pacientes",
  },
  {
    icon: <></>,
    label: "Relatórios",
    to: "/relatorios",
  },
];

export const Navbar = React.memo(function Navbar({
  children,
  setOpenModalClinic,
  setOpenEdit,
}) {
  const [notificationVisulized, setNotificationVisulized] =
    React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [data, setData] = React.useState({});

  const router = useRouter();

  const { signOut } = useAuthAdmin();
  const {logo_url} = useConfigurationsSystem()

  React.useEffect(() => {
    async () => {
      const storage = container.get<Storate>(TypesAutomatiza.storage);
      const ipAddres = storage.get<"ip">("ip");
      return await api.get(`/auth/me?ip=${ipAddres.value}`);
    };
  }, []);

  return (
    <Container>
      <Left>
        <div className="uk-flex uk-flex-center logo-container"></div>

        {icons.map((icon, index) => (
          <Link href={icon.to} key={index}>
            <div key={index} className="icon-container">
              {icon.icon}
            </div>
          </Link>
        ))}
      </Left>
      <Top>
       

        <div className="profile-info">
          <div
            className="icon-notification"
            onClick={() => {
              setNotificationVisulized(true);
              setNotificationsOpen(!notificationsOpen);
            }}
          >
           
            {!notificationVisulized && (
              <div className="count-notifications">2</div>
            )}
          </div>
          <div className="profile uk-margin-large-left">
            <div className="profile-img">
              <img
                src={
                  logo_url
                }
                width="30px"
                height="30px"
              />
            </div>
            <div className="profile-name">
              <span onClick={() => setProfileOpen(!profileOpen)}>
                {data?.data?.user?.name}
              </span>
              <ArrowContent open={profileOpen}>
                <div
                  className="arrow"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <ArrowProfile />
                </div>
                <SelectOptions open={profileOpen}>
                  <option
                    onClick={() => {
                      setOpenEdit(true);
                    }}
                  >
                    Editar clinicas
                  </option>
                  <option
                    onClick={() => {
                      setOpenModalClinic(true);
                    }}
                  >
                    Cadastrar nova clinica
                  </option>
                  <option
                    onClick={() => {
                      signOut();
                      router.push("/");
                    }}
                  >
                    Sair
                  </option>
                </SelectOptions>
              </ArrowContent>
            </div>
          </div>
        </div>
      </Top>

      <Body>{children}</Body>
    </Container>
  );
});
