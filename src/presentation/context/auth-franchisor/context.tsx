import { createContext, useContext, useEffect, useState } from "react";

import { useRouter } from "next/router";

import useSWR from "swr";

import { AuthAdmin, User } from "@/domain";
import { RemoteLoadUserDashboard } from "@/data";
import { container, InfraTypes, TypesAutomatiza } from "@/container";

import { IAuthFranchisorContextType } from "./interfaces";
import { Storage } from "@/infra";

const AuthFranchisorContext = createContext({} as IAuthFranchisorContextType);

function AuthFranchisorProvider({ children, initialUserAdmin }: { children: React.ReactNode, initialUserAdmin: any }) {
  const [user, setUser] = useState<User | undefined | null>(initialUserAdmin);

  const router = useRouter();

  async function loadUser() {
    const response = await container
      .get<RemoteLoadUserDashboard>(TypesAutomatiza.RemoteLoadUserDashboard)
      .load({ admin: true });

    setUser(response);
  }

  async function signIn(payload: AuthAdmin.Params) {
    await container
      .get<AuthAdmin>(TypesAutomatiza.RemoteAuthAdmin)
      .auth(payload);

    await loadUser();

    if (!router.pathname.includes("/admin")) {
      router.push("/admin");
    }
  }

  function signOut() {
    setUser(null);

    container
      .get<Storage>(InfraTypes.storage)
      .set("adminUser", { value: null });
  }

  useSWR(user === undefined && "user_franchisor", async () => {
    if (router.asPath.includes("admin")) {
      await loadUser();
    }
  }, { revalidateOnFocus: false });

  return (
    <AuthFranchisorContext.Provider value={{ user, signIn, signOut, setUser }}>
      {children}
    </AuthFranchisorContext.Provider>
  );
}

function useAuthFranchisor() {
  const context = useContext(AuthFranchisorContext);

  if (context === undefined) {
    throw new Error(
      "useAuthFranchisor() must be used within a AutFranchisorhProvider"
    );
  }
  return context;
}

export { AuthFranchisorProvider, useAuthFranchisor };
