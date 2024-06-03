import styled from "styled-components";

export const Chart = styled("div")<{ $hasLegend: boolean }>`
  width: 100%;

  > div {
    width: 100%;
    display: ${(props) => (props.$hasLegend ? "block" : "flex")};
    align-items: center;
    justify-content: center;
    height: 100%;

    .chart_container {
      width: 100%;
      aspect-ratio: ${(props) => (props.$hasLegend ? 1.6 : 1)};
    }
  }
`;
