import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles, ImagePlus, Users, GitBranch, BookOpen, LogOut, Menu, X } from "lucide-react";
import { PhotosPanel } from "@/components/dashboard/PhotosPanel";
import { PeoplePanel } from "@/components/dashboard/PeoplePanel";
import { FamilyTreePanel } from "@/components/dashboard/FamilyTreePanel";
import { StoriesPanel } from "@/components/dashboard/StoriesPanel";
import { MembersPanel } from "@/components/dashboard/MembersPanel";
import { supabase } from "@/integrations/supabase/client";

type Section = "photos" | "people" | "tree" | "stories" | "members";

const items: { id: Section; label: string; icon: typeof ImagePlus }[] = [
  { id: "photos", label: "Upload Photos", icon: ImagePlus },
  { id: "people", label: "People", icon: Users },
  { id: "tree", label: "Family Tree", icon: GitBranch },
  { id: "stories", label: "Stories", icon: BookOpen },
  { id: "members", label: "Members", icon: Users },
];

const Dashboard = () => {
  const { user, photos, people, stories } = useStore();
  const nav = useNavigate();
  const [section, setSection] = useState<Section>("photos");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!user) nav("/auth");
  }, [user, nav]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-primary text-primary-foreground h-8 w-8 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-semibold">Ancestra</span>
          </Link>
          <button className="lg:hidden" onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => {
            const active = section === it.id;
            return (
              <button
                key={it.id}
                onClick={() => { setSection(it.id); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <it.icon className="h-4 w-4" />
                {it.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          <div className="px-3 py-2 text-xs text-muted-foreground">
            <div className="flex justify-between"><span>Photos</span><span className="font-semibold text-foreground">{photos.length}</span></div>
            <div className="flex justify-between"><span>People</span><span className="font-semibold text-foreground">{people.length}</span></div>
            <div className="flex justify-between"><span>Stories</span><span className="font-semibold text-foreground">{stories.length}</span></div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-muted/60">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={async () => { await supabase.auth.signOut(); nav("/"); }}>
            <LogOut className="h-4 w-4 mr-2" /> Log out
          </Button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center justify-between px-4 lg:px-8">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block text-sm text-muted-foreground">
            Welcome back, <span className="text-foreground font-medium">{user.name.split(" ")[0]}</span>.
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          {section === "photos" && <PhotosPanel />}
          {section === "people" && <PeoplePanel />}
          {section === "tree" && <FamilyTreePanel />}
          {section === "stories" && <StoriesPanel />}
          {section === "members" && <MembersPanel />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
