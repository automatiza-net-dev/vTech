// @ts-nocheck
import { memo, useCallback, useEffect, useState } from "react";

import { receiptService } from "@/OLD/services/receipt.service";

import { useReceipt } from "@/OLD/hooks/useReceipts";

import { Modal } from "antd";
import FormChild from "@/OLD/components/Notes/FormChild";

import moment from "moment";

import { GrAddCircle } from "react-icons/gr";
import { useToast } from "infinity-forge";

const AddOrRemoveItem = memo(function AddOrRemoveItem({
  id,
  setReload,
  reload,
}) {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({});
  const [ids, setIds] = useState({ ids: [] });

  const { receipt } = useReceipt(ids, reload);

  const {createToast} = useToast()

  const addReceiptItemSubmit = (data, setState) => {
    receiptService
      .addReceiptItem(data)
      .then((res) => {
        setReload((prv) => !prv);
        return  createToast({ status: "success",  message:"Item adicionado com sucesso" })
      })
      .catch((err) => {
        return createToast({ status: "error",  message:"Houve um erro ao adicionar o item" })
      });
    setState([]);
  };

  const removeReceiptItemSubmit = (id) => {
    receiptService
      .removeReceiptItem({ itemId: id })
      .then((_res) => {
        setReload((prv) => !prv);
       
       return createToast({ status: "success",  message:"Item removido com sucesso" })
      })
      .catch((err) => {
        return createToast({ status: "success",  message:"Houve um erro ao remover o item" })
      });
  };

  useEffect(() => {
    if (id) {
      const idToSearch = [id];
      visible && setIds({ ids: idToSearch });
    }
  }, [id, visible]);

  useEffect(() => {
    receipt?.length > 0 &&
      setData({
        items: receipt[0]?.items?.map((item) => ({
          receiptId: receipt[0]?.id,
          productVariationId: item?.productVariation?.id,
          quantity: item?.quantity,
          costValue: item?.cost_value,
          unitaryValue: item?.unitary_value,
          discountValue: item?.discount_value,
          itemId: item?.id,
        })),
        receiptId: receipt[0]?.id,
        supName: receipt[0]?.supplier?.name,
        receiptDate: receipt[0]?.receipt_date
          ? moment(receipt[0]?.receipt_date)
          : null,
      });
  }, [receipt, visible]);

  return (
    <>
        <GrAddCircle
          style={{ cursor: "pointer" }}
          onClick={() => setVisible(true)}
        />
  
      {visible && (
        <Modal
          visible={visible}
          title={
            <span>
              Adicionar itens&nbsp;&nbsp;Entrada código: {receipt[0]?.tag}
              &nbsp;&nbsp;Fornecedor: {receipt[0]?.supplier?.name}
            </span>
          }
          footer={null}
          width={1000}
          onCancel={() => setVisible(false)}
        >
          <FormChild
            data={data}
            setData={setData}
            setVisible={setVisible}
            type="update"
            addItemSubmit={addReceiptItemSubmit}
            removeItemSubmit={removeReceiptItemSubmit}
          />
        </Modal>
      )}
    </>
  );
});

export default AddOrRemoveItem;
