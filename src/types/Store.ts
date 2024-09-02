import { Allows } from "./AuthTypes";

export type AuthSlice = {
  allows: Allows[];
};

export type TokenSlice = {
  accessToken: string | null;
  refreshToken: string | null;
  authenticated: boolean;
};

export type UserStoreSlice = {
  userName: string;
  email: string;
};

export interface ReduxStore {
  token: TokenSlice;
  auth: AuthSlice;
  user: UserStoreSlice;
}
