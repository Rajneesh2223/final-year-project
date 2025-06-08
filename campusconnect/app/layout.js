"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/component/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import { store } from "@/app/store/store";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import HeaderNav from "@/app/components/HeaderNav/HeaderNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Routes where the sidebar should NEVER appear (auth pages + homepage)
  const hideSidebarPaths = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
  const showSidebar = isAuthenticated && !hideSidebarPaths.includes(pathname);
  
  // HeaderNav shows on ALL routes if NOT authenticated
  const showHeaderNav = !isAuthenticated;

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        if (typeof window !== 'undefined') {
          const user = localStorage.getItem('user');
          const token = localStorage.getItem('token');
          const authToken = localStorage.getItem('authToken');
          const accessToken = localStorage.getItem('access_token');
          const userData = localStorage.getItem('userData');
          const isLoggedIn = localStorage.getItem('isLoggedIn');
          
          console.log("Debug - Auth Check:", {
            user,
            token,
            authToken,
            accessToken,
            userData,
            isLoggedIn,
            showHeaderNav,
            isAuthenticated,
            pathname
          });
          
          // Check if any authentication data exists
          const isAuth = Boolean(
            (user && user !== 'null' && user !== 'undefined' && user.trim() !== '') ||
            (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') ||
            (authToken && authToken !== 'null' && authToken !== 'undefined' && authToken.trim() !== '') ||
            (accessToken && accessToken !== 'null' && accessToken !== 'undefined' && accessToken.trim() !== '') ||
            (userData && userData !== 'null' && userData !== 'undefined' && userData.trim() !== '') ||
            (isLoggedIn && isLoggedIn !== 'null' && isLoggedIn !== 'undefined' && isLoggedIn === 'true')
          );
          
          console.log("Debug - isAuth:", isAuth);
          setIsAuthenticated(isAuth);
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Listen for storage changes to update auth state across tabs
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('authStateChanged', handleStorageChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('authStateChanged', handleStorageChange);
      }
    };
  }, [pathname]);

  if (isLoading) {
    return (
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body suppressHydrationWarning={true}>
          <div className="flex min-h-screen bg-gray-50 items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </body>
      </html>
    );
  }

  console.log("Debug - Render:", { showHeaderNav, isAuthenticated, pathname });

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning={true}>
        <Provider store={store}>
          <div className="flex flex-col min-h-screen bg-gray-50">
            {/* HeaderNav - Shows on ALL routes if NOT authenticated */}
            {showHeaderNav && (
              <header className="bg-white border-b border-gray-200 shadow-sm">
                <HeaderNav />
              </header>
            )}

            <div className="flex flex-1">
              {/* Sidebar - Only shows when authenticated AND not on auth routes */}
              {showSidebar && (
                <aside className="w-64 bg-white border-r border-gray-200 fixed h-screen z-10 overflow-y-auto">
                  <Navbar />
                </aside>
              )}

              {/* Main Content - Adjust padding based on active nav */}
              <main className={`
                ${showSidebar ? "ml-64" : ""} 
                ${showHeaderNav ? "pt-16" : ""} 
                flex-1 p-4
              `}>
                {children}
              </main>
            </div>
          </div>
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Provider>
      </body>
    </html>
  );
}