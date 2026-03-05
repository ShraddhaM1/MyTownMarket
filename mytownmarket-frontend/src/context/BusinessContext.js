"use client";
import { createContext, useContext, useState } from "react";

const BusinessContext = createContext();

export function BusinessProvider({ children }) {
  const [businesses, setBusinesses] = useState([]);

  const addBusiness = (business) => {
    setBusinesses((prev) => [
      ...prev,
      { id: Date.now(), ...business },
    ]);
  };

  return (
    <BusinessContext.Provider value={{ businesses, addBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
}

export const useBusiness = () => useContext(BusinessContext);
