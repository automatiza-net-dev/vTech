import React, { memo, useCallback, useState } from "react";
import { useRouter } from "next/router";

import { financesService } from "@/OLD/services/finances.service";

import { useAuth } from "@/OLD/hooks/useAuth";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { api, Button, Popconfirm, useToast } from "infinity-forge";
import { Modal } from "antd";
import DownTitles from "../DownTitles";

import { accessControlTitles } from "@/OLD/utils/generalUtils";

function ButtonsPanel({ setReload, type, setFilters }) {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [downTitlesVisible, setDownTitlesVisible] = useState(false);

  const { titles, setTitles } = useAuth();
  const { createToast } = useToast();

  const downTitlesPermission = useUserHasPermission(
    `${accessControlTitles(type)}04`
  );

  const removeAceite = useUserHasPermission(
    `${accessControlTitles(type)}11`
  );


  const permissionToDelete = useUserHasPermission(
    `${accessControlTitles(type)}03`
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
        createToast({
          message: "Aceite realizado com sucesso!",
          status: "success",
        });
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
        return createToast({
          message: "Items adicionados com sucesso ao borderô",
          status: "success",
        });
      })
      .catch((err) => {
        setReload((prv) => !prv);
        return createToast({ message: "Erro", status: "error" });
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
            text={!loading ? "Aceite" : "Enviando..."}
          />
        )}

  {(removeAceite) && (
          <Popconfirm
            idTooltip="delete"
            cancelText="cancelar"
            okText="confirmar"
            position="top-right"
            title="Confirma a retirada do aceite?"
            onConfirm={async () => {
              setLoading(true);

              await api({
                url: "finances/not-accept-many",
                method: "post",
                body: {
                  type: (type === "receive" || type === "CREDITO") ? "Credito" : "Debito",
                  ids: titles.map((finance) => finance?.id),
                },
              });

              setReload((prv) => !prv);

              createToast({
                message: "Items retirados com sucessso",
                status: "success",
              });

              setLoading(false);
            }}
          >
            <Button text={!loading ? "Retirar aceite" : "Enviando..."} />
          </Popconfirm>
        )}

        <Button
          onClick={() => submitItemsBordero()}
          text="Adicionar itens borderô"
        />

        {permissionToDelete && (
          <Popconfirm
            idTooltip="delete"
            cancelText="cancelar"
            okText="confirmar"
            position="top-right"
            title="Confirma a exclusão dos registros?"
            onConfirm={async () => {
              await api({
                url: "finances/delete-multiple",
                method: "put",
                body: {
                  idList: titles.map((finance) => finance?.id),
                },
              });

              setReload((prv) => !prv);
              createToast({
                message: "Items deletados com sucessso",
                status: "success",
              });
            }}
          >
            <Button
              type="button"
              text="Excluir"
            />
          </Popconfirm>
        )}
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
}

export default ButtonsPanel;
