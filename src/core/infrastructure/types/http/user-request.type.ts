export type UserRequest = {
  user: {
    uuid: string;
    email: string;
    roles: string[];
  };
};
