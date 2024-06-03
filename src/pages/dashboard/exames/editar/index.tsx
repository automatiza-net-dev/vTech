import EditExam from "@/OLD/components/Exams/Edit";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function EditExamPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <EditExam />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
