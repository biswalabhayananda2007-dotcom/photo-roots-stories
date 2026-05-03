import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Upload, X, Tag } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const PhotosPanel = () => {
  const { photos, addPhoto, removePhoto, people, tagPhoto } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [tagging, setTagging] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => addPhoto(reader.result as string);
      reader.readAsDataURL(file);
    });
    toast.success(`${files.length} photo(s) uploaded`);
    // TODO: Upload to Supabase Storage 'photos' bucket and persist URL.
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Photos</h1>
          <p className="text-muted-foreground text-sm mt-1">Upload, tag faces, and preserve every memory.</p>
        </div>
        <Button onClick={() => inputRef.current?.click()} className="bg-gradient-primary hover:opacity-90">
          <Upload className="h-4 w-4 mr-2" /> Upload
        </Button>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"
        }`}
      >
        <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
        <p className="mt-3 font-medium">Drop photos here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 20MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {photos.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Your gallery is waiting for its first memory.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((p) => (
            <div key={p.id} className="group relative vintage-frame aspect-square">
              <img src={p.url} alt="Family photo" className="w-full h-full object-cover" />
              {/* Placeholder face-detection box */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button
                    onClick={() => setTagging(p.id)}
                    className="p-1.5 rounded-full bg-card/90 hover:bg-card text-foreground"
                    aria-label="Tag people"
                  >
                    <Tag className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => removePhoto(p.id)}
                    className="p-1.5 rounded-full bg-card/90 hover:bg-destructive hover:text-destructive-foreground"
                    aria-label="Delete"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {p.taggedPeopleIds.length > 0 && (
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
                    {p.taggedPeopleIds.map((id) => {
                      const person = people.find((x) => x.id === id);
                      return person ? (
                        <span key={id} className="text-xs px-2 py-0.5 rounded-full bg-card/90 text-foreground">
                          {person.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                {/* Decorative face placeholder */}
                <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 border-2 border-primary-glow/80 rounded-md opacity-60" />
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!tagging} onOpenChange={(o) => !o && setTagging(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tag people in this photo</DialogTitle>
          </DialogHeader>
          {people.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add people first in the People tab.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {people.map((p) => (
                <Button
                  key={p.id}
                  variant="outline"
                  onClick={() => {
                    if (tagging) tagPhoto(tagging, p.id);
                    toast.success(`Tagged ${p.name}`);
                  }}
                >
                  {p.name}
                </Button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
