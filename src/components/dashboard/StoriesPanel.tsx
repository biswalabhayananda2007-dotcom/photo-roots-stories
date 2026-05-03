import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TEMPLATES = [
  (n: string, y?: string) =>
    `In the warm light of a ${y ?? "long-ago"} afternoon, ${n} carried more than a name — they carried a whole household's hopes. The family still speaks of the way ${n.split(" ")[0]} would hum old folk songs while the kettle whistled, weaving small joys into the everyday.`,
  (n: string, y?: string) =>
    `${n} was born into a world${y ? ` in ${y}` : ""} that asked much and gave quietly. Yet across decades, a quiet courage shaped every choice — choices that ripple, even now, through the laughter of grandchildren who will never quite know the source.`,
  (n: string, y?: string) =>
    `They tell the story of ${n} the way you tell a treasured myth: half memory, half prayer. Every photograph${y ? ` from ${y} onward` : ""} is a small window into a life lived with grace, mischief, and stubborn love.`,
];

export const StoriesPanel = () => {
  const { stories, people, addStory, updateStory, removeStory } = useStore();
  const [prompt, setPrompt] = useState("");
  const [personId, setPersonId] = useState<string>("");
  const [generating, setGenerating] = useState(false);

  // TODO: Replace with Lovable AI Gateway call (e.g. lovable-gemini-2.5-flash) for real story generation.
  const generate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 700));
    const person = people.find((p) => p.id === personId);
    const name = person?.name ?? prompt ?? "your ancestor";
    const tpl = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    addStory({
      title: `The story of ${name}`,
      body: tpl(name, person?.birthYear),
      personId: personId || undefined,
    });
    setGenerating(false);
    setPrompt("");
    toast.success("Story generated");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Stories</h1>
        <p className="text-muted-foreground text-sm mt-1">Conjure short, editable narratives for every ancestor.</p>
      </div>

      <div className="p-6 rounded-2xl border border-border bg-card">
        <h3 className="font-display text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Generate a story
        </h3>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <Label>About a person</Label>
            <Select value={personId} onValueChange={setPersonId}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="(optional)" /></SelectTrigger>
              <SelectContent>
                {people.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-muted-foreground">Add people first</div>
                ) : (
                  people.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Or a free-form prompt</Label>
            <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="My great-aunt's bakery in Lisbon…" className="mt-1.5" />
          </div>
        </div>
        <Button onClick={generate} disabled={generating || (!personId && !prompt)} className="mt-5 bg-gradient-primary hover:opacity-90">
          <Sparkles className="h-4 w-4 mr-2" /> {generating ? "Weaving…" : "Generate story"}
        </Button>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
          <BookOpen className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-3 font-medium">No stories yet</p>
          <p className="text-sm text-muted-foreground">Generate your first one above.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {stories.map((s) => (
            <div key={s.id} className="p-6 rounded-2xl border border-border bg-card">
              <Input
                value={s.title}
                onChange={(e) => updateStory(s.id, { title: e.target.value })}
                className="font-display text-lg font-semibold border-0 px-0 focus-visible:ring-0"
              />
              <Textarea
                value={s.body}
                onChange={(e) => updateStory(s.id, { body: e.target.value })}
                rows={6}
                className="mt-2 resize-none border-0 px-0 focus-visible:ring-0 leading-relaxed"
              />
              <div className="flex justify-end">
                <Button size="sm" variant="ghost" onClick={() => removeStory(s.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
