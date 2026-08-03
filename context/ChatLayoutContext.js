"use client";

import { createContext, useContext } from "react";

export const ChatLayoutContext = createContext(null);

export function useChatLayout() {
  const context = useContext(ChatLayoutContext);
  if (!context) {
    throw new Error("useChatLayout must be used within AppRouteLayoutShell");
  }
  return context;
}
