import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store";

export const useAuthSession = () => {
  const setUser = useStore((s) => s.setUser);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: (session.user.user_metadata?.name as string) || session.user.email!.split("@")[0],
          email: session.user.email || "",
        });
      } else {
        setUser(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          name: (session.user.user_metadata?.name as string) || session.user.email!.split("@")[0],
          email: session.user.email || "",
        });
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [setUser]);
};
