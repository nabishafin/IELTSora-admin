import * as React from "react";
import { cn } from "@/lib/utils";

export const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-x-auto scrollbar-thin">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
));
Table.displayName = "Table";
export const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-subtle/80 [&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";
export const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";
export const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("border-b border-border transition-colors hover:bg-subtle/60", className)} {...props} />
));
TableRow.displayName = "TableRow";
export const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn("h-10 whitespace-nowrap px-4 text-left align-middle text-xs font-medium text-muted-foreground", className)}
    {...props}
  />
));
TableHead.displayName = "TableHead";
export const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("px-4 py-3 align-middle", className)} {...props} />
));
TableCell.displayName = "TableCell";
