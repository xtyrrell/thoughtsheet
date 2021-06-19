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
  // TODO: Store a boolean, "isAuthenticated", which is false on app download
  // but is set to true the first time someone logs in. It stays true until
  // an API call returns a "Not Authenticated" error, which triggers it to
  // flip back to false.
  // const [isAuthenticated] = useStorageItem("isAuthenticated");
  const isAuthenticated = true;

  console.log(`AuthProvider: isAuthenticated`, isAuthenticated);

  const login = async ({ email, password }: LoginDetails) => {
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
