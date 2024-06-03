export type CacheKeys = "guid" | "token" | "adminUser";

export type CacheValues = {
  guid: {
    value: string | null;
  };
  token: {
    value: string | null;
  };
  adminUser: {
    value: string | null;
  };
};

