'use client'

import "./globals.css";
import UserProvider from "@/contexts/authUser";
//Components
import Nav from "@/components/Nav";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html>
      <UserProvider>
        <body>
          <Nav />
          {children}
        </body>
      </UserProvider>
    </html>
  );
}
