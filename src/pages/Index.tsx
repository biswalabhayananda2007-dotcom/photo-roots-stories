import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Landing } from "@/components/Landing";

const Index = () => (
  <div className="min-h-screen flex flex-col">
    <SiteHeader />
    <Landing />
    <SiteFooter />
  </div>
);

export default Index;
