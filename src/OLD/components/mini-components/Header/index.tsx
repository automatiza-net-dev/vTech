// @ts-nocheck
import { useCallback, useState, useEffect } from "react";

import { profileService } from "@/OLD/services/External/profileService";

import {
  Badge,
  Button,
  Dropdown,
  Layout,
  Menu,
  Modal,
  Radio,
  notification,
} from "antd";
import Link from "next/link";
import { Container } from "./styles";
const { Group } = Radio;

import { unitsService } from "@/OLD/services/units.service";

import { ArrowProfile, BellIcon } from "@/OLD/common/icons";
import { useAvailableChangeUnits } from "@/OLD/hooks/useBusinessUnits";
import { useProfile } from "@/OLD/hooks/useProfile";
import { useRouter } from "next/router";
import { sessionService } from "@/OLD/services/session.service";
import { userService } from "@/OLD/services/user.service";

import { sortItems } from "@/OLD/utils/sortItems";
import { useIsThirdPartyUser } from "@/presentation";
import { useAuthAdmin } from "infinity-forge";

const Header = ({ origin = "dashboard" }) => {
  const [chooseClinicVisible, setChooseClinicVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [reload, setReload] = useState(false);

  const { units } = useAvailableChangeUnits(chooseClinicVisible);
  const { isThirdParty } = useIsThirdPartyUser();

  const { user, clinic } = useProfile(false, reload);
  const router = useRouter();

  const {signOut} = useAuthAdmin()

  sortItems(units, "identification");

  const submitSwapUnit = useCallback(
    () =>
      unitsService.swapUnit({ unitId: selectedUnit }).then((_res) => {
        setChooseClinicVisible(false);
        setReload((prv) => !prv);
        router.push("/dashboard");
        router.reload();
        return notification.success({ message: "Unidade alterada" });
      }),
    [selectedUnit]
  );

  const startChangePassword = () => {
    userService.startChangePassword().then(() =>
      notification.success({
        message:
          "Solicitação encaminhada com sucesso!, em instantes você receberá um e-mail com instruções",
      })
    );
  };

  const detectMessage = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return "Bom dia";
    }
    if (hours >= 12 && hours < 18) {
      return "Boa tarde";
    }
    if (hours >= 18) {
      return "Boa noite";
    }
  };

  useEffect(() => {
    router.pathname === "/dashboard" &&
      profileService.checkProfile().then((res) => {
        if (res.data?.unit === null) {
          setChooseClinicVisible(true);
        }
      });
  }, []);

  return (
    <Container>
      <Layout.Header style={{ padding: 0 }}>
        <div className="uk-flex uk-flex-middle uk-flex-between uk-width-1-1">
          <div className="uk-flex uk-flex-middle">
            <Link href="/dashboard">
              <div className="logo-container">
                <img
                  src={process.env.NEXT_PUBLIC_API + `/assets/logo-${process.env.client}.png`}
                  width="35px"
                />
              </div>
            </Link>
            {/*
            <Input>
              <SearchIcon />
              <input
                type="search"
                placeholder="Pesquise pacientes, tutores, dados e etc."
              />
            </Input>
            */}
          </div>
          <div className="uk-margin-small-top uk-flex uk-flex-middle uk-flex-left uk-width-2-3">
            {!!user && (
              <h2>
                {detectMessage()}
                &nbsp;
                {user?.name && user?.name.includes(" ")
                  ? user.name.split(" ")[0]
                  : user.name}
                .
              </h2>
            )}
            {/*
            &nbsp;
            <h6 className="uk-margin-remove">
              {moment(new Date()).format("DD MMM YYYY")}
            </h6>
            &nbsp;
            <h6 className="uk-margin-remove">
              {moment(new Date()).locale("en").format("LT")}
            </h6>
            */}
          </div>
          <div className="uk-flex uk-flex-middle">
            {origin === "dashboard" && (
              <>
                <div className="uk-margin-right">
                  <h5 className="uk-margin-remove">{clinic?.identification}</h5>
                </div>
                <Badge>
                  <Button
                    className="uk-flex uk-flex-middle uk-flex-center"
                    type="default"
                    size="large"
                    shape="circle"
                    icon={<BellIcon />}
                  />
                </Badge>{" "}
              </>
            )}

            <Dropdown
              placement="bottomRight"
              overlay={
                <Menu>
                  <Menu.Item
                    onClick={() => {
                      router.push("/dashboard/perfil");
                    }}
                  >
                    Perfil
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item onClick={() => startChangePassword()}>
                    Alterar senha
                  </Menu.Item>
                  <Menu.Divider />

                  <Menu.Item onClick={() => setChooseClinicVisible(true)}>
                    Trocar unidade
                  </Menu.Item>
                  <Menu.Divider />

                  {user && user?.type === "controller" && (
                    <>
                      <Menu.Item onClick={() => router.push("/admin")}>
                        Painel franqueador
                      </Menu.Item>

                      <Menu.Divider />
                    </>
                  )}

                  <Menu.Item
                    onClick={() => {
                      if (!isThirdParty) {
                        signOut()
                        router.push("/");
                      } else {
                        window.location.href =
                          "https://portal.liftonefranquias.com.br";
                      }
                    }}
                  >
                    {!isThirdParty ? "Deslogar" : "Fechar"}
                  </Menu.Item>
                </Menu>
              }
            >
              <div className="profile uk-margin-medium-left uk-flex uk-flex-middle uk-flex-between uk-margin-right pointer">
                <div className="profile-img uk-flex uk-flex-center uk-flex-middle">
                  <img
                    src={process.env.NEXT_PUBLIC_API + `/assets/logo-${process.env.client}.png`}
                    width="27px"
                    height="27px"
                  />
                </div>
                {!!user && (
                  <div className="profile-text">
                    {user?.name && user?.name.includes(" ")
                      ? user.name.split(" ")[0]
                      : user.name}
                  </div>
                )}
                <ArrowProfile />
              </div>
            </Dropdown>
          </div>
        </div>
      </Layout.Header>
      <Modal
        title="Trocar unidade"
        visible={chooseClinicVisible}
        footer={null}
        onCancel={() => setChooseClinicVisible(false)}
      >
        <Group>
          {units?.length > 0 &&
            units.map((unit) => (
              <Radio
                className="uk-width-1-1"
                value={unit?.id}
                onChange={(e) => setSelectedUnit(e.target.value)}
              >
                {unit?.identification} ({unit?.group})
              </Radio>
            ))}
        </Group>
        <hr />
        <footer className="uk-flex uk-flex-right">
          <Button
            type="primary"
            className="uk-margin-small-right"
            onClick={() => submitSwapUnit()}
          >
            Trocar
          </Button>
          <Button onClick={() => setChooseClinicVisible(false)}>
            Cancelar
          </Button>
        </footer>
      </Modal>
    </Container>
  );
};

export default Header;
