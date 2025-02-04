import { WorkSpace } from "infinity-forge";

export interface ILayout {
  workspaces?: WorkSpace
  children: React.ReactNode
  logo?: { src?: string; href?: string }
}
