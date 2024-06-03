// @ts-nocheck
import React, { memo } from "react";

import { Input } from "antd";

const Auth = memo(function Auth({ data, setData }) {
  return (
    <div>
      <label>Senha</label>
      <Input type="password" />
    </div>
  );
});

export default Auth;
