import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { Check } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* Input */
export const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-10 w-full border border-border bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ink disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

/* Textarea */
export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[90px] w-full border border-border bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ink disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

/* Label */
export const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn("text-sm font-medium leading-none", className)} {...props} />
));
Label.displayName = "Label";

/* Badge */
export const badgeVariants = cva(
  "inline-flex items-center gap-1 border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-ink bg-ink text-white",
        outline: "border-border bg-white text-ink",
        muted: "border-transparent bg-subtle text-muted-foreground",
        success: "border-green-700/20 bg-green-50 text-green-800",
        warning: "border-amber-600/20 bg-amber-50 text-amber-800",
        danger: "border-red-700/20 bg-red-50 text-red-800",
      },
    },
    defaultVariants: { variant: "default" },
  }
);
export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/* Progress */
export const Progress = React.forwardRef(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root ref={ref} className={cn("relative h-1.5 w-full overflow-hidden bg-neutral-200", className)} {...props}>
    <ProgressPrimitive.Indicator
      className={cn("h-full w-full flex-1 bg-ink transition-all duration-500", indicatorClassName)}
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
      "peer h-4 w-4 shrink-0 border border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-50 data-[state=checked]:bg-ink data-[state=checked]:text-white",
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
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center border border-ink transition-colors disabled:opacity-50 data-[state=checked]:bg-ink data-[state=unchecked]:bg-white",
      className
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb className="pointer-events-none block h-3.5 w-3.5 transition-transform data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-white data-[state=unchecked]:translate-x-[2px] data-[state=unchecked]:bg-ink" />
  </SwitchPrimitives.Root>
));
Switch.displayName = "Switch";

/* Radio group (small circular indicator is an allowed exception) */
export const RadioGroup = React.forwardRef(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />
));
RadioGroup.displayName = "RadioGroup";
export const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn("aspect-square h-4 w-4 shrink-0 rounded-full border border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-50", className)}
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
