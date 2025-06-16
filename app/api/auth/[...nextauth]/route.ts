import NextAuth, { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";

/**
 * Hàm refresh token (Giữ nguyên, không thay đổi)
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: process.env.KEYCLOAK_CLIENT_ID!,
                client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
                refresh_token: token.refreshToken as string,
            }),
        });

        const refreshedTokens = await response.json();
        if (!response.ok) throw refreshedTokens;

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        };
    } catch (error) {
        console.error("Error refreshing access token", error);
        return { ...token, error: "RefreshAccessTokenError" };
    }
}



export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
      wellKnown: `${process.env.KEYCLOAK_ISSUER}/.well-known/openid-configuration`,
      authorization: { params: { scope: "openid email profile" } },
    }),
  ],


  callbacks: {
    /**
     * Callback này chạy NGAY SAU KHI đăng nhập thành công với Keycloak.
     */
    async signIn({ user, account, profile }) {
      if (account?.provider === "keycloak" && profile) {
        console.log("Keycloak signIn callback triggered. Syncing user with backend...");
        try {
          // Gọi đến API sync user của Laravel
          const syncResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sync-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              // Gửi secret key để xác thực server-to-server
              'X-Internal-API-Secret': process.env.LARAVEL_INTERNAL_API_SECRET!,
            },
            body: JSON.stringify({
              keycloak_id: profile.sub, // `sub` là ID duy nhất của user trên Keycloak
              name: profile.name,
              email: profile.email,
            }),
          });

          if (!syncResponse.ok) {
            const errorData = await syncResponse.json();
            console.error("Failed to sync user with Laravel backend:", errorData);
            return false; // Quan trọng: Ngăn không cho đăng nhập nếu sync thất bại
          }

          console.log("User synced successfully with Laravel backend.");
          return true; // Quan trọng: Cho phép đăng nhập nếu sync thành công

        } catch (error) {
          console.error("Network error during user sync:", error);
          return false; // Quan trọng: Ngăn không cho đăng nhập nếu có lỗi mạng
        }
      }
      return true; // Cho phép các luồng đăng nhập khác (nếu có)
    },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        // Đặt thời gian hết hạn chính xác từ Keycloak
        token.accessTokenExpires = Date.now() + 300 * 1000;
        return token;
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }
      
      console.log("Access token has expired, refreshing...");
      return refreshAccessToken(token);
    },

    // Callback `session` (Giữ nguyên logic của bạn)
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      // Truyền lỗi refresh token vào session để client có thể xử lý (ví dụ: tự động logout)
      session.error = token.error; 
      return session;
    },
  },

   events: {
    async signOut({ token }) {
      // Logic mới sẽ không dùng token nữa, nhưng chúng ta vẫn giữ nó ở đây
      const issuerUrl = process.env.KEYCLOAK_ISSUER;
      if (issuerUrl) {
        try {
          const logOutUrl = new URL(`${issuerUrl}/protocol/openid-connect/logout`);

          const postLogoutRedirectUri = process.env.NEXTAUTH_URL || 'http://localhost:3000';
          logOutUrl.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);

        } catch (error) {
          console.error("Error constructing logout URL", error);
        }
      }
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


// Module augmentation (Giữ nguyên)
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string; // Giữ lại nếu cần
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

