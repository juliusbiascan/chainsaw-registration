"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface EmptyPlaceholderProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  showButton?: boolean;
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function EmptyPlaceholder({
  icon,
  title,
  description,
  showButton = true,
  buttonLabel = "Add New",
  buttonIcon,
  children,
  className,
}: EmptyPlaceholderProps) {
  return (
    <div className={cn(
      "flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed",
      className
    )}>
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {icon && icon}
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">{description}</p>
        {showButton && children}
      </div>
    </div>
  );
}
