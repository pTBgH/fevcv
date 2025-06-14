// filepath: /home/phungthaibao/Projects/1506/fevcv/app/SessionProviderWrapper.tsx
"use client";

import { SessionProvider } from "next-auth/react";

export function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
