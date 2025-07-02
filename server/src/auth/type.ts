export type Role = 'admin' | 'user';
export type TokenPayload = {
  userId: number;
  username: string;
  role: Role;
};
