import { PdfPatientAttendance, PrintHeader } from "@/presentation";
import { fromBase64ToString, PrivatePage } from "infinity-forge";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

export default function Impressao() {
  return (
    <PrivatePage signInRole="user" roles={["user", "controller", "system"]}>
      <Page />
    </PrivatePage>
  );
}

function Page() {
  const componentRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const [timelineInfo, setTimelineInfo] = useState(null);

  useEffect(() => {
    if (router.isReady && router.query.timeline_info) {
      try {
        const parsed = fromBase64ToString(
          router.query.timeline_info as string
        ) as any;
        setTimelineInfo(parsed);
      } catch (err) {
        console.error("Erro ao decodificar timeline_info", err);
      }
    }
  }, [router.isReady, router.query.timeline_info]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onAfterPrint: async () => {
      setTimeout(() => {
        window.close();
      }, 500);
    },
  });

  useEffect(() => {
    if (timelineInfo) {
handlePrint()
    }
  }, [timelineInfo]);

  return (
    <div style={{ display: "none" }}>
      <div ref={componentRef} style={{ padding: "0 20px" }}>
        <div className="uk-text-center uk-margin-top">
          <PrintHeader />
        </div>

        <PdfPatientAttendance {...(timelineInfo as any)} />
      </div>
    </div>
  );
}
