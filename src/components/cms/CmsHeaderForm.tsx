
"use client";

import * as React from "react";
import { useForm, useFieldArray, useTransition } from "react-hook-form";
import type { CmsHeaderDoc, CmsNavLink } from "@/lib/types/cmsHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type Props = { initial: CmsHeaderDoc };

export default function CmsHeaderForm({ initial }: Props) {
  const [isSaving, startTransition] = useTransition();
  const { toast } = useToast();
  const { register, handleSubmit, control, watch } = useForm<CmsHeaderDoc>({
    defaultValues: initial,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "appearance.navLinks",
  });

  const onSubmit = async (data: CmsHeaderDoc) => {
    startTransition(async () => {
      try {
        const res = await fetch("/cms/pages/header/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Der opstod en serverfejl.");
        toast({
          title: "Gemt!",
          description: "Dine header-indstillinger er blevet opdateret.",
        });
      } catch (error: any) {
        toast({
          title: "Fejl",
          description: error.message || "Kunne ikke gemme indstillingerne.",
          variant: "destructive",
        });
      }
    });
  };

  const bg = watch("appearance.topBg");
  const scrolled = watch("appearance.scrolledBg");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      <section className="p-6 border rounded-lg space-y-4">
        <h2 className="text-lg font-semibold">Grundlæggende</h2>
        <div className="grid grid-cols-2 gap-4">
          <Label className="flex flex-col gap-2">
            <span>Header højde (px)</span>
            <Input type="number" {...register("appearance.headerHeight", { valueAsNumber: true })} />
          </Label>

          <div className="flex items-center gap-2 pt-8">
            <Checkbox id="is-sticky" {...register("appearance.headerIsSticky")} />
            <Label htmlFor="is-sticky">Sticky</Label>
          </div>

          <Label className="flex flex-col gap-2">
            <span>Link farve</span>
            <Select onValueChange={(v) => control.setValue("appearance.headerLinkColor", v as "black"|"white")} defaultValue={watch("appearance.headerLinkColor")}>
              <SelectTrigger>
                <SelectValue placeholder="Vælg farve" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="black">Sort</SelectItem>
                <SelectItem value="white">Hvid</SelectItem>
              </SelectContent>
            </Select>
          </Label>

          <div className="flex items-center gap-2 pt-8">
            <Checkbox id="is-overlay" {...register("appearance.isOverlay")} />
            <Label htmlFor="is-overlay">Overlay (transparent baggrund)</Label>
          </div>
        </div>
      </section>

      <section className="p-6 border rounded-lg space-y-4">
        <h2 className="text-lg font-semibold">Logo</h2>
        <div className="grid grid-cols-2 gap-4">
            <Label className="flex flex-col gap-2">
              <span>Logo URL</span>
              <Input {...register("appearance.logo.src")} />
            </Label>
            <Label className="flex flex-col gap-2">
              <span>Logo alt-tekst</span>
              <Input {...register("appearance.logo.alt")} />
            </Label>
            <Label className="flex flex-col gap-2">
              <span>Logo max bredde (px)</span>
              <Input type="number" {...register("appearance.logo.maxWidth", { valueAsNumber: true })} />
            </Label>
            <Label className="flex flex-col gap-2">
              <span>Header logo bredde (px)</span>
              <Input type="number" {...register("appearance.headerLogoWidth", { valueAsNumber: true })} />
            </Label>
        </div>
      </section>

      <section className="p-6 border rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Navigation</h3>
          <Button
            type="button"
            onClick={() => append({ label: "Nyt link", href: "/" } as CmsNavLink)}
            variant="outline"
          >
            + Tilføj link
          </Button>
        </div>
        <div className="space-y-3">
          {fields.map((f, idx) => (
            <div key={f.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
              <Label className="md:col-span-2 flex flex-col gap-1">
                <span className="text-sm">Label</span>
                <Input {...register(`appearance.navLinks.${idx}.label` as const)} />
              </Label>
              <Label className="md:col-span-2 flex flex-col gap-1">
                <span className="text-sm">Href</span>
                <Input {...register(`appearance.navLinks.${idx}.href` as const)} />
              </Label>
              <Button type="button" onClick={() => remove(idx)} variant="ghost" className="text-destructive hover:text-destructive w-full md:w-auto justify-start md:justify-center">
                Fjern
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="p-6 border rounded-lg space-y-4">
        <h2 className="text-lg font-semibold">Farver & Baggrund</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium">Top-baggrund</h4>
            <div className="grid grid-cols-4 gap-2">
              <Input type="number" min={0} max={360} {...register("appearance.topBg.h", { valueAsNumber: true })} placeholder="H" />
              <Input type="number" min={0} max={100}  {...register("appearance.topBg.s", { valueAsNumber: true })} placeholder="S" />
              <Input type="number" min={0} max={100}  {...register("appearance.topBg.l", { valueAsNumber: true })} placeholder="L" />
              <Input type="number" min={0} max={1} step={0.01} {...register("appearance.topBg.opacity", { valueAsNumber: true })} placeholder="Alpha" />
            </div>
            <div className="h-8 rounded border" style={{ background: `hsla(${bg?.h ?? 0},${bg?.s ?? 0}%,${bg?.l ?? 0}%,${bg?.opacity ?? 1})` }} />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Scrolled baggrund</h4>
            <div className="grid grid-cols-4 gap-2">
              <Input type="number" min={0} max={360} {...register("appearance.scrolledBg.h", { valueAsNumber: true })} placeholder="H" />
              <Input type="number" min={0} max={100}  {...register("appearance.scrolledBg.s", { valueAsNumber: true })} placeholder="S" />
              <Input type="number" min={0} max={100}  {...register("appearance.scrolledBg.l", { valueAsNumber: true })} placeholder="L" />
              <Input type="number" min={0} max={1} step={0.01} {...register("appearance.scrolledBg.opacity", { valueAsNumber: true })} placeholder="Alpha" />
            </div>
            <div className="h-8 rounded border" style={{ background: `hsla(${scrolled?.h ?? 0},${scrolled?.s ?? 0}%,${scrolled?.l ?? 0}%,${scrolled?.opacity ?? 1})` }} />
          </div>
        </div>
      </section>

      <section className="p-6 border rounded-lg space-y-4">
        <h2 className="text-lg font-semibold">Kantlinje (under header)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 pt-6">
            <Checkbox id="border-enabled" {...register("appearance.border.enabled")} />
            <Label htmlFor="border-enabled">Vis kantlinje</Label>
          </div>
          <Label className="flex flex-col gap-1">
            <span>Bredde (px)</span>
            <Input type="number" {...register("appearance.border.widthPx", { valueAsNumber: true })} />
          </Label>
          <Label className="flex flex-col gap-1">
            <span>Farve (hex)</span>
            <Input {...register("appearance.border.colorHex")} />
          </Label>
        </div>
      </section>

      <div className="pt-4">
        <Button type="submit" size="lg" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Gem ændringer
        </Button>
      </div>
    </form>
  );
}
