import { useState } from "react";
import { useStore, Person } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export const PeoplePanel = () => {
  const { people, addPerson, updatePerson, removePerson } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Person | null>(null);
  const [form, setForm] = useState({ name: "", birthYear: "", notes: "" });

  const openNew = () => { setEditing(null); setForm({ name: "", birthYear: "", notes: "" }); setOpen(true); };
  const openEdit = (p: Person) => { setEditing(p); setForm({ name: p.name, birthYear: p.birthYear ?? "", notes: p.notes ?? "" }); setOpen(true); };

  const save = () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (editing) { updatePerson(editing.id, form); toast.success("Updated"); }
    else { addPerson(form); toast.success("Person added"); }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">People</h1>
          <p className="text-muted-foreground text-sm mt-1">Every name, every face — preserved.</p>
        </div>
        <Button onClick={openNew} className="bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" /> Add person
        </Button>
      </div>

      {people.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
          <User className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-3 font-medium">No one here yet</p>
          <p className="text-sm text-muted-foreground">Add your first family member to start building your tree.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl bg-card border border-border hover:shadow-soft transition">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-vintage flex items-center justify-center text-ink font-display text-lg font-semibold flex-shrink-0">
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-semibold truncate">{p.name}</h3>
                  {p.birthYear && <p className="text-xs text-muted-foreground">b. {p.birthYear}</p>}
                  {p.notes && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.notes}</p>}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(p)} className="flex-1">
                  <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { removePerson(p.id); toast.success("Removed"); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit person" : "Add person"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label>Birth year</Label>
              <Input value={form.birthYear} onChange={(e) => setForm({ ...form, birthYear: e.target.value })} placeholder="1942" className="mt-1.5" />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Lived in Calcutta, loved jasmine tea…" className="mt-1.5" />
            </div>
            <Button onClick={save} className="w-full bg-gradient-primary hover:opacity-90">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
