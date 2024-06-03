// @ts-nocheck
import React from "react";
import { useRouter } from "next/router";

import { Container, Body } from "./styles";
import ExistentUser from "./ExistentUser";
import NewUser from "./NewUser";

function Invites() {
  const router = useRouter();

  return (
    <Container>
      <Body>
        <section>
          <img
            className="logo"
            src={process.env.NEXT_PUBLIC_API + `/assets/logo-${process.env.client}.png`}
          />
          {router.query.page === "aceitar" && <ExistentUser />}
          {router.query.page === "novo-usuario" && <NewUser />}
        </section>
        <div className="img-container">
          <img src="/svg/undraw_friends_r511.svg" />
        </div>
      </Body>
    </Container>
  );
}

export default Invites;
