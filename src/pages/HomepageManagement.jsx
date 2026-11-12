import { useEffect, useMemo, useState } from "react";
import { Save, Undo2, RotateCcw, Download, Plus, ArrowUp, ArrowDown, Trash2, Star, ChevronDown } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { FormField, SectionTitle } from "@/components/common/misc";
import { Input, Textarea, Badge } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/overlays";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/hooks/useLocalStorage";
import { resetStore } from "@/utils/storage";
import { downloadContentExport } from "@/utils/contentSync";
import { isValidEmail } from "@/utils/format";
import { cn } from "@/lib/utils";

const clone = (v) => JSON.parse(JSON.stringify(v));

/** Editable list of objects with add / remove / reorder. `fields` = [{ key, label, multiline, width }]. */
function ObjectListEditor({ items, onChange, fields, addLabel, blank, errorsFor, max }) {
  const update = (i, k, v) => onChange(items.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const n = [...items];
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  return (
    <div className="grid gap-3">
      {items.map((it, i) => (
        <div key={i} className="surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="label-xs">#{i + 1}</span>
            <div className="flex">
              <Button type="button" variant="ghost" size="icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><ArrowUp /></Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down"><ArrowDown /></Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 /></Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-6">
            {fields.map((f) => {
              const err = errorsFor?.(i, f.key);
              const C = f.multiline ? Textarea : Input;
              return (
                <FormField key={f.key} label={f.label} error={err} className={f.width || "sm:col-span-6"}>
                  <C value={it[f.key] ?? ""} onChange={(e) => update(i, f.key, e.target.value)} className={cn(f.multiline && "min-h-[70px]", err && "border-destructive")} />
                </FormField>
              );
            })}
          </div>
        </div>
      ))}
      {(max === undefined || items.length < max) && (
        <Button type="button" variant="secondary" className="justify-self-start" onClick={() => onChange([...items, { ...blank }])}><Plus /> {addLabel}</Button>
      )}
    </div>
  );
}

function Preview({ hp }) {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <div className="text-ink">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5 text-[11.5px]">
        <span className="font-semibold">IELTSora</span>
        <span className="text-muted-foreground">Home · How it works · Study plan · Practice</span>
      </div>
      <section className="px-5 py-8">
        <h1 className="text-xl font-semibold leading-tight tracking-tight">{hp.heroTitle || "Hero title"}</h1>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{hp.heroDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-white">{hp.primaryCta || "Primary CTA"}</span>
          <span className="rounded-md border border-input bg-white px-3 py-1.5 text-xs font-medium">{hp.secondaryCta || "Secondary CTA"}</span>
        </div>
      </section>
      <section className="border-t border-border bg-subtle px-5 py-6">
        <p className="label-xs">Features</p>
        <div className="tiles mt-3 grid-cols-2 rounded-lg shadow-none">
          {hp.features.map((f, i) => (
            <div key={i} className="bg-white p-3">
              <p className="text-xs font-semibold">{f.title}</p>
              <p className="mt-1 line-clamp-3 text-[11.5px] text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="border-t border-border px-5 py-6">
        <p className="label-xs">Testimonials</p>
        <div className="mt-3 grid gap-2">
          {hp.testimonials.map((t, i) => (
            <div key={i} className="rounded-lg border border-border bg-white p-3">
              <p className="text-xs leading-4">“{t.quote}”</p>
              <p className="mt-2 flex items-center justify-between text-[11.5px]">
                <span><strong>{t.name}</strong> · {t.role}</span>
                <span className="inline-flex items-center gap-0.5 font-semibold"><Star className="h-2.5 w-2.5" /> Band {t.band}</span>
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="border-t border-border px-5 py-6">
        <p className="label-xs">FAQ</p>
        <div className="mt-3 border-t border-border">
          {hp.faqs.map((f, i) => (
            <div key={i} className="border-b border-border">
              <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="flex w-full items-center justify-between py-2 text-left text-xs font-medium">
                {f.q} <ChevronDown className={cn("h-3 w-3 transition-transform", openFaq === i && "rotate-180")} />
              </button>
              {openFaq === i && <p className="pb-2 text-[11.5px] text-muted-foreground">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
      <footer className="bg-[#1B1B1B] px-5 py-5 text-[11.5px] text-neutral-300">
        <p className="font-semibold text-white">IELTSora</p>
        <p className="mt-1">{hp.footer.tagline}</p>
        <p className="mt-2">{hp.footer.email} · {hp.footer.phone}</p>
        <p>{hp.footer.address}</p>
      </footer>
    </div>
  );
}

export default function HomepageManagement() {
  const [homepage, setHomepage] = useStore("homepage");
  const toast = useToast();
  const [draft, setDraft] = useState(() => clone(homepage));
  const [errors, setErrors] = useState({});
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => setDraft(clone(homepage)), [homepage]);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(homepage), [draft, homepage]);
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const validate = () => {
    const e = {};
    if (draft.heroTitle.trim().length < 5) e.heroTitle = "Hero title must be at least 5 characters.";
    if (draft.heroDescription.trim().length < 20) e.heroDescription = "Hero description must be at least 20 characters.";
    if (!draft.primaryCta.trim()) e.primaryCta = "Primary CTA text is required.";
    if (!draft.secondaryCta.trim()) e.secondaryCta = "Secondary CTA text is required.";
    draft.features.forEach((f, i) => {
      if (!f.title.trim()) e[`features.${i}.title`] = "Title required.";
      if (!f.description.trim()) e[`features.${i}.description`] = "Description required.";
    });
    draft.testimonials.forEach((t, i) => {
      if (!t.name.trim()) e[`testimonials.${i}.name`] = "Name required.";
      if (!t.quote.trim()) e[`testimonials.${i}.quote`] = "Quote required.";
      if (t.band && !/^\d(\.[05])?$/.test(String(t.band).trim())) e[`testimonials.${i}.band`] = "Use a band like 7.5.";
    });
    draft.faqs.forEach((f, i) => {
      if (!f.q.trim()) e[`faqs.${i}.q`] = "Question required.";
      if (!f.a.trim()) e[`faqs.${i}.a`] = "Answer required.";
    });
    if (!isValidEmail(draft.footer.email)) e["footer.email"] = "Enter a valid email.";
    if (draft.features.length < 3) e.features = "Add at least three features.";
    return e;
  };

  const save = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      toast({ title: "Homepage not saved", description: `${Object.keys(e).length} field(s) need attention.`, variant: "error" });
      return;
    }
    setHomepage(draft);
    toast({ title: "Homepage content saved", description: "Export the content file to update the student website.", variant: "success" });
  };

  const errorsFor = (group) => (i, k) => errors[`${group}.${i}.${k}`];
  const HERO_KEYS = ["heroTitle", "heroDescription", "primaryCta", "secondaryCta"];
  const errorCount = (prefix) => Object.keys(errors).filter((k) => (prefix === "hero" ? HERO_KEYS.includes(k) : k.startsWith(prefix))).length;
  const tabLabel = (label, prefix) => (
    <>
      {label}
      {errorCount(prefix) > 0 && <span className="ml-1 rounded-full bg-destructive px-1.5 text-[11.5px] text-white">{errorCount(prefix)}</span>}
    </>
  );

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Homepage content"
        description="Edit the public website's hero, features, testimonials, FAQs and footer. Export the content file and import it in the website to apply changes there."
        actions={
          <>
            {dirty && <Badge variant="warning">Unsaved changes</Badge>}
            <Button variant="secondary" onClick={() => setConfirmReset(true)}><RotateCcw /> Reset</Button>
            <Button
              variant="secondary"
              disabled={dirty}
              title={dirty ? "Save your changes before exporting" : undefined}
              onClick={() => {
                downloadContentExport();
                toast({ title: "Content exported", description: "Import this JSON in the student website (Settings → Content sync).", variant: "success" });
              }}
            >
              <Download /> Export
            </Button>
            <Button variant="secondary" onClick={() => { setDraft(clone(homepage)); setErrors({}); }} disabled={!dirty}><Undo2 /> Discard</Button>
            <Button onClick={save} disabled={!dirty}><Save /> Save</Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <Tabs defaultValue="hero">
          <TabsList>
            <TabsTrigger value="hero">{tabLabel("Hero", "hero")}</TabsTrigger>
            <TabsTrigger value="features">{tabLabel(`Features (${draft.features.length})`, "features")}</TabsTrigger>
            <TabsTrigger value="testimonials">{tabLabel(`Testimonials (${draft.testimonials.length})`, "testimonials")}</TabsTrigger>
            <TabsTrigger value="faqs">{tabLabel(`FAQs (${draft.faqs.length})`, "faqs")}</TabsTrigger>
            <TabsTrigger value="footer">{tabLabel("Footer", "footer")}</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="surface grid gap-4 p-5">
            <FormField label="Hero title" required error={errors.heroTitle}>
              <Input value={draft.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} className={errors.heroTitle && "border-destructive"} />
            </FormField>
            <FormField label="Hero description" required error={errors.heroDescription} hint={`${draft.heroDescription.length} characters`}>
              <Textarea value={draft.heroDescription} onChange={(e) => set("heroDescription", e.target.value)} className={errors.heroDescription && "border-destructive"} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Primary CTA" required error={errors.primaryCta}>
                <Input value={draft.primaryCta} onChange={(e) => set("primaryCta", e.target.value)} className={errors.primaryCta && "border-destructive"} />
              </FormField>
              <FormField label="Secondary CTA" required error={errors.secondaryCta}>
                <Input value={draft.secondaryCta} onChange={(e) => set("secondaryCta", e.target.value)} className={errors.secondaryCta && "border-destructive"} />
              </FormField>
            </div>
          </TabsContent>

          <TabsContent value="features">
            {errors.features && <p className="mb-3 text-xs text-destructive">{errors.features}</p>}
            <ObjectListEditor
              items={draft.features}
              onChange={(v) => set("features", v)}
              fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]}
              blank={{ title: "", description: "" }}
              addLabel="Add feature"
              errorsFor={errorsFor("features")}
              max={9}
            />
          </TabsContent>

          <TabsContent value="testimonials">
            <ObjectListEditor
              items={draft.testimonials}
              onChange={(v) => set("testimonials", v)}
              fields={[
                { key: "name", label: "Name", width: "sm:col-span-2" },
                { key: "role", label: "Role / location", width: "sm:col-span-3" },
                { key: "band", label: "Band", width: "sm:col-span-1" },
                { key: "quote", label: "Quote", multiline: true },
              ]}
              blank={{ name: "", role: "", band: "7.0", quote: "" }}
              addLabel="Add testimonial"
              errorsFor={errorsFor("testimonials")}
            />
          </TabsContent>

          <TabsContent value="faqs">
            <ObjectListEditor
              items={draft.faqs}
              onChange={(v) => set("faqs", v)}
              fields={[{ key: "q", label: "Question" }, { key: "a", label: "Answer", multiline: true }]}
              blank={{ q: "", a: "" }}
              addLabel="Add FAQ"
              errorsFor={errorsFor("faqs")}
            />
          </TabsContent>

          <TabsContent value="footer" className="surface grid gap-4 p-5 sm:grid-cols-2">
            <FormField className="sm:col-span-2" label="Tagline">
              <Input value={draft.footer.tagline} onChange={(e) => set("footer", { ...draft.footer, tagline: e.target.value })} />
            </FormField>
            <FormField label="Contact email" required error={errors["footer.email"]}>
              <Input type="email" value={draft.footer.email} onChange={(e) => set("footer", { ...draft.footer, email: e.target.value })} className={errors["footer.email"] && "border-destructive"} />
            </FormField>
            <FormField label="Phone">
              <Input value={draft.footer.phone} onChange={(e) => set("footer", { ...draft.footer, phone: e.target.value })} />
            </FormField>
            <FormField className="sm:col-span-2" label="Address">
              <Input value={draft.footer.address} onChange={(e) => set("footer", { ...draft.footer, address: e.target.value })} />
            </FormField>
          </TabsContent>
        </Tabs>

        <aside className="surface h-fit overflow-hidden xl:sticky xl:top-24">
          <SectionTitle className="mb-0 border-b border-border px-4 py-3">Live preview</SectionTitle>
          <div className="max-h-[72vh] overflow-y-auto scrollbar-thin">
            <Preview hp={draft} />
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset homepage content?"
        description="All homepage text will return to the default content. This cannot be undone."
        confirmLabel="Reset content"
        destructive
        onConfirm={() => {
          resetStore("homepage");
          setErrors({});
          toast({ title: "Homepage reset", variant: "success" });
        }}
      />
    </div>
  );
}
