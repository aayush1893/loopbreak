import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-md hover:shadow-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-input bg-background hover:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-md hover:shadow-lg",
        ghost: "hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline",
        action: "bg-accent text-accent-foreground hover:bg-accent-hover shadow-lg hover:shadow-xl scale-100 hover:scale-105",
        "lane-ground": "bg-lane-ground text-white hover:opacity-90 shadow-md",
        "lane-reframe": "bg-lane-reframe text-white hover:opacity-90 shadow-md",
        "lane-act": "bg-lane-act text-white hover:opacity-90 shadow-md",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-16 rounded-xl px-10 text-lg",
        xl: "h-20 rounded-xl px-12 text-xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
