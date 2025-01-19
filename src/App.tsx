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
        const { data: { user } } = await supabase.auth.signUp({
          email: 'admin@clubpilot.com',
          password: 'clubpilot123',
        });

        if (user) {
          setIsAuthenticated(true);
          toast.success("Logged in as admin");
        }
      } catch (error) {
        // If signup fails, try to sign in
        try {
          const { data: { user } } = await supabase.auth.signInWithPassword({
            email: 'admin@clubpilot.com',
            password: 'clubpilot123',
          });

          if (user) {
            setIsAuthenticated(true);
            toast.success("Logged in as admin");
          }
        } catch (signInError) {
          console.error("Error during auto-login:", signInError);
          toast.error("Failed to auto-login");
        }
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