// @ts-nocheck
import { ResponsiveFunnel } from "@nivo/funnel";

const MyResponsiveFunnel = ({ data, color, valueFormat }) => {
  return (
    <div className="uk-flex">
      <div
        className="uk-flex uk-flex-around uk-flex-column"
        style={{ marginTop: 15, marginBottom: 15, lineHeight: "0.9" }}
      >
        {data?.map((item, i) => (
          <div style={{ height: "20px" }} key={i}>
            {item?.label || "Não informado"}
          </div>
        ))}
      </div>
      <div style={{ width: "300px", height: "300px" }}>
        <ResponsiveFunnel
          data={data}
          valueFormat={valueFormat}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          colors={{ scheme: `${color}` }}
          borderWidth={20}
          labelColor={{
            from: "color",
            modifiers: [["darker", 3]]
          }}
          beforeSeparatorLength={100}
          beforeSeparatorOffset={20}
          afterSeparatorLength={100}
          afterSeparatorOffset={20}
          currentPartSizeExtension={10}
          currentBorderWidth={40}
          animate={false}
          motionConfig="wobbly"
        />
      </div>
    </div>
  );
};

export default MyResponsiveFunnel;
