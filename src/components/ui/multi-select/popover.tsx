import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MultiSelectDisplay } from "./display";
import { MultiSelectContent } from "./content";
import { MultiSelectProps } from "./types";

export const MultiSelectPopover = React.forwardRef<HTMLButtonElement, MultiSelectProps & {
  selectedValues: string[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}>(
  ({
    options,
    selectedValues,
    onValueChange,
    variant,
    placeholder,
    animation,
    maxCount,
    modalPopover,
    className,
    showSelectAll,
    isOpen,
    onOpenChange,
    ...props
  }, ref) => {
    return (
      <Popover open={isOpen} onOpenChange={onOpenChange} modal={modalPopover}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            className={className}
            onClick={() => onOpenChange(true)}
          >
            <MultiSelectDisplay
              selectedValues={selectedValues}
              options={options}
              placeholder={placeholder}
              maxCount={maxCount}
              variant={variant}
              animation={animation}
              onClear={() => onValueChange([])}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <MultiSelectContent
            options={options}
            selectedValues={selectedValues}
            onValueChange={onValueChange}
            showSelectAll={showSelectAll}
            onClose={() => onOpenChange(false)}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelectPopover.displayName = "MultiSelectPopover";