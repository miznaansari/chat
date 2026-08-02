"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("PWA Service Worker registered:", reg.scope))
          .catch((err) => console.error("PWA Service Worker registration failed:", err));
      } else {
        // Unregister service worker in development mode to prevent stale chunk caching
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (let registration of registrations) {
            registration.unregister();
          }
        });
      }
    }
  }, []);

  return null;
}
