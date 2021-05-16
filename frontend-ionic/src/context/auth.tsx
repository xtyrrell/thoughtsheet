import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

import { useStorageItem } from "@ionic/react-hooks/storage";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (details: LoginDetails) => void;
}

interface LoginDetails {
  emailOrPhoneNumber: string;
  password: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [userToken] = useStorageItem("userToken");

  console.log(`AuthProvider: userToken`, userToken);

  // If the token already exists, assume we are logged in
  const isAuthenticated = !!userToken;

  console.log(`AuthProvider: isAuthenticated`, isAuthenticated);

  const login = ({ emailOrPhoneNumber, password }: LoginDetails) => {
    // fetch()
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const auth = useContext(AuthContext);

  if (auth == null) {
    throw new Error("useAuth must be used with an AuthProvider");
  }

  return auth;
};
