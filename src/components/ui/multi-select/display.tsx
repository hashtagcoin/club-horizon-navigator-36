import * as React from "react";
import { XCircle, ChevronDown, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { multiSelectVariants } from "./styles";
import { MultiSelectOption } from "./types";

interface MultiSelectDisplayProps {
  selectedValues: string[];
  options: MultiSelectOption[];
  placeholder: string;
  variant?: "default" | "secondary" | "destructive" | "inverted";
  maxCount?: number;
  onClear?: () => void;
  onRemoveOption?: (value: string) => void;
}

export function MultiSelectDisplay({
  selectedValues,
  options,
  placeholder,
  variant,
  maxCount = 3,
  onClear,
  onRemoveOption,
}: MultiSelectDisplayProps) {
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
      <div className="flex flex-wrap items-center">
        {selectedValues.slice(0, maxCount).map((value) => {
          const option = options.find((o) => o.value === value);
          const IconComponent = option?.icon;
          return (
            <Badge
              key={value}
              className={cn(multiSelectVariants({ variant }))}
            >
              {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
              {option?.label}
              {onRemoveOption && (
                <XCircle
                  className="ml-2 h-4 w-4 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveOption(value);
                  }}
                />
              )}
            </Badge>
          );
        })}
        {selectedValues.length > maxCount && (
          <Badge
            className={cn(
              "bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
              multiSelectVariants({ variant })
            )}
          >
            {`+ ${selectedValues.length - maxCount} more`}
          </Badge>
        )}
      </div>
      <div className="flex items-center justify-between">
        {onClear && (
          <XIcon
            className="h-4 mx-2 cursor-pointer text-muted-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
          />
        )}
        <Separator orientation="vertical" className="flex min-h-6 h-full" />
        <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
      </div>
    </div>
  );
}