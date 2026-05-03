import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

type Profile = { id: string; name: string; email: string; created_at: string };

export const MembersPanel = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProfiles(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Members</h1>
        <p className="text-muted-foreground text-sm mt-1">Everyone preserving stories on Ancestra.</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : profiles.length === 0 ? (
        <p className="text-muted-foreground">No members yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Joined {new Date(p.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
