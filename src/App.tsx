import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import { toast } from "sonner";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const autoLogin = async () => {
      try {
        // Try to sign up first to ensure the account exists
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'admin@clubpilot.com',
          password: 'clubpilot123',
        });

        if (signUpError) {
          // If signup fails because user exists, try to sign in
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: 'admin@clubpilot.com',
            password: 'clubpilot123',
          });

          if (signInError) {
            if (signInError.message.includes('Email not confirmed')) {
              toast.error("Please check your email to confirm your account before logging in");
            } else {
              toast.error("Authentication failed: " + signInError.message);
            }
            return;
          }

          if (signInData.user) {
            setIsAuthenticated(true);
            toast.success("Logged in as admin");
          }
        } else if (signUpData.user) {
          // If signup is successful but email confirmation is required
          toast.info("Admin account created. Please check your email to confirm your account.");
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        toast.error("Authentication failed");
      } finally {
        setIsLoading(false);
      }
    };

    autoLogin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Index />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;