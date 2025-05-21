import { Dispatch, SetStateAction, useState } from "react";

import { TimeLine } from "@/domain";
import { Modal } from "infinity-forge";

import * as S from "./styles";

export type DropdownComponentProps = {
  modal?: boolean;
  setModal?: Dispatch<SetStateAction<boolean>>;
  value?: string;
  reloadSchedule?: any;
} & Partial<TimeLine>;

export type DropdownItemActionProps = {
  Icon: any;
  label: string;
  customModalStyles?: {};
  Component?: (props: DropdownComponentProps) => any;
  value?: string;
  reloadSchedule?: any;
};

export function DropdownItemAction({
  Icon,
  label,
  Component,
  value,
  reloadSchedule,
}: DropdownItemActionProps) {
  const [open, setOpen] = useState(false);

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
