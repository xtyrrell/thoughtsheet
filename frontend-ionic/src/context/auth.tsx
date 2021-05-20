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
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [userToken] = useStorageItem("userToken");

  console.log(`AuthProvider: userToken`, userToken);

  // If the token already exists, assume we are logged in
  const isAuthenticated = !!userToken;

  console.log(`AuthProvider: isAuthenticated`, isAuthenticated);

  const login = async ({ email, password }: LoginDetails) => {
    // fetch()
    console.log(
      `login: Logging in with email: ${email} and password: ${password}`
    );

    try {
      const res = await fetch(`http://localhost:5000/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // include, *same-origin, omit
      });
      console.log(`login: fetch res:`, res);
    } catch (err) {
      console.log(`login: err :`, err);
    }
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
