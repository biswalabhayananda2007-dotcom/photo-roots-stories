import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

export const SiteHeader = () => {
  const user = useStore((s) => s.user);
  const nav = useNavigate();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    nav("/");
  };
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="Ancestra AI logo" className="h-9 w-9 object-contain" />
          <span className="font-display text-xl font-semibold tracking-tight">Ancestra<span className="text-primary">.</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="/#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="/#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="/#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="ghost" onClick={() => nav("/dashboard")}>Dashboard</Button>
              <Button variant="outline" onClick={() => { logout(); nav("/"); }}>Log out</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => nav("/auth")} className="hidden sm:inline-flex">Log in</Button>
              <Button onClick={() => nav("/auth?mode=signup")} className="bg-gradient-primary hover:opacity-90 shadow-elegant">
                Start free
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
