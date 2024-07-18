"use client";
import useUser from "@/hooks/useUser";
import React, { createContext, useContext } from "react";

const AuthContext = createContext({
  user: {id: "", name: "", email: "", phoneNumber: "", isVerfied: false},
  loading: true,
  error: null,
});

export function AuthProvider({ children } : {children : React.ReactNode}) {
  const { user, loading, error } = useUser();

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);