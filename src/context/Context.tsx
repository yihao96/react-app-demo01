import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { UserCreds } from "../types/Users";
import Cookies from "js-cookie";
import { Product } from "../types/Products";

type ContextProviderProps = {
  children: JSX.Element;
};

type ContextType = {
  token: string | undefined;
  setToken: Dispatch<SetStateAction<string | undefined>>;
  user: UserCreds | undefined;
  setUser: Dispatch<SetStateAction<UserCreds | undefined>>;
  cart: Product[] | undefined;
  setCart: Dispatch<SetStateAction<Product[] | undefined>>;
  apiUrl: string;
};

const initContextState: ContextType = {
  token: undefined,
  setToken: () => {},
  user: undefined,
  setUser: () => {},
  cart: undefined,
  setCart: () => {},
  apiUrl: "",
};

export const Context = createContext<ContextType>(initContextState);

export const ContextProvider = (props: ContextProviderProps) => {
  const [token, setToken] = useState<string>();
  const [user, setUser] = useState<UserCreds>();
  const [cart, setCart] = useState<Product[]>();

  const apiUrl = "https://dummyjson.com/";
  const cToken = Cookies.get("token");

  useEffect(() => {
    if (cToken !== null) {
      setToken(cToken);
    }
  }, [cToken]);

  const values = { token, setToken, user, setUser, cart, setCart, apiUrl };

  return <Context.Provider value={values}>{props.children}</Context.Provider>;
};
