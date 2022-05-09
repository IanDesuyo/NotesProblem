import { useToast } from "@chakra-ui/react";
import React, { createContext, FC, useState } from "react";
import api from "../api";
import {
  AccountProviderProps,
  TokenPayload,
  AccountState,
  AccountProviderValue,
} from "./AccountProvider.d";

const nullState: AccountState = {
  isLoggedIn: false,
  token: "",
  displayName: "",
  userId: "",
  exp: 0,
};

export const AccountContext = createContext<AccountProviderValue>(
  nullState as AccountProviderValue
);

const parseToken = (token: string): TokenPayload | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as TokenPayload;

    if (payload.exp * 1000 > Date.now()) {
      return payload;
    }
  } catch (e) {
    console.error(e);
  }

  return null;
};

const AccountProvider: FC<AccountProviderProps> = ({ children }) => {
  const toast = useToast();
  const [account, setAccount] = useState((): AccountState => {
    const token = localStorage.getItem("token");

    if (token) {
      const payload = parseToken(token);

      if (payload) {
        return { ...payload, token, isLoggedIn: true };
      }
    }

    return nullState;
  });

  const useToken = (token: string) => {
    const payload = parseToken(token);

    if (payload) {
      setAccount({ ...payload, token, isLoggedIn: true });
      localStorage.setItem("token", token);

      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAccount(nullState);
  };

  return (
    <AccountContext.Provider value={{ ...account, useToken, logout }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
