import * as React from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface MultiSelectContentProps {
  options: { label: string; value: string }[];
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
  showSelectAll?: boolean;
  onClose: () => void;
}

export const MultiSelectContent: React.FC<MultiSelectContentProps> = ({
  options,
  selectedValues,
  onValueChange,
  showSelectAll,
  onClose,
}) => {
  const toggleOption = (option: string) => {
    const newSelectedValues = selectedValues.includes(option)
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option];
    onValueChange(newSelectedValues);
  };

  const toggleAll = () => {
    if (selectedValues.length === options.length) {
      onValueChange([]);
    } else {
      onValueChange(options.map((option) => option.value));
    }
  };

  return (
    <Command>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {showSelectAll && (
            <CommandItem
              key="select-all"
              onSelect={toggleAll}
              className="cursor-pointer"
            >
              <div
                className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                  selectedValues.length === options.length
                    ? "bg-primary text-primary-foreground"
                    : "opacity-50 [&_svg]:invisible"
                )}
              >
                <CheckIcon className="h-4 w-4" />
              </div>
              <span>Select All</span>
            </CommandItem>
          )}
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <CommandItem
                key={option.value}
                onSelect={() => toggleOption(option.value)}
                className="cursor-pointer"
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <CheckIcon className="h-4 w-4" />
                </div>
                <span>{option.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup>
          <CommandItem
            onSelect={onClose}
            className="justify-center cursor-pointer"
          >
            Close
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};