import CreateExam from "@/OLD/components/Exams/Create";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function CreateExamPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <CreateExam />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
