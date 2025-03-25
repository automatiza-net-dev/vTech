import { hexToRgbA } from "infinity-forge";
import styled from "styled-components"

export const CreateOdontogram = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;

  .departament-selection {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 150px;

    button {
      width: 100%;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 10px 0px;
      border: 1px solid transparent;
      transition: 0.3s;

      img {
        width: 100%;
      }

      &:hover {
        border: 1px solid ${(props) => props.theme.primaryColor};
      }
    }
  }

  .services-container {
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    padding: 10px;
    width: 300px;
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

  .button-select-departament {
    width: 120px;
    border: none;
    background: none;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .button-select-departament img {
    width: 100%;
    height: 80px;
    object-fit: contain;
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

export const ItemCard = styled.div<any>`
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "#e0f7fa" : "#fff")};
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 5px 0;
`;

export const Checkbox = styled.input`
  margin-left: 10px;
  cursor: pointer;
`;

