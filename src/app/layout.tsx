import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "FitBot AI — Your Personal Fitness Coach",
  description: "AI-powered fitness chatbot for workout plans, nutrition guidance, and progress tracking. Get personalized fitness coaching powered by Google Gemini.",
  keywords: ["fitness", "chatbot", "AI coach", "workout", "nutrition", "training"],
  openGraph: {
    title: "FitBot AI — Your Personal Fitness Coach",
    description: "AI-powered fitness chatbot for workout plans, nutrition guidance, and progress tracking.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
