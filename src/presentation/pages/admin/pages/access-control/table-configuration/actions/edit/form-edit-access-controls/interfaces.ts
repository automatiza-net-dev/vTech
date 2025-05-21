import { ControllerRole } from "@/domain";

export interface IFormEditAccessControlsProps {
    modal: boolean;
    controllerRole: Partial<ControllerRole>;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
}