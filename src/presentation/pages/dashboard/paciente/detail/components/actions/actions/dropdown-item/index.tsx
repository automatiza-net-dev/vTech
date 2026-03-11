import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { TimeLine } from "@/domain";
import { Modal } from "infinity-forge";

import * as S from "./styles";

export type DropdownComponentProps = {
  modal?: boolean;
  setModal?: Dispatch<SetStateAction<boolean>>;
  value?: string;
  reloadSchedule?: any;
  onSuccess?: () => void;
} & Partial<TimeLine>;

export type DropdownItemActionProps = {
  Icon: any;
  label: string;
  customModalStyles?: {};
  Component?: (props: DropdownComponentProps) => any;
  value?: string;
  reloadSchedule?: any;
  defaultValue?: boolean;
  onSuccess?: () => void;
};

export function DropdownItemAction({
  Icon,
  label,
  Component,
  value,
  reloadSchedule,
  defaultValue = false,
  onSuccess,
}: DropdownItemActionProps) {
  const [open, setOpen] = useState(defaultValue);

  // useEffect(() => {
  //   if (open) {
  //     return;
  //   }
  //
  //   setOpen(defaultValue);
  // }, []);

  return (
    <>
      <Modal
        styles={{
          maxWidth: "1200px",
          padding: "10px",
          width: "100%",
        }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <S.ModalContent>
          {Component && (
            <Component
              modal={open}
              setModal={setOpen}
              value={value}
              reloadSchedule={reloadSchedule}
              onSuccess={onSuccess}
            />
          )}
        </S.ModalContent>
      </Modal>

      <button type="button" onClick={() => setOpen(true)}>
        {Icon && Icon}

        {label && <span>{label}</span>}
      </button>
    </>
  );
}
