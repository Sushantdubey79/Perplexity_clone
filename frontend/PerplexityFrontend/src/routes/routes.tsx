import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import Onboarding from "../pages/Onboarding";
import Loading from "../components/Loading";
import { useUserData } from "../hooks/useUserData.js";
import { useState, useEffect } from "react";
import { ConversationContextProvider } from "../context/ConversationContext";

export type UserData = {
  supaBaseId: string;
  access_token: string;
  email?: string | null;
  username? : string | null;
};

export default function Router() {

  const { userData, loading } = useUserData();
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  // Check if user has already completed onboarding
  useEffect(() => {
    if (userData) {
      const isOnboarded = localStorage.getItem(`onboarded_${userData.supaBaseId}`);
      setOnboardingComplete(!!isOnboarded);
    }
  }, [userData]);

  if (loading) return <Loading />;

  const userAuth =
    userData != null && Object.keys(userData as object).length > 0;


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/"
          element={
            userAuth ? (onboardingComplete ? <ConversationContextProvider><Home /></ConversationContextProvider> : <Onboarding />) : <Auth />
          }
        />
        <Route path="/home" element={<ConversationContextProvider><Home /></ConversationContextProvider>} />
      </Routes>
    </BrowserRouter>
  );
}
