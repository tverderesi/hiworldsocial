import * as React from "react";
import { cn } from "../../lib/utils";

export function Alert({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("alert", className)} {...props} />;
}
