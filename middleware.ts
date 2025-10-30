// middleware.ts
import { withAuth } from "next-auth/middleware";

export const middleware = withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*", "/analytics/:path*"],
};
