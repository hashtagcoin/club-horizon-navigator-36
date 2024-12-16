import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ChevronDown, XIcon } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface MultiSelectDisplayProps {
  selectedValues: string[];
  options: { label: string; value: string }[];
  placeholder: string;
  onClear: () => void;
}

export const MultiSelectDisplay = ({
  selectedValues,
  options,
  placeholder,
  onClear
}: MultiSelectDisplayProps) => {
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