import CreateService from "@/OLD/components/Services/Create";
import { LayoutDashboard } from "@/presentation";

export default function CreateServicePage() {
  return (
    <LayoutDashboard>
      <CreateService setVisible={undefined} />
    </LayoutDashboard>
  );
}
