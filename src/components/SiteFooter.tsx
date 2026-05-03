import { Sparkles } from "lucide-react";

export const SiteFooter = () => (
  <footer className="border-t border-border/50 mt-24">
    <div className="container py-12 grid gap-8 md:grid-cols-4">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-gradient-primary text-primary-foreground h-8 w-8 rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-semibold">Ancestra</span>
        </div>
        <p className="text-sm text-muted-foreground max-w-xs">
          Turning forgotten photographs into living family stories.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-3">Product</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="/#features" className="hover:text-foreground">Features</a></li>
          <li><a href="/#pricing" className="hover:text-foreground">Pricing</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-3">Company</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="#" className="hover:text-foreground">About</a></li>
          <li><a href="#" className="hover:text-foreground">Blog</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-3">Legal</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="#" className="hover:text-foreground">Privacy</a></li>
          <li><a href="#" className="hover:text-foreground">Terms</a></li>
        </ul>
      </div>
    </div>
    <div className="container border-t border-border/50 py-6 text-xs text-muted-foreground flex justify-between">
      <span>© {new Date().getFullYear()} Ancestra AI</span>
      <span>Made with care for every family.</span>
    </div>
  </footer>
);
