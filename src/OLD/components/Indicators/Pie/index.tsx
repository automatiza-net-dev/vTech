// @ts-nocheck
import { ResponsivePie } from "@nivo/pie";

import { currencyFormatter } from "@/OLD/components/Budget";

const MyResponsivePie = ({
  data,
  direction = "column",
  translateY,
  translateX,
  marginLeft,
  valueFormat
}) => (
  <ResponsivePie
    data={data}
    margin={{ top: 30, right: 0, bottom: 80, left: marginLeft }}
    innerRadius={0.3}
    padAngle={5}
    cornerRadius={3}
    activeOuterRadiusOffset={8}
    borderWidth={1}
    animate={false}
    colors={{ scheme: "set3" }}
    borderColor={{
      from: "color",
      modifiers: [["darker", 0.2]]
    }}
    arcLinkLabelsSkipAngle={10}
    enableArcLinkLabels={false}
    arcLinkLabel={(d) => `${d.data.arcLinkLabel}`}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: "color" }}
    arcLabelsSkipAngle={10}
    arcLinkLabelsOffset={0}
    valueFormat={valueFormat}
    arcLabelsTextColor={{
      from: "color",
      modifiers: [["darker", 2]]
    }}
    defs={[
      {
        id: "dots",
        type: "patternDots",
        background: "inherit",
        color: "rgba(255, 255, 255, 0.3)",
        size: 4,
        padding: 1,
        stagger: true
      },
      {
        id: "lines",
        type: "patternLines",
        background: "inherit",
        color: "rgba(255, 255, 255, 0.3)",
        rotation: -45,
        lineWidth: 6,
        spacing: 10
      }
    ]}
    legends={[
      {
        anchor: "right",
        direction,
        justify: false,
        translateX,
        translateY,
        itemsSpacing: 1,
        itemWidth: 50,
        itemHeight: 18,
        itemTextColor: "#999",
        itemDirection: "left-to-right",
        itemOpacity: 1,
        symbolSize: 18,
        symbolShape: "circle",
        effects: [
          {
            on: "hover",
            style: {
              itemTextColor: "#000"
            }
          }
        ]
      }
    ]}
  />
);

export default MyResponsivePie;
