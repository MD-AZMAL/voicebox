import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";
import WebSocketProvider from "@/app/lib/context/socket";
import RoomProvider from "@/app/lib/context/room";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "VoiceBox",
  description: "Realtime voice chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <RoomProvider>
            <WebSocketProvider>{children}</WebSocketProvider>{" "}
          </RoomProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
