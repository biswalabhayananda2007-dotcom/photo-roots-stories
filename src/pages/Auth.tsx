import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [params] = useSearchParams();
  const initial = params.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pw) return toast.error("Please fill all fields");
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!name) return toast.error("Name is required");
        if (pw.length < 6) return toast.error("Password must be 6+ characters");
        if (pw !== pw2) return toast.error("Passwords don't match");
        const { error } = await supabase.auth.signUp({
          email,
          password: pw,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { name },
          },
        });
        if (error) throw error;
        toast.success(`Welcome, ${name.split(" ")[0]}! Account created.`);
        nav("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
        toast.success("Welcome back!");
        nav("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-hero">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_30%,white,transparent_60%)]" />
        <Link to="/" className="relative flex items-center gap-2">
          <div className="bg-primary-foreground/20 backdrop-blur h-9 w-9 rounded-lg flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-semibold">Ancestra</span>
        </Link>
        <div className="relative">
          <p className="font-display text-4xl leading-tight italic">
            "I found my grandmother's wedding photo and finally heard her story."
          </p>
          <p className="mt-4 text-primary-foreground/80">— Anika, beta user</p>
        </div>
        <p className="relative text-sm text-primary-foreground/70">© Ancestra AI 2026</p>
      </div>

      <div className="flex flex-col p-6 sm:p-12">
        <div className="flex justify-between items-center">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="bg-gradient-primary text-primary-foreground h-8 w-8 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-semibold">Ancestra</span>
          </Link>
          <div className="ml-auto"><ThemeToggle /></div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              {mode === "login" ? "Welcome back" : "Create your archive"}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {mode === "login" ? "Log in to continue your family's story." : "Start preserving in under a minute."}
            </p>

            <div className="mt-6 inline-flex p-1 rounded-full bg-muted">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                    mode === m ? "bg-card shadow-soft font-medium" : "text-muted-foreground"
                  }`}
                >
                  {m === "login" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              {mode === "signup" && (
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" className="mt-1.5" />
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@family.com" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="pw">Password</Label>
                <Input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" className="mt-1.5" />
              </div>
              {mode === "signup" && (
                <div>
                  <Label htmlFor="pw2">Confirm password</Label>
                  <Input id="pw2" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="••••••••" className="mt-1.5" />
                </div>
              )}
              <Button type="submit" disabled={loading} className="w-full bg-gradient-primary hover:opacity-90 h-11">
                {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-xs text-muted-foreground text-center">
              By continuing you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
