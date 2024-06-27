import styled from "styled-components";

export const Tutors = styled("div")`
  margin-top: 15px;
  padding-bottom: 30px;

  h4 {
    color: #2b2b2b;
    margin-bottom: 20px;
  }

  .select_year {
    display: grid;
    gap: 18px;
    grid-template-columns: repeat(2, 1fr);
  }

  .add_tutor {
    display: flex;
    gap: 10px;
    align-items: center;
    background-color: transparent;
    border: 0;
    padding: 0;

    span {
      color: #2b2b2b;
    }
  }

  .tutor-item {
    height: 54px;
    display: flex;
    gap: 20px; 
    align-items: center;
    margin-bottom: 20px;

    p {
      height: inherit;
      max-width: 650px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 20px;
      border-radius: 5px;
      border: 1px solid #e1e1e1;
      margin: 0;
      color: #828282;
      font-size: 16px;
      font-weight: 400;
    }

    button {
      background-color: transparent;
      border: 0;
      padding: 0;
    }
  }
`;

export const ModalAddTutor = styled("div")`
  .modal_content .content_modal_infinity_forge {
    overflow: unset;
  }

  h3 {
    color: #2b2b2b;
    margin-bottom: 30px;
    text-align: center;
  }
`;
