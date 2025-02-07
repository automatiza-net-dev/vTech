// @ts-nocheck
import { memo, useState, useCallback, useEffect } from "react";

import {  Popconfirm, Modal, notification } from "antd";
import DownFormChild from "../FormChild";
import { financesService } from "@/OLD/services/finances.service";

import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { IoMdDownload } from "react-icons/io";

import moment from "moment";

function GroupActions({ group, setReload }: any) {
  const [downData, setDownData] = useState({});
  const [downVisible, setDownVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const downGroupTitles = useCallback(() => {
    setLoading(true);

    financesService
      .groupedDown({
        idList: [],
        tef: downData?.tef,
        paymentMethodId: downData?.paymentMethodId,
        tefFlagId: downData?.tefFlagId,
        tefAcquirerId: downData?.tefAcquirerId,
        paymentDate: moment(downData?.paymentDate).format("YYYY-MM-DD"),
        type: downData?.type,
        expirationDate: moment(downData?.expirationDate).format("YYYY-MM-DD"),
        checkingAccountId: downData?.checkingAccountId,
      })
      .then((_res) => {
        setDownVisible(false);
        setReload((prv) => !prv);
        return notification.success({ message: "Grupo baixado com sucesso!" });
      })
      .catch((err) => {
        const errMessage = err?.response?.data?.errors;
        if (errMessage) {
          return notification.error({
            message: errMessage[0].message,
          });
        }
      });
  }, [downData]);

  useEffect(() => {
    setDownData({
      tef: group?.pm_tef,
      paymentMethodDescription: group?.payment_method,
      flagDescription: group?.tef_flag,
      paymentMethodId: group?.payment_method_id,
      tefFlagId: group?.tef_flag_id,
      acquirerDescription: group?.tef_adquirente,
      tefAcquirerId: group?.tef_adquirente_id,
      paymentDate: moment(),
      type: group?.type,
      expirationDate: moment(group?.expiration_date),
      checkingAccountId: group?.payment_methods_checking_account_id,
    });
  }, [group]);

  return (
    <div className="uk-flex uk-flex-around">
      {!group?.payment_date && (
          <Popconfirm
            title="Baixa grupo de pagamento"
            onConfirm={() =>
              !group?.payment_methods_checking_account_id
                ? setDownVisible(true)
                : downGroupTitles()
            }
          >
            <IoMdDownload style={{ cursor: "pointer" }} />
          </Popconfirm>
      )}
      {downVisible && (
        <Modal
          title="Baixa grupo de pagamento"
          visible={downVisible}
          footer={null}
          onCancel={() => setDownVisible(false)}
        >
          <DownFormChild
            data={downData}
            setData={setDownData}
            visible={downVisible}
            setVisible={setDownVisible}
            submit={downGroupTitles}
          />
        </Modal>
      )}
    </div>
  );
}

export default GroupActions;
