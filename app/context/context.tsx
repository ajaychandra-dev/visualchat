"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

interface Response {
  id: string;
  name: string;
  nodes: {
    id: string;
    type: string;
    position: {
      x: number;
      y: number;
    };
    data: {
      question: string;
      answer: string;
    };
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
  }[];
}

type AppContextType = {
  data: Response | null;
  setData: React.Dispatch<React.SetStateAction<Response | null>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Response | null>(null);

  return (
    <AppContext.Provider value={{ data, setData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
