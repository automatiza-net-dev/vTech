export type CacheKeys = "guid" | "user" | "adminUser";

export type CacheValues = {
  guid: {
    value: string | null;
  };
  user: {
    value: string | null;
  };
  adminUser: {
    value: string | null;
  };
};

