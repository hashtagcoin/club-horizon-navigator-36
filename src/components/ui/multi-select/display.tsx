import * as React from "react";
import { XCircle, ChevronDown, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { multiSelectVariants } from "./styles";

interface MultiSelectDisplayProps {
  selectedValues: string[];
  options: { label: string; value: string }[];
  placeholder: string;
  maxCount?: number;
  variant?: "default" | "secondary" | "destructive" | "inverted";
  animation?: number;
  onClear: () => void;
}

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
      <div className="flex flex-wrap items-center">
        {selectedValues.slice(0, maxCount).map((value) => {
          const option = options.find((o) => o.value === value);
          return (
            <Badge
              key={value}
              className={cn(multiSelectVariants({ variant }))}
              style={{ animationDuration: `${animation}s` }}
            >
              {option?.label}
              <XCircle
                className="ml-2 h-4 w-4 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  const newValues = selectedValues.filter((v) => v !== value);
                  onClear();
                }}
              />
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
        <XIcon
          className="h-4 mx-2 cursor-pointer text-muted-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
        />
        <Separator orientation="vertical" className="flex min-h-6 h-full" />
        <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
      </div>
    </div>
  );
};