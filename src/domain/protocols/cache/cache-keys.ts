export type CacheKeys = "token" | "guid" | "ip";

export type CacheValues = {
  ip: {
    value: string | null;
  };
  guid: {
    value: string | null;
  };
  user: {
    value: string | null;
  };
  adminUser: {
    value: string | null;
  };
  token: {
    value: string | null;
  };
};
