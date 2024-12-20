import * as React from "react";
import { CheckIcon } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface SelectAllProps {
  isAllSelected: boolean;
  onToggleAll: () => void;
}

export function SelectAll({ isAllSelected, onToggleAll }: SelectAllProps) {
  return (
    <CommandItem key="select-all" onSelect={onToggleAll} className="cursor-pointer">
      <div
        className={cn(
          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
          isAllSelected
            ? "bg-primary text-primary-foreground"
            : "opacity-50 [&_svg]:invisible"
        )}
      >
        <CheckIcon className="h-4 w-4" />
      </div>
      <span>Select All</span>
    </CommandItem>
  );
}