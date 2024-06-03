import LiftOneIndicators from "./LiftOneIndicator";
import SanclaIndicators from "./SanclaIndicators";

function Indicators() {

  const systemName = process.env.clientName;

  return (
    <>
      {systemName === "Sanclá" && <SanclaIndicators />}
      {systemName === "LiftOne" && <LiftOneIndicators />}
    </>
  );
};

export default Indicators;
