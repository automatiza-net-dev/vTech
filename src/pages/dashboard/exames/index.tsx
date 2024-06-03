import Exams from "@/OLD/components/Exams";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function ExamsPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <Exams />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
