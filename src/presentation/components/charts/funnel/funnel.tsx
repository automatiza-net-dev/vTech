import { useEffect } from "react";

import { DashboardChart } from "@/domain";

export function Funnel(props: DashboardChart) {
  useEffect(() => {
    if ((process as any).browser) {
      (window as any)?.anychart?.onDocumentReady(function () {
        const chart = (window as any).anychart.pyramid([
          { name: "Fantasy", value: 1000 },
          { name: "Textbooks", value: 800 },
          { name: "Classics", value: 300 },
          { name: "Detective", value: 200 },
          { name: "Science Fiction", value: 41 },
        ]);

        chart.reversed(true);

        chart.container(props.name);
        chart.draw();
      });
    }
  }, []);

  return (
    <div>
      <div
        id={props.name}
        className="chart_container"
        style={{ height: "370px", width: "100%" }}
      ></div>
    </div>
  );
}
