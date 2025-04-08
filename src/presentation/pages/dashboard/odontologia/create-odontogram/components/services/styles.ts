import styled from "styled-components";

export const Services = styled("div")`
  min-width: 250px;
  display: flex;
  flex-direction: column;
  padding: 5px;
  background: "#fff";
  border-radius: 5px;
  border: 1px solid rgba(31, 31, 31, 0.22);
  padding: 10px;
  max-width: 250px;

  .services-list {
    overflow: auto;
    max-height: 450px;
    padding: 0 5px;

    button {
      width: 100%;
      margin-bottom: 15px;
    }
  }

  @media only screen and (max-width: 1400px) {
    min-width: 200px;
    max-width: 200px;
  }
`;
