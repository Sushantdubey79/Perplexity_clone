import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import { useEffect, useState } from "react";
import useSupabaseClient from "../hooks/useSupabaseClient.js";

type UserData = {
  supaBaseId: string;
  username: string;
  email?: string | null;
};

export default function Router() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [ready, setReady] = useState(false);

  const { supabase } = useSupabaseClient();

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const cached = localStorage.getItem("userData");
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as UserData;
          if (!cancelled) setUserData(parsed);
        } catch {
          localStorage.removeItem("userData");
        }
        if (!cancelled) setReady(true);
        return;
      }

      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session?.user) {
        if (!cancelled) setReady(true);
        return;
      }

      const next: UserData = {
        supaBaseId: session.user.id,
        username: session.access_token,
        email: session.user.email,
      };
      localStorage.setItem("userData", JSON.stringify(next));
      if (!cancelled) {
        setUserData(next);
        setReady(true);
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const userAuth =
    userData != null && Object.keys(userData as object).length > 0;

  if (!ready) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            userAuth ? <Home userData={userData} /> : <Auth />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
