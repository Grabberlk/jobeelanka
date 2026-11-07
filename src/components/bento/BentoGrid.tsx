import React from "react";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 auto-rows-[minmax(180px,auto)]",
        className
      )}
    >
      {children}
    </div>
  );
};

