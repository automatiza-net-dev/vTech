import { useState } from "react";
import { useRouter } from "next/router";

import { Modal, Button } from "infinity-forge";

import { useConfigurationsSystem, useVerifyPermissions } from "@/presentation";

import { CreateTutorForm } from "./components/form";
import { ICreateTutorFormProps } from "./components/form/interfaces";

export function FormCreateTutor({
  addPet,
  tutorId,
  origin,
  isModal = false,
  trigger,
  onSuccess,
}: {
  trigger?: any;
  isModal: boolean;
} & ICreateTutorFormProps) {
  const [open, setOpen] = useState(false);

  const canCreate = useVerifyPermissions("TUT01");

  const router = useRouter();
  const isCRM = router.asPath.includes("crm");

  const {type} = useConfigurationsSystem()

  if (!canCreate) {
    return <></>;
  }

  if (isModal) {
    return (
      <div style={{ width: "100%" }}>
        <Modal
          styles={{ maxWidth: "1450px", width: "calc(100% - 30px)" }}
          open={open}
          onClose={() => setOpen(false)}
        >
          <CreateTutorForm
            setOpen={setOpen}
            tutorId={tutorId}
            onSuccess={onSuccess}
            origin={isCRM ? "Crm" : origin}
            addPet={addPet}
          />
        </Modal>

        {trigger ? (
          <button
            style={{
              background: "transparent",
              padding: "0",
              border: 0,
              width: "100%",
            }}
            type="button"
            onClick={() => setOpen(true)}
          >
            {trigger}
          </button>
        ) : (
          <Button
            text={
              type === "Vet" ? "Novo Tutor" : "Novo Cliente"
            }
            type="button"
            onClick={() => setOpen(true)}
          />
        )}
      </div>
    );
  }

  return (
    <CreateTutorForm tutorId={tutorId} onSuccess={onSuccess} origin={origin} addPet={addPet} />
  );
}
