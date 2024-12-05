"use client";

import React, { useContext } from "react";
import { Session, User } from "lucia";
import { createContext } from "react";

interface SessionContext {
  user: User;
  session: Session;
}

// Creating the context for providing the child components
const SessionContext = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{
  value: SessionContext;
}>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

// Custom hook for retrieving the sessionContext data
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
