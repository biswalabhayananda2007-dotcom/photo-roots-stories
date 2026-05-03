// Lightweight global store for Ancestra AI mock data.
// Auth is handled by Supabase; this store holds local UI/photo data.
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Person = {
  id: string;
  name: string;
  birthYear?: string;
  notes?: string;
};

export type Relationship = {
  id: string;
  fromId: string;
  toId: string;
  type: "parent" | "spouse" | "sibling" | "child";
};

export type Photo = {
  id: string;
  url: string;
  caption?: string;
  taggedPeopleIds: string[];
  createdAt: number;
};

export type Story = {
  id: string;
  title: string;
  body: string;
  personId?: string;
  createdAt: number;
};

export type AuthUser = { name: string; email: string } | null;

type State = {
  user: AuthUser;
  photos: Photo[];
  people: Person[];
  relationships: Relationship[];
  stories: Story[];
  setUser: (u: AuthUser) => void;
  logout: () => void;
  addPhoto: (url: string) => void;
  removePhoto: (id: string) => void;
  tagPhoto: (photoId: string, personId: string) => void;
  addPerson: (p: Omit<Person, "id">) => string;
  updatePerson: (id: string, p: Partial<Person>) => void;
  removePerson: (id: string) => void;
  addRelationship: (r: Omit<Relationship, "id">) => void;
  removeRelationship: (id: string) => void;
  addStory: (s: Omit<Story, "id" | "createdAt">) => void;
  updateStory: (id: string, s: Partial<Story>) => void;
  removeStory: (id: string) => void;
};

const uid = () => Math.random().toString(36).slice(2, 10);

export const useStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      photos: [],
      people: [],
      relationships: [],
      stories: [],
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      addPhoto: (url) =>
        set((s) => ({ photos: [{ id: uid(), url, taggedPeopleIds: [], createdAt: Date.now() }, ...s.photos] })),
      removePhoto: (id) => set((s) => ({ photos: s.photos.filter((p) => p.id !== id) })),
      tagPhoto: (photoId, personId) =>
        set((s) => ({
          photos: s.photos.map((p) =>
            p.id === photoId && !p.taggedPeopleIds.includes(personId)
              ? { ...p, taggedPeopleIds: [...p.taggedPeopleIds, personId] }
              : p,
          ),
        })),
      addPerson: (p) => {
        const id = uid();
        set((s) => ({ people: [...s.people, { id, ...p }] }));
        return id;
      },
      updatePerson: (id, p) => set((s) => ({ people: s.people.map((x) => (x.id === id ? { ...x, ...p } : x)) })),
      removePerson: (id) =>
        set((s) => ({
          people: s.people.filter((x) => x.id !== id),
          relationships: s.relationships.filter((r) => r.fromId !== id && r.toId !== id),
        })),
      addRelationship: (r) => set((s) => ({ relationships: [...s.relationships, { id: uid(), ...r }] })),
      removeRelationship: (id) => set((s) => ({ relationships: s.relationships.filter((r) => r.id !== id) })),
      addStory: (s2) =>
        set((s) => ({ stories: [{ id: uid(), createdAt: Date.now(), ...s2 }, ...s.stories] })),
      updateStory: (id, s2) =>
        set((s) => ({ stories: s.stories.map((x) => (x.id === id ? { ...x, ...s2 } : x)) })),
      removeStory: (id) => set((s) => ({ stories: s.stories.filter((x) => x.id !== id) })),
    }),
    { name: "ancestra-store", partialize: (s) => ({ photos: s.photos, people: s.people, relationships: s.relationships, stories: s.stories }) },
  ),
);
