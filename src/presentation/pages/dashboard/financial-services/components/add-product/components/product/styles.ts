import styled from "styled-components";

export const AddProduct = styled("div")`
  border-radius: 5px;
  border: 1px solid #e1e1e1;
  background: #fafafa;
  padding-top: 15px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto 20px;

  .select_product {
    margin-bottom: 15px;
    padding: 0 20px;

    label {
      font-size: 15px !important;
      font-weight: bold !important;
      margin-bottom: 5px;
    }
  }

  .head_cart {
    border-radius: 4px 4px 0px 0px;
    background: #f2f2f2;
    height: 40px;
    align-items: center;
    padding: 0 20px;

    h3 {
      margin-bottom: 0;
    }
  }

  .cart_item,
  .head_cart {
    display: flex;
    gap: 15px;
    align-items: center;
    justify-content: flex-start;

    .input_control {
      margin-bottom: 0;
    }

    h4,
    h3 {
      margin: 0;
    }

    > div:nth-child(1) {
      width: 100%;
      min-width: 150px;
    }

    > div:not(:nth-child(1)) {
      max-width: 150px;
      min-width: 150px;
    }

    > div:last-child {
      min-width: 150px;
      max-width: 150px;
    }
  }

  .cart_item {
    padding: 15px;
    border-top: 1px solid #f2f2f2;

 
  }

 
`;
