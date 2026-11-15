import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/overlays";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form-controls";
import { FormField, SimpleSelect } from "@/components/common/misc";
import { BAND_OPTIONS, COUNTRIES } from "@/utils/constants";
import { isValidEmail } from "@/utils/format";

const EMPTY = { name: "", email: "", country: "", targetBand: "7.0", status: "active", currentDay: "1" };

/** Create / edit dialog for a student account. `existingEmails` is used for duplicate validation. */
export default function StudentForm({ open, onOpenChange, initial, onSubmit, existingEmails = [], defaultTargetBand = "7.0" }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      initial
        ? { name: initial.name, email: initial.email, country: initial.country, targetBand: Number(initial.targetBand).toFixed(1), status: initial.status, currentDay: String(initial.currentDay) }
        : { ...EMPTY, targetBand: defaultTargetBand }
    );
  }, [open, initial, defaultTargetBand]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v?.target ? v.target.value : v }));

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter the student's full name.";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    else if (existingEmails.some((x) => x.toLowerCase() === form.email.trim().toLowerCase() && x.toLowerCase() !== initial?.email?.toLowerCase()))
      next.email = "Another student already uses this email.";
    if (!form.country) next.country = "Select a country.";
    const day = Number(form.currentDay);
    if (!Number.isInteger(day) || day < 1 || day > 60) next.currentDay = "Day must be between 1 and 60.";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit({ ...form, name: form.name.trim(), email: form.email.trim().toLowerCase(), targetBand: Number(form.targetBand), currentDay: day });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit student" : "Add student"}</DialogTitle>
          <DialogDescription>{initial ? "Update this mock student account." : "Create a new mock student account. It is stored in this browser only."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full name" htmlFor="s-name" required error={errors.name}>
              <Input id="s-name" value={form.name} onChange={set("name")} className={errors.name && "border-destructive"} />
            </FormField>
            <FormField label="Email" htmlFor="s-email" required error={errors.email}>
              <Input id="s-email" type="email" value={form.email} onChange={set("email")} className={errors.email && "border-destructive"} />
            </FormField>
            <FormField label="Country" htmlFor="s-country" required error={errors.country}>
              <SimpleSelect id="s-country" value={form.country || undefined} onValueChange={set("country")} options={COUNTRIES} invalid={!!errors.country} placeholder="Select country" />
            </FormField>
            <FormField label="Target band" htmlFor="s-band">
              <SimpleSelect id="s-band" value={form.targetBand} onValueChange={set("targetBand")} options={BAND_OPTIONS} />
            </FormField>
            <FormField label="Current day" htmlFor="s-day" error={errors.currentDay} hint="Preparation day 1–60">
              <Input id="s-day" type="number" min={1} max={60} value={form.currentDay} onChange={set("currentDay")} className={errors.currentDay && "border-destructive"} />
            </FormField>
            <FormField label="Status" htmlFor="s-status">
              <SimpleSelect id="s-status" value={form.status} onValueChange={set("status")} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} />
            </FormField>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{initial ? "Save changes" : "Add student"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
