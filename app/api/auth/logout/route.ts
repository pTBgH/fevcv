// filepath: /home/phungthaibao/Projects/1506/fevcv/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Construct the Keycloak logout URL and include a redirect back to your app:
  const logoutUrl = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?redirect_uri=${process.env.NEXTAUTH_URL}`;
  const response = NextResponse.redirect(logoutUrl);
  response.cookies.delete("next-auth.session-token");
  return response;
}