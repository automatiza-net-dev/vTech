import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from '@mui/icons-material/Dashboard';
import BallotIcon from '@mui/icons-material/Ballot';

import { IMenuItem } from "./interfaces";

export const menu: IMenuItem[] = [
  {
    icon: <DashboardIcon />,
    text: "Dashboard",
    url: "/admin",
  },
  {
    icon: <PersonIcon />,
    text: "Colaboradores",
    url: "/admin/colaboradores",
  },
  {
    icon: <BallotIcon />,
    text: "Controles de acesso",
    url: "/admin/controles-de-acesso",
  },
];
