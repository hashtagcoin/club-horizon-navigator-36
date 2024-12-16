import React from "react";
import { ChevronDown } from "lucide-react";
import { MultiSelectOption } from "./types";

interface DisplayProps {
  selectedValues: string[];
  options: MultiSelectOption[];
  placeholder: string;
}

export const MultiSelectDisplay = ({
  selectedValues,
  options,
  placeholder,
}: DisplayProps) => {
  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === options.length) {
      return "ALL";
    }
    if (selectedValues.length > 1) {
      return "Many";
    }
    const selectedOption = options.find(
      (option) => option.value === selectedValues[0]
    );
    return selectedOption?.label || placeholder;
  };

  return (
    <div className="flex items-center justify-between w-full">
      <span className="text-sm text-muted-foreground mx-3">
        {getDisplayText()}
      </span>
      <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
    </div>
  );
};