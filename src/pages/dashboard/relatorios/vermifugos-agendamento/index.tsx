import { LayoutDashboard, VaccinesVermifugeReport } from "@/presentation";

export default function VermifugesPage() {
  return (
    <LayoutDashboard>
      <VaccinesVermifugeReport type="vermifuge" permission={'REL14'} />
    </LayoutDashboard>
  );
}
