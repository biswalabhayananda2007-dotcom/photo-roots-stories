import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-collage.jpg";
import { ArrowRight, Camera, Network, BookOpen, Upload, Tag, GitBranch, Sparkles, Check } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Smart Photo Tagging",
    desc: "Upload vintage photos and tag every face. We surface placeholder face boxes so naming feels effortless.",
  },
  {
    icon: Network,
    title: "Living Family Tree",
    desc: "Connect tagged people with parents, spouses, and siblings. Watch a beautiful interactive tree assemble itself.",
  },
  {
    icon: BookOpen,
    title: "AI Story Snippets",
    desc: "Generate evocative short stories about each ancestor — then edit, refine, and pass them down.",
  },
];

const steps = [
  { icon: Upload, title: "Upload", desc: "Drop in old photos from any era." },
  { icon: Tag, title: "Tag", desc: "Name the faces and add memories." },
  { icon: GitBranch, title: "Connect", desc: "Link relationships into a tree." },
  { icon: Sparkles, title: "Tell", desc: "Let AI weave stories worth keeping." },
];

const tiers = [
  {
    name: "Free",
    price: "$0",
    desc: "Start preserving today.",
    features: ["50 photos", "Up to 25 people", "1 family tree", "Basic AI stories"],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$9",
    period: "/mo",
    desc: "For serious archivists.",
    features: ["Unlimited photos", "Unlimited people", "Multiple trees", "Advanced AI stories", "Export to PDF"],
    cta: "Go Pro",
    featured: true,
  },
  {
    name: "Premium",
    price: "$19",
    period: "/mo",
    desc: "Heritage in full bloom.",
    features: ["Everything in Pro", "Voice narration", "Heirloom print book", "Family collaboration", "Priority support"],
    cta: "Go Premium",
  },
];

export const Landing = () => {
  const nav = useNavigate();
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container relative pt-20 pb-24 md:pt-28 md:pb-32 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/80 border border-border text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Now in beta — heritage tech, reimagined
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
              Turn old photos into <span className="gradient-text italic">living</span> family stories.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Ancestra organizes scattered vintage photographs, tags every face, and weaves them into an interactive family tree — complete with AI-crafted stories.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => nav("/auth?mode=signup")} className="bg-gradient-primary hover:opacity-90 shadow-elegant text-base h-12 px-7">
                Start free <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => nav("/dashboard")} className="text-base h-12 px-7">
                See live demo
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
              <span>✓ No credit card</span>
              <span>✓ 50 free photos</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:200ms]">
            <div className="absolute -inset-8 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
            <div className="relative vintage-frame shadow-elegant animate-float">
              <img
                src={heroImage}
                alt="Vintage family photographs forming a glowing family tree"
                width={1280}
                height={1280}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="container py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary uppercase tracking-widest">Features</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold tracking-tight">
            Everything you need to preserve a legacy.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="group relative p-8 rounded-2xl bg-card border border-border hover:shadow-elegant transition-all duration-500 hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-muted/40 border-y border-border/50">
        <div className="container py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">How it works</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold tracking-tight">
              From shoebox to story in four steps.
            </h2>
          </div>
          <div className="mt-12 grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="text-6xl font-display text-primary/20 absolute -top-4 right-4">{i + 1}</div>
                <div className="relative p-6 rounded-2xl bg-card border border-border h-full">
                  <s.icon className="h-7 w-7 text-primary" />
                  <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="container py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium text-primary uppercase tracking-widest">Pricing</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold tracking-tight">
            Simple plans for every family.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative p-8 rounded-2xl border transition-all ${
                t.featured
                  ? "bg-gradient-to-b from-primary/10 to-card border-primary shadow-elegant scale-[1.02]"
                  : "bg-card border-border hover:shadow-soft"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-medium">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-2xl font-semibold">{t.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-5xl font-semibold">{t.price}</span>
                {t.period && <span className="text-muted-foreground">{t.period}</span>}
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-7 w-full ${t.featured ? "bg-gradient-primary hover:opacity-90" : ""}`}
                variant={t.featured ? "default" : "outline"}
                onClick={() => nav("/auth?mode=signup")}
              >
                {t.cta}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 md:p-20 text-center shadow-elegant">
          <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
          <h2 className="relative font-display text-4xl md:text-6xl font-semibold text-primary-foreground tracking-tight">
            Your family's story is waiting.
          </h2>
          <p className="relative mt-4 text-primary-foreground/85 text-lg max-w-xl mx-auto">
            Join thousands of families giving their photographs a second life.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => nav("/auth?mode=signup")}
            className="relative mt-8 h-12 px-8 text-base"
          >
            Start free <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </section>
    </main>
  );
};
