export interface AccountProviderProps {
  children: React.ReactNode;
}

export interface TokenPayload {
  displayName: string;
  userId: string;
  exp: number;
}

export interface AccountState extends TokenPayload {
  isLoggedIn: boolean;
  token: string;
}

export interface AccountProviderValue extends AccountState {
  useToken: (token: string) => boolean;
  logout: () => void;
}
