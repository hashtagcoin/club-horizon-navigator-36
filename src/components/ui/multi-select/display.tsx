import React from "react";
import { Badge } from "@/components/ui/badge";
import { XCircle, XIcon, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { multiSelectVariants } from "./styles";
import { MultiSelectOption } from "./types";

interface DisplayProps {
  selectedValues: string[];
  options: MultiSelectOption[];
  placeholder: string;
  maxCount: number;
  variant?: "default" | "secondary" | "destructive" | "inverted";
  isAnimating?: boolean;
  animation?: number;
  onClear: () => void;
  onToggleOption: (value: string) => void;
  onClearExtra: () => void;
}

export const MultiSelectDisplay = ({
  selectedValues,
  options,
  placeholder,
  maxCount,
  variant,
  isAnimating,
  animation,
  onClear,
  onToggleOption,
  onClearExtra,
}: DisplayProps) => {
  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === options.length) {
      return "All Venues";
    }
    if (selectedValues.length > 1) {
      return "Many";
    }
    const selectedOption = options.find(opt => opt.value === selectedValues[0]);
    return selectedOption?.label || selectedValues[0];
  };

  return (
    <div className="flex justify-between items-center w-full">
      <span className="text-sm text-muted-foreground mx-3">
        {getDisplayText()}
      </span>
      <div className="flex items-center justify-between">
        {selectedValues.length > 0 && (
          <>
            <XIcon
              className="h-4 mx-2 cursor-pointer text-muted-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
            />
            <Separator orientation="vertical" className="flex min-h-6 h-full" />
          </>
        )}
        <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
      </div>
    </div>
  );
};