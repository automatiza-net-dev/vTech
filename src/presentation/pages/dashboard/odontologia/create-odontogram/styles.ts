import { hexToRgbA } from "infinity-forge";
import styled from "styled-components";

export const CreateOdontogram = styled.div`
  gap: 20px;
  padding: 20px;


  .content {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
  }

  .Arcada {
    transition: 0.3s;
  }

  .Quadrante {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 0 !important;

    > div {
      width: 100%;
      flex-direction: column;

      img {
        width: 100%;
      }
    }
  }

  .Dentes {
    display: grid !important;
    grid-template-columns: repeat(16, 1fr);
    row-gap: 0 !important;

    > div {
      flex-direction: column !important;
      padding: 0 !important;
      border: 0 !important;
      margin: 5px 0;

      img {
        width: 29px;
      }
    }
  }

  .items-container,
  .services-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
    justify-content: center;
  }

  .item-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #f9f9f9;
  }

  .service-button {
    padding: 10px 15px;
    border: none;
    background: #007bff;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .service-button:hover {
    background: #0056b3;
  }

  .orcamento-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    padding: 10px;
    border: 1px solid ${(props) => hexToRgbA(props.theme.primaryColor, 0.6)};
    border-radius: 8px;
    background: ${(props) => hexToRgbA(props.theme.primaryColor, 0.4)};
  }

  .orcamento-item {
    padding: 5px 10px;
    background: #fff;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center; /* Alinha verticalmente */
  }

  .button-container {
    display: flex;
    gap: 10px;
  }

  .button-container button {
    padding: 10px 15px;
    border: none;
    background: #dc3545;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .button-container button:hover {
    background: #c82333;
  }
`;
