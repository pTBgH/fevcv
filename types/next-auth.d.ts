// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  /**
   * Mở rộng đối tượng Session gốc để thêm accessToken
   */
  interface Session {
    accessToken?: string; // accessToken có thể là string hoặc undefined
  }
}

declare module "next-auth/jwt" {
  /**
   * Mở rộng đối tượng JWT gốc
   */
  interface JWT {
    accessToken?: string;
  }
}