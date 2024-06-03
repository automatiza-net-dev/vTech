// @ts-nocheck
import React from "react";

import { useAuth } from "@/OLD/hooks/useAuth";

import { ResetPassword } from "@/OLD/components/Authentication/ResetPassword";

export default function ResetPasswordPage() {
 
  
  return (
    <div>
      <ResetPassword />
    </div>
  );
}

// config padrão: (url: ctx.req.headers.host)
// sancla: "https://sancla.creativecode.dev.br"
// vetech: "https://vetech.creativecode.dev.br"
// liftone: "https://liftone.creativecode.dev.br"
