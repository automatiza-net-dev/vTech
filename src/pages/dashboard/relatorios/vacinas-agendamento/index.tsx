import { LayoutDashboard, VaccinesVermifugeReport } from "@/presentation";

export default function VaccinesPage() {
  return (
    <LayoutDashboard>
      <VaccinesVermifugeReport type="vaccine" permission={'REL13'} />
    </LayoutDashboard>
  );
}
