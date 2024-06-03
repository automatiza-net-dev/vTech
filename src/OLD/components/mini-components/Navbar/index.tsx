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
import {
  HomeIcon,
  ScheduleIcon,
  FootPrint,
  File,
  SearchIcon,
  BellIcon,
  ArrowProfile,
} from "@/OLD/common/icons";
import Link from "next/link";
import { userService } from "@/OLD/services/user.service";
import { sessionService } from "@/OLD/services/session.service";

import { useAuth } from "@/OLD/hooks/useAuth";
import { useAuthAdmin } from "infinity-forge";

const icons = [
  {
    icon: <HomeIcon />,
    label: "Dashboard",
    to: "/dashboard",
  },
  {
    icon: <ScheduleIcon />,
    label: "Agenda",
    to: "/agenda",
  },
  {
    icon: <FootPrint />,
    label: "Pacientes",
    to: "/pacientes",
  },
  {
    icon: <File />,
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

  const { signOut } = useAuthAdmin()

  React.useEffect(() => {
    userService.getUser().then((res) => {
      setData(res);
    });
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
        {/*
        <Input>
          <SearchIcon />
          <input
            type="search"
            placeholder="Pesquise pacientes, tutores, dados e etc."
          />
        </Input>
      */}

        <div className="profile-info">
          <div
            className="icon-notification"
            onClick={() => {
              setNotificationVisulized(true);
              setNotificationsOpen(!notificationsOpen);
            }}
          >
            <BellIcon />
            {!notificationVisulized && (
              <div className="count-notifications">2</div>
            )}
          </div>
          <div className="profile uk-margin-large-left">
            <div className="profile-img">
              <img
                     src={process.env.NEXT_PUBLIC_API + `/assets/logo-${process.env.client}.png`}
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
                      signOut()
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
