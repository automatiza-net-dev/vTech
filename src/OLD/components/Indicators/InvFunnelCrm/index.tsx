// @ts-nocheck
import { Container } from "./styles";

function InvFunnelCrm({ data }) {
  return (
    <Container>
      <div className="funnel-bg">
        {data?.length > 0 &&
          data?.map((item, i) => (
            <div key={i} className="uk-flex uk-width-1-1">
              <div className={`custom-margin-label-${i}`}>{item?.label}</div>
              <div className={`custom-margin-value-${i}`}>{item?.value}</div>
              <div className={`custom-margin-percentage-${i}`}>
                {item?.conversionPercentage}
              </div>
            </div>
          ))}
      </div>
    </Container>
  );
}

export default InvFunnelCrm;
