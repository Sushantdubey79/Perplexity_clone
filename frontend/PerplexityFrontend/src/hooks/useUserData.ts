import { useEffect, useState } from "react";
import { type UserData } from "../routes/routes.js";
import useSupabaseClient from "./useSupabaseClient.js";
import type { SupabaseClient } from "@supabase/supabase-js";

async function getUserData(
  supabase: SupabaseClient
): Promise<UserData | null> {
  try {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    
    if (!session?.user) {
      const cached = localStorage.getItem("userData");
      return cached ? (JSON.parse(cached) as UserData) : null;
    }

    const next: UserData = {
      supaBaseId: session.user.id,
      access_token: session.access_token,
      email: session.user.email,
    };

    if (next.access_token != undefined && next.access_token != null){

      const data = (await supabase.auth.getUser(next.access_token)).data.user?.user_metadata["name"];

      next.username = data;

    }

    localStorage.setItem("userData", JSON.stringify(next));
    return next;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.log("error with message " + message);
    return null;
  }
}

export function useUserData() {
  const { supabase } = useSupabaseClient();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void getUserData(supabase)
      .then(setUserData)
      .finally(() => setLoading(false));
  }, [supabase]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          const userData: UserData = {
            supaBaseId: session.user.id,
            access_token: session.access_token,
            email: session.user.email,
          };
          localStorage.setItem("userData", JSON.stringify(userData));
          setUserData(userData);
          setLoading(false);
        } else {
          localStorage.removeItem("userData");
          setUserData(null);
          setLoading(false);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, [supabase]);

  return { userData, loading };
}
