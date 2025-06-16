// filepath: /home/phungthaibao/Projects/3417/fevcv/hooks/use-auth.ts
import { useSession, signIn } from "next-auth/react";
import { useCallback } from "react";

export function useAuth() {
  const { data: session, status } = useSession();

  const requireAuth = useCallback((action: () => void) => {
    if (status !== "authenticated") {
      signIn("keycloak");
      return;
    }
    action();
  }, [status]);

  return { session, status, requireAuth };
}