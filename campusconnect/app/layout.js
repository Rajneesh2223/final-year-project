"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/component/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import { store } from "@/app/store/store";
import { Provider } from "react-redux";
import { useRouter } from "next/navigation";  // Import useRouter

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const router = useRouter(); // Get router object
  const showNavbar = router.pathname !== "/"; // Show navbar only if not on '/'

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning={true}>
        <Provider store={store}>
          <div className="flex min-h-screen bg-gray-50">
            {showNavbar && (
              <aside className="w-64 bg-white border-r border-gray-200 fixed h-screen">
                <Navbar />

              </aside>
            )}
            <main className={`${showNavbar ? "ml-64" : ""} flex-1 p-4`}>
              {children}
            </main>
          </div>
          <Toaster position="top-right" />
        </Provider>
      </body>
    </html>
  );
}
