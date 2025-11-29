export type UserRequest = {
  user: {
    uuid: string;
    identityId: string;
    email: string;
    role: string;
    [key: string]: unknown;
  };
};
