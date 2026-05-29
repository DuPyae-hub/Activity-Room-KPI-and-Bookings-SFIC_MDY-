"use client";

import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteClubAction, upsertClubAction } from "@/actions/clubs";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

type ClubRow = {
  id: string;
  name: string;
  logo: string | null;
  description: string | null;
};

const emptyForm = {
  id: undefined as string | undefined,
  name: "",
  logo: "",
  description: "",
};

export function ClubManager({ clubs }: { clubs: ClubRow[] }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const result = await upsertClubAction({
        id: form.id,
        name: form.name,
        logo: form.logo || null,
        description: form.description || null,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setForm(emptyForm);
    });
  };

  const remove = (clubId: string) => {
    startTransition(async () => {
      const result = await deleteClubAction(clubId);
      if (!result.success) setError(result.error);
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <GlassCard className="p-5">
        <h3 className="mb-4 font-semibold">
          {form.id ? "Edit club" : "Add new club"}
        </h3>
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm text-foreground-muted">Club name</span>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
              placeholder="Strategy First … Club-MDY"
            />
          </label>
          <label className="block">
            <span className="text-sm text-foreground-muted">Logo (emoji)</span>
            <input
              value={form.logo}
              onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
              placeholder="🎵"
            />
          </label>
          <label className="block">
            <span className="text-sm text-foreground-muted">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-2">
            <Button variant="gold" disabled={isPending || !form.name.trim()} onClick={submit}>
              <Plus className="h-4 w-4" />
              {form.id ? "Save club" : "Add club"}
            </Button>
            {form.id && (
              <Button variant="secondary" onClick={() => setForm(emptyForm)}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </GlassCard>

      <div className="space-y-3">
        {clubs.map((club, i) => (
          <motion.div
            key={club.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <GlassCard className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="font-medium">
                  {club.logo ? `${club.logo} ` : ""}
                  {club.name}
                </p>
                {club.description && (
                  <p className="mt-1 text-sm text-foreground-muted">{club.description}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setForm({
                      id: club.id,
                      name: club.name,
                      logo: club.logo ?? "",
                      description: club.description ?? "",
                    })
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={isPending}
                  onClick={() => remove(club.id)}
                  aria-label={`Delete ${club.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
