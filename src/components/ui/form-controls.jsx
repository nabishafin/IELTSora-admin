import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { Check } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const field =
  "flex w-full rounded-lg border border-input bg-white px-3 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-black/10 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive";

/* Input */
export const Input = React.forwardRef(({ className, type, ...props }, ref) => <input type={type} ref={ref} className={cn(field, "h-9 py-2", className)} {...props} />);
Input.displayName = "Input";

/* Textarea */
export const Textarea = React.forwardRef(({ className, ...props }, ref) => <textarea ref={ref} className={cn(field, "min-h-[90px] py-2", className)} {...props} />);
Textarea.displayName = "Textarea";

/* Label */
export const Label = React.forwardRef(({ className, ...props }, ref) => <LabelPrimitive.Root ref={ref} className={cn("text-sm font-medium leading-none", className)} {...props} />);
Label.displayName = "Label";

/* Badge (pill) */
export const badgeVariants = cva("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap", {
  variants: {
    variant: {
      default: "border-transparent bg-ink text-white",
      outline: "border-input bg-white text-ink",
      muted: "border-transparent bg-black/[0.06] text-muted-foreground",
      success: "border-transparent bg-[#198100]/10 text-[#156b00]",
      warning: "border-transparent bg-[#FFCE2F]/25 text-[#7a5a00]",
      danger: "border-transparent bg-[#C9303A]/10 text-[#a8242d]",
      info: "border-transparent bg-[#0074E2]/10 text-[#005fb8]",
    },
  },
  defaultVariants: { variant: "default" },
});
export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/* Progress */
export const Progress = React.forwardRef(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root ref={ref} className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-black/[0.08]", className)} {...props}>
    <ProgressPrimitive.Indicator
      className={cn("h-full w-full flex-1 rounded-full bg-ink transition-all duration-500", indicatorClassName)}
      style={{ transform: "translateX(-" + (100 - Math.min(100, Math.max(0, value || 0))) + "%)" }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = "Progress";

/* Checkbox */
export const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-[5px] border border-input bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-50 data-[state=checked]:border-ink data-[state=checked]:bg-ink data-[state=checked]:text-white",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center">
      <Check className="h-3.5 w-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

/* Switch */
export const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:opacity-50 data-[state=checked]:bg-ink data-[state=unchecked]:bg-black/[0.15]",
      className
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb className="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-low transition-transform data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-[2px]" />
  </SwitchPrimitives.Root>
));
Switch.displayName = "Switch";

/* Radio group */
export const RadioGroup = React.forwardRef(({ className, ...props }, ref) => <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />);
RadioGroup.displayName = "RadioGroup";
export const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn("aspect-square h-4 w-4 shrink-0 rounded-full border border-input bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-50 data-[state=checked]:border-ink", className)}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span className="h-2 w-2 rounded-full bg-ink" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";

/* Separator */
export function Separator({ className, orientation = "horizontal" }) {
  return <div className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)} />;
}
