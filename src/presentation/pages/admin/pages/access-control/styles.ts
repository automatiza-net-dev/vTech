import styled from "styled-components";

export const ListUser = styled("div")`
  .top {
    width: 100%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 15px;

    h2 {
      margin: 0;
      font-size: 22px;
    }

    .box-right {
        display: flex;
        gap: 10px;
    }
  }

  .content {
    background-color: #fff;
    padding: 30px;
    border-radius: 20px;
  }

  .line {
    margin: 10px 0;
  }
`