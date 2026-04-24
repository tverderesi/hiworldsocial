import * as React from "react";
import { cn } from "../../lib/utils";

type Variant = "default" | "outline" | "destructive" | "ghost";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "btn-base",
          variant === "default" && "btn-default",
          variant === "outline" && "btn-outline",
          variant === "destructive" && "btn-destructive",
          variant === "ghost" && "btn-ghost",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
