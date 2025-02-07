// @ts-nocheck
import React, { memo, useCallback, useState } from "react";
import { useRouter } from "next/router";

import { financesService } from "@/OLD/services/finances.service";

import { useAuth } from "@/OLD/hooks/useAuth";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Button } from "infinity-forge";
import { notification, Modal } from "antd";

import { accessControlTitles } from "@/OLD/utils/generalUtils";
import DownTitles from "../../Titles/DownTitles";

function ButtonsPanel({
  setReload,
  type,
  setFilters,
}: any) {
  const [loading, setLoading] = useState(false);
  const [showBaixaModal, setShowBaixaModal] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const { titles, setTitles } = useAuth();

  const downTitlesPermission = useUserHasPermission(
    `${accessControlTitles(type)}04`
  );

  const checkTitlePermission = useUserHasPermission(
    `${accessControlTitles(type)}06`
  );

  const addItemsBorderoPermission = useUserHasPermission(
    `${accessControlTitles(type)}07`
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
      .then((res) => {
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
            order: "expiration_date",
            status: "ABERTO",
            noSearch: true,
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
      <Modal
        visible={modalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
      >
        <p>Deseja realizar a conferência?</p>
      </Modal>

      <Modal
        title="Baixa de títulos"
        visible={showBaixaModal}
        width={1200}
        onCancel={() => setShowBaixaModal(false)}
        footer={null}
      >
        <DownTitles setVisible={setShowBaixaModal} setReload={setReload} />
      </Modal>

      <section className="uk-flex uk-flex-around uk-margin-bottom">
        {downTitlesPermission && (
          <Button
            onClick={() => {
              filterTitles();
              setShowBaixaModal(true);
            }}
            text="Baixar"
          />
        )}
        {checkTitlePermission && (
          <Button
            onClick={handleButtonClick}
            text={!loading ? "Aceite / Conferência" : "Enviando..."}
          />
        )}
        {addItemsBorderoPermission && (
          <Button
            onClick={() => submitItemsBordero()}
            text="Adicionar itens ao borderô"
          />
        )}
      </section>
      <hr />
    </div>
  );
}

export default ButtonsPanel;
