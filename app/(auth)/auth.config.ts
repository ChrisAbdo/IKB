// app/(auth)/auth.config.ts
import { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/chat", // Changed this to redirect new users to chat
  },
  providers: [
    // ... (unchanged)
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLandingPage = nextUrl.pathname === "/";
      const isOnChat = nextUrl.pathname.startsWith("/chat");
      const isOnRegister = nextUrl.pathname.startsWith("/register");
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      if (isLoggedIn) {
        // If logged in and trying to access landing, login, or register pages, redirect to chat
        if (isOnLandingPage || isOnLogin || isOnRegister) {
          return Response.redirect(new URL("/chat", nextUrl));
        }
        // For all other cases when logged in, allow access
        return true;
      }

      // If not logged in
      if (isOnLandingPage || isOnRegister || isOnLogin) {
        return true; // Allow access to landing, register and login pages
      }

      if (isOnChat) {
        // If trying to access chat while not logged in, redirect to login
        return Response.redirect(new URL("/login", nextUrl));
      }

      // For any other page, redirect to the landing page
      return Response.redirect(new URL("/", nextUrl));
    },
  },
} satisfies NextAuthConfig;
