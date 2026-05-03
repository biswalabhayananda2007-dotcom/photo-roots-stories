import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const FamilyTreePanel = () => {
  const { people, relationships, addRelationship, removeRelationship } = useStore();
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState<"parent" | "spouse" | "sibling" | "child">("parent");

  // Simple layout: position nodes on a circle for visual interest.
  const nodePositions = useMemo(() => {
    const n = people.length;
    if (n === 0) return [];
    const cx = 400;
    const cy = 280;
    const r = Math.min(220, 60 + n * 18);
    return people.map((p, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      return { ...p, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
    });
  }, [people]);

  const save = () => {
    if (!from || !to || from === to) return toast.error("Pick two different people");
    addRelationship({ fromId: from, toId: to, type });
    toast.success("Relationship added");
    setOpen(false);
    setFrom(""); setTo("");
  };

  const lineColor = (t: string) => {
    if (t === "spouse") return "hsl(var(--primary-glow))";
    if (t === "sibling") return "hsl(var(--sepia))";
    return "hsl(var(--primary))";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Family Tree</h1>
          <p className="text-muted-foreground text-sm mt-1">Link relationships to grow your tree.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-gradient-primary hover:opacity-90" disabled={people.length < 2}>
          <Plus className="h-4 w-4 mr-2" /> Add relationship
        </Button>
      </div>

      {people.length < 2 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
          <p className="font-medium">Add at least two people</p>
          <p className="text-sm text-muted-foreground">Then connect them to start your tree.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-gradient-to-b from-card to-muted/40 overflow-hidden">
          <svg viewBox="0 0 800 560" className="w-full h-[560px]">
            <defs>
              <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0.15)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width="800" height="560" fill="url(#bgGlow)" />

            {relationships.map((r) => {
              const a = nodePositions.find((n) => n.id === r.fromId);
              const b = nodePositions.find((n) => n.id === r.toId);
              if (!a || !b) return null;
              return (
                <g key={r.id}>
                  <line
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={lineColor(r.type)}
                    strokeWidth={2}
                    strokeDasharray={r.type === "spouse" ? "0" : r.type === "sibling" ? "4 4" : "0"}
                    opacity={0.6}
                  />
                  <text
                    x={(a.x + b.x) / 2} y={(a.y + b.y) / 2}
                    fontSize="10" fill="hsl(var(--muted-foreground))" textAnchor="middle"
                    style={{ pointerEvents: "all", cursor: "pointer" }}
                    onClick={() => removeRelationship(r.id)}
                  >
                    {r.type}
                  </text>
                </g>
              );
            })}

            {nodePositions.map((p) => (
              <g key={p.id}>
                <circle cx={p.x} cy={p.y} r={34} fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth={2} />
                <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="14" fontWeight="600" fill="hsl(var(--foreground))">
                  {p.name.charAt(0).toUpperCase()}
                </text>
                <text x={p.x} y={p.y + 54} textAnchor="middle" fontSize="11" fill="hsl(var(--foreground))">
                  {p.name.length > 14 ? p.name.slice(0, 14) + "…" : p.name}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}

      {relationships.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {relationships.map((r) => {
            const a = people.find((p) => p.id === r.fromId);
            const b = people.find((p) => p.id === r.toId);
            return (
              <span key={r.id} className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-muted">
                {a?.name} → <em>{r.type}</em> → {b?.name}
                <button onClick={() => removeRelationship(r.id)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add relationship</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>From</Label>
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select person" /></SelectTrigger>
                <SelectContent>
                  {people.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Relationship</Label>
              <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent of</SelectItem>
                  <SelectItem value="child">Child of</SelectItem>
                  <SelectItem value="spouse">Spouse of</SelectItem>
                  <SelectItem value="sibling">Sibling of</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>To</Label>
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select person" /></SelectTrigger>
                <SelectContent>
                  {people.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={save} className="w-full bg-gradient-primary hover:opacity-90">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
