// filepath: /app/api/auth/[...nextauth]/route.ts

import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the original token and an error property
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: process.env.KEYCLOAK_CLIENT_ID!,
                client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
                refresh_token: token.refreshToken as string,
            }),
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
        };
    } catch (error) {
        console.error("Error refreshing access token", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],

  // ===================== PHẦN QUAN TRỌNG NHẤT =====================
  callbacks: {
    // 1. Callback `jwt` được gọi ĐẦU TIÊN
    async jwt({ token, account }) {
      // **Khi đăng nhập lần đầu tiên**: `account` object sẽ có sẵn
      if (account) {
        // Gán các giá trị quan trọng từ `account` vào `token` của NextAuth
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = Date.now() + (5000* 1000);
        return token;
      }

      // **Ở những lần truy cập sau**: Kiểm tra xem access token có hết hạn không
      // So sánh thời gian hiện tại với thời gian hết hạn (trừ đi 1 phút để làm mới sớm)
      if (Date.now() < (token.accessTokenExpires as number) - 60 * 1000) {
        // Nếu token còn hạn, trả về token hiện tại
        return token;
      }
      
      // Nếu token đã hết hạn, gọi hàm `refreshAccessToken` đã viết ở trên
      console.log("Access token has expired, refreshing...");
      return refreshAccessToken(token);
    },

    // 2. Callback `session` được gọi SAU `jwt`
    async session({ session, token }) {
      // Gán `accessToken` từ `token` (đã được làm mới nếu cần) vào `session`
      // để client có thể sử dụng
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
  // =============================================================
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

/**
 * Module augmentation for next-auth
 */
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}