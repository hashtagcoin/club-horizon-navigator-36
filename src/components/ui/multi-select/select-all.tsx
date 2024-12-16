import React from 'react';
import { CommandItem } from "@/components/ui/command";
import { CheckIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface SelectAllOptionProps {
  isAllSelected: boolean;
  onToggleAll: () => void;
}

export const SelectAllOption = ({
  isAllSelected,
  onToggleAll
}: SelectAllOptionProps) => {
  return (
    <CommandItem
      key="select-all"
      onSelect={onToggleAll}
      className="cursor-pointer"
    >
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
};