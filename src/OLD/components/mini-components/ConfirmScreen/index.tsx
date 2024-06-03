// @ts-nocheck
import * as React from "react";

import { Container } from "./styles";

export default  function ConfirmScreen({
  title,
  description,
}) {
  return (
    <Container className="uk-text-center uk-margin-top">
      <h4 className="uk-margin-remove">{title}</h4>
      <div>{description}</div>
    </Container>
  );
}
