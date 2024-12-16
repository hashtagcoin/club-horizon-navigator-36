import * as React from "react";
import { XCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MultiSelectDisplayProps } from "./types";

export const MultiSelectDisplay: React.FC<MultiSelectDisplayProps> = ({
  selectedValues,
  options,
  placeholder,
  maxCount = 3,
  variant,
  animation = 0,
  onClear,
}) => {
  if (selectedValues.length === 0) {
    return (
      <div className="flex items-center justify-between w-full mx-auto">
        <span className="text-sm text-muted-foreground mx-3">{placeholder}</span>
        <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex flex-wrap items-center gap-1">
        {selectedValues.slice(0, maxCount).map((value) => {
          const option = options.find((o) => o.value === value);
          return (
            <Badge
              key={value}
              variant={variant}
              className="flex items-center gap-1"
              style={{ animationDuration: `${animation}s` }}
            >
              {option?.label}
              <XCircle
                className="h-3 w-3 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
              />
            </Badge>
          );
        })}
        {selectedValues.length > maxCount && (
          <Badge variant={variant}>
            +{selectedValues.length - maxCount} more
          </Badge>
        )}
      </div>
      <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
    </div>
  );
};