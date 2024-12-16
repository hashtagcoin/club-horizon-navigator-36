import * as React from "react";
import { MultiSelectProps } from "./types";
import { MultiSelectDisplay } from "./display";
import { MultiSelectPopover } from "./popover";

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      asChild = false,
      className,
      showSelectAll = false,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const handleValueChange = (values: string[]) => {
      setSelectedValues(values);
      onValueChange(values);
    };

    return (
      <MultiSelectPopover
        ref={ref}
        {...props}
        options={options}
        selectedValues={selectedValues}
        onValueChange={handleValueChange}
        variant={variant}
        placeholder={placeholder}
        animation={animation}
        maxCount={maxCount}
        modalPopover={modalPopover}
        asChild={asChild}
        className={className}
        showSelectAll={showSelectAll}
        isOpen={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
      />
    );
  }
);

MultiSelect.displayName = "MultiSelect";