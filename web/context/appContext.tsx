import React, { useState, createContext, useContext } from "react";

export interface AppContext {
  evil: boolean;
  setEvil: (value: boolean) => void;
}

const AppContext = createContext<AppContext>({
  evil: false,
  setEvil: () => {},
});

export interface Props {
  [propName: string]: any;
}

export const AppContextProvider = (props: Props) => {
  const [evil, setEvil] = useState<AppContext["evil"]>(true);

  const value = {
    evil,
    setEvil,
  };

  return <AppContext.Provider value={value} {...props} />;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error(`useAppContext must be used within a AppContextProvider.`);
  }
  return context;
};
