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
        // Try to sign in first, since the account might already exist
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'admin@clubpilot.com',
          password: 'clubpilot123',
        });

        if (signInData.user) {
          setIsAuthenticated(true);
          toast.success("Logged in as admin");
          return;
        }

        // If sign in fails because the user doesn't exist, try to sign up
        if (signInError && signInError.message.includes('Invalid login credentials')) {
          // Add a delay before signup to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { data: { user }, error: signUpError } = await supabase.auth.signUp({
            email: 'admin@clubpilot.com',
            password: 'clubpilot123',
          });

          if (user) {
            setIsAuthenticated(true);
            toast.success("Admin account created and logged in");
          }

          if (signUpError) {
            console.error("Error during signup:", signUpError);
            toast.error("Failed to create admin account");
          }
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