// @ts-nocheck
import { memo } from "react";

import Gain from "./Gain";
import Loss from "./Loss";
import ChangeStatus from "./ChangeStatus";
import ChangeTechnician from "./ChangeTechnician";

const FormControll = memo(function FormControll({
  formData,
  setFormData,
  setReload
}) {
  return (
    <>
      {formData?.form === "gain" && (
        <Gain
          visible={formData?.form === "gain"}
          close={() => setFormData(false)}
          setReload={setReload}
          formData={formData}
        />
      )}
      {formData?.form === "loss" && (
        <Loss
          visible={formData?.form === "loss"}
          close={() => setFormData(false)}
          setReload={setReload}
          formData={formData}
        />
      )}
      {formData?.form === "changeStatus" && (
        <ChangeStatus
          visible={formData?.form === "changeStatus"}
          close={() => setFormData(false)}
          setReload={setReload}
          formData={formData}
        />
      )}
      {formData?.form === "changeTechnician" && (
        <ChangeTechnician
          visible={formData?.form === "changeTechnician"}
          close={() => setFormData(false)}
          setReload={setReload}
          formData={formData}
        />
      )}
    </>
  );
});

export default FormControll;
