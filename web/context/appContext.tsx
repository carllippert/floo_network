import React, { useState, createContext, useContext } from "react";

export interface AppContext {
  field: boolean;
  setField: (value: true) => void;
}

const AppContext = createContext<AppContext>({
  field: true,
  setField: () => {},
});

export interface Props {
  [propName: string]: any;
}

export const AppContextProvider = (props: Props) => {
  const [field, setField] = useState<AppContext["field"]>(true);

  const value = {
    field,
    setField,
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
