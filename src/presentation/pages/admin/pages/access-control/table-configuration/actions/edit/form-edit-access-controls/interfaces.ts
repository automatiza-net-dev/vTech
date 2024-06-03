import { ControllerRole } from "@/domain";

export interface IFormEditAccessControlsProps {
    modal: boolean;
    controllerRole: ControllerRole;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
}