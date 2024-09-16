// @ts-nocheck
import React, { memo, useCallback, useState } from "react";
import { useRouter } from "next/router";

import { financesService } from "@/OLD/services/finances.service";

import { useAuth } from "@/OLD/hooks/useAuth";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Button } from "infinity-forge";
import { notification, Modal } from "antd";
import DownTitles from "../DownTitles";

import { accessControlTitles } from "@/OLD/utils/generalUtils";

const ButtonsPanel = memo(function ButtonsPanel({
  setReload,
  type,
  setFilters,
}) {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [downTitlesVisible, setDownTitlesVisible] = useState(false);

  const { titles, setTitles } = useAuth();

  const downTitlesPermission = useUserHasPermission(
    `${accessControlTitles(type)}04`
  );

  const checkTitlePermission = useUserHasPermission(
    `${accessControlTitles(type)}06`
  );

  const handleButtonClick = () => {
    setModalVisible(true);
    setButtonClicked(true);
  };

  const handleConfirm = () => {
    setModalVisible(false);
    !loading && acceptManyFinances();
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const router = useRouter();

  const filterTitles = () => {
    setTitles(titles.filter((title) => title?.status !== "BAIXADO"));
  };

  const acceptManyFinances = useCallback(() => {
    setLoading(true);
    financesService
      .acceptManyFinances(titles.map((finance) => finance?.id))
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        notification.success({ message: "Aceite realizado com sucesso!" });
      })
      .catch((_err) => setLoading(false));
  }, [titles]);

  const submitItemsBordero = useCallback(() => {
    setLoading(true);

    financesService
      ?.createBorderoItems({
        type: type === "payment" ? "Debito" : "Credito",
        financeIds: titles?.map((title) => title?.id),
      })
      .then((_res) => {
        setLoading(false);
        setFilters(
          ({
            fromIssue,
            toIssue,
            fromExpiration,
            toExpiration,
            fromPayment,
            toPayment,
          }) => ({
            fromIssue,
            toIssue,
            fromExpiration,
            toExpiration,
            fromPayment,
            toPayment,
          })
        );
        setReload((prv) => !prv);
        return notification.success({
          message: "Items adicionados com sucesso ao borderô",
        });
      })
      .catch((err) => {
        setReload((prv) => !prv);
        return notification.error({ message: "Erro" });
      });
  }, [titles]);

  return (
    <div>
      <section className="uk-flex uk-flex-around uk-margin-bottom">
        {downTitlesPermission && (
          <Button
            text="Baixar"
            onClick={() => {
              filterTitles();
              setDownTitlesVisible(true);
              {
                /*
              router.push("/dashboard/titulos/baixa");
            */
              }
            }}
          />
        )}
        {checkTitlePermission && (
          <Button
            onClick={handleButtonClick}
            text={!loading ? "Aceite / Conferência" : "Enviando..."}
          />
        )}
        <Button
          onClick={() => submitItemsBordero()}
          text="Adicionar itens borderô"
        />
      </section>
      <hr />
      <Modal
        visible={modalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
      >
        <p>Deseja realizar a conferência?</p>
      </Modal>
      <Modal
        title="Baixa de títulos"
        visible={downTitlesVisible}
        width={1200}
        onCancel={() => setDownTitlesVisible(false)}
        footer={null}
      >
        <DownTitles setVisible={setDownTitlesVisible} setReload={setReload} />
      </Modal>
    </div>
  );
});

export default ButtonsPanel;
