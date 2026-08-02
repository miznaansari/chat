"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import LanguageSelectionModal from "@/components/LanguageSelectionModal";

export default function ClientProviders({ children }) {
  return (
    <LanguageProvider>
      <LanguageSelectionModal />
      {children}
    </LanguageProvider>
  );
}
