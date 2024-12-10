"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Creating a new QueryClient for setting up React Tanstack query
  const [client] = useState(new QueryClient());
  return (
    <QueryClientProvider client={client}>
      {children}
      {/* This shows a dev tool to see the cached items in development server only */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
