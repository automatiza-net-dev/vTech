import { Dispatch, SetStateAction } from "react";

import { User } from "@/domain";

export interface IAuthFranchisorContextType {
    user: User | undefined | null;
    signOut(): void;
    signIn(params: { email: string; password: string; system: string }): void;
    setUser: React.Dispatch<React.SetStateAction<User | undefined | null>>;
  }
  