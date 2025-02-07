// @ts-nocheck
import { useState } from "react";
import { useRouter } from "next/router";

import { Modal } from "infinity-forge";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import TreatmentsMaintenance from "@/OLD/components/Treatments/Maintenance";

import { IoIosTimer } from "react-icons/io";
import { GrHostMaintenance } from "react-icons/gr";

import { Container } from "./styles";

function Actions({ treatment }) {
  const [treatmentsMaintenanceOpen, setTreatmentsMaintenanceOpen] =
    useState(false);
  const [treatmentId, setTreatmentId] = useState("");

  const router = useRouter();

  const dayExecutionsPermission = useUserHasPermission("TRA02");

  return (
    <Container className="uk-flex uk-flex-around">
        <GrHostMaintenance
          className="custom-icon"
          size={15}
          onClick={() => {
            setTreatmentId(treatment?.id);
            setTreatmentsMaintenanceOpen(true);
          }}
        />
      {dayExecutionsPermission && (
          <IoIosTimer
            className="custom-icon"
            size={20}
            onClick={() =>
              router.push(
                `/dashboard/tratamentos/execucoes-dia/${treatment?.id}`
              )
            }
          />
      )}
      <Modal
        styles={{ width: '1200px', padding: '10px' }}
        open={treatmentsMaintenanceOpen}
        onClose={() => {
          setTreatmentsMaintenanceOpen(false);
        }}
        children={
          <TreatmentsMaintenance
            treatmentId={treatmentId}
            close={() => setTreatmentsMaintenanceOpen(false)}
          />
        }
      />
    </Container>
  );
}

export default Actions;
