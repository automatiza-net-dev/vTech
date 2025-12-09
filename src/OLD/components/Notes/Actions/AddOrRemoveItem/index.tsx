import { useEffect, useState } from "react";

import { receiptService } from "@/OLD/services/receipt.service";

import { useReceipt } from "@/OLD/hooks/useReceipts";

import FormChild from "@/OLD/components/Notes/FormChild";

import moment from "moment";

import { GrAddCircle } from "react-icons/gr";
import { Modal, useToast } from "infinity-forge";

export default function AddOrRemoveItem({ id, setReload, reload }) {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({});
  const [ids, setIds] = useState<any>({ ids: [] });

  const { receipt, refetch } = useReceipt(ids, reload);
  useEffect(() => {
    refetch();
  }, []);

  const { createToast } = useToast();

  const addReceiptItemSubmit = (data, setState) => {
    receiptService
      .addReceiptItem(data)
      .then((res) => {
        setReload((prv) => !prv);
        return createToast({
          status: "success",
          message: "Item adicionado com sucesso",
        });
      })
      .catch((err) => {
        return createToast({
          status: "error",
          message: "Houve um erro ao adicionar o item",
        });
      });
    setState([]);
  };

  const removeReceiptItemSubmit = (id) => {
    receiptService
      .removeReceiptItem({ itemId: id })
      .then((_res) => {
        setReload((prv) => !prv);

        return createToast({
          status: "success",
          message: "Item removido com sucesso",
        });
      })
      .catch((err) => {
        return createToast({
          status: "success",
          message: "Houve um erro ao remover o item",
        });
      })
      .finally(() => {
        refetch();
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

      <Modal
        open={visible}
        onClose={() => setVisible(false)}
        styles={{ maxWidth: "1000px" }}
      >
        <h3 className="font-14-regular">
          <span>
            <strong>Entrada código: {receipt[0]?.tag}</strong>
          </span>
        </h3>

        <FormChild
          data={data}
          setData={setData}
          setVisible={setVisible}
          type="update"
          addItemSubmit={addReceiptItemSubmit}
          removeItemSubmit={removeReceiptItemSubmit}
        />
      </Modal>
    </>
  );
}
